/* eslint-disable no-unused-vars */
import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import socketIoClient from 'socket.io-client';
import classNames from 'classnames';
import faker from 'faker';

import {
  RiLoaderFill,
} from 'react-icons/ri';

import Avatar from './component/Avatar';
import Message from './component/Message';
import ModalCreateRoom from'./component/ModalCreateRoom';
import ModalSetUsername from'./component/ModalSetUsername';

const App = () => {
  const [loading, setLoading] = useState(true);

  const [id, setId] = useState(null);
  const [username, setUsername] = useState(null);

  const [sockets, setSockets] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [messages, setMessages] = useState([]);

  const [message, setMessage] = useState('');

  const [selectedRoomId, setSelectedRoomId] = useState(null);

  const [showModalCreateRoom, setShowModalCreateRoom] = useState(false);
  const [showModalSetUsername, setShowModalSetUsername] = useState(false);

  const connection = useRef();
  const roomMainRef = useRef();

  const room = useMemo(() => {
    if (!selectedRoomId) {
      return null;
    }

    return rooms.find((room) => room.id === selectedRoomId) ?? null;
  }, [rooms, selectedRoomId]);

  const mappedMessages = useMemo(() => {
    return messages
      .map((message, index, array) => {
        const owner = sockets.find((s) => s.id === message.socketId);

        if (message.type === 'notification') {
          return message;
        }

        return {
          ...message,
          username: owner?.username ?? 'Guest',
          again: index > 0 && array[index - 1].type === 'message' && array[index - 1].socketId === message.socketId,
        };
      })
      ;
  }, [sockets, messages]);

  // set connection
  useEffect(() => {
    if (!connection.current) {
      connection.current = socketIoClient.io(process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000');

      connection.current.on('connect', () => {
        console.log('connect id =>', connection.current.id, connection.current);

        setId(connection.current.id);

        if (connection.current.connected) {
          const username = window.localStorage.getItem('username') ?? faker.name.firstName();
  
          connection.current.emit('set username', username);
  
          setTimeout(() => {
            setLoading(false);
          }, 100);
        }
      });
  
      connection.current.on('connect_error', (error) => console.error('connect_error =>', error.message));
  
      connection.current.on('reconnect', () => console.log('connect =>', connection.current.id));
      connection.current.on('reconnect_error', (error) => console.error('reconnect_error =>', error.message));
  
      connection.current.on('set username', setUsername);
      connection.current.on('sockets', setSockets);
      connection.current.on('rooms', setRooms);
  
      connection.current.on('send message', (data) => {
        setMessages((prev) => [...prev, data]);
      });
    }
  }, []);

  // scroll to last message
  useEffect(() => {
    if (roomMainRef.current) {
      roomMainRef.current.scrollTo(0, roomMainRef.current.scrollHeight + 1);
    }
  }, [messages]);

  const handleSetUsername = useCallback((newUsername) => {
    window.localStorage.setItem('username', newUsername);

    connection.current.emit('set username', newUsername, selectedRoomId);

    setShowModalSetUsername(false);
  }, [selectedRoomId]);

  const handleCreateRoom = useCallback((roomId) => {
    setSelectedRoomId(roomId);
    setShowModalCreateRoom(false);

    connection.current.emit('join room', roomId);

    if (selectedRoomId) {
      connection.current.emit('leave room', selectedRoomId);
    }
  }, [selectedRoomId]);

  const handleSelectRoom = useCallback((roomId) => {
    if (selectedRoomId) {
      connection.current.emit('leave room', selectedRoomId);
    }

    connection.current.emit('join room', roomId);

    console.log('select room', 'join');

    setSelectedRoomId(roomId);
  }, [selectedRoomId]);

  const handleSendMessage = useCallback((e) => {
    e.preventDefault();

    if (message !== '') {
      connection.current.emit('send message', { roomId: selectedRoomId, message })

      setMessage('');
    }
  }, [selectedRoomId, message]);

  if (loading) {
    return (
      <span className="w-full h-full fixed inset-0 flex items-center justify-center">
        <RiLoaderFill className="text-72/16 text-blue-500 animate-spin" />
      </span>
    );
  }

  return (
    <>
      <span className="w-full h-full fixed inset-0 flex flex-row bg-white overflow-hidden">
        <aside className="w-80 h-full flex flex-col overflow-hidden overflow-y-auto">
          <header className="h-16 flex items-center justify-between gap-4 px-8">
            <h3 className="font-700 text-18/16">Rooms</h3>

            <button
              className="text-blue-600 hover:bg-blue-50 active:bg-blue-100 font-500 rounded-2xl py-2 px-2"
              onClick={() => setShowModalCreateRoom(true)}
            >CREATE</button>
          </header>

          <main
            className={classNames('w-full h-full relative flex-1 py-4 px-4', {
              'overflow-y-auto': rooms.length > 0,
              'overflow-hidden': rooms.length === 0,
            })}
          >
            {rooms.length === 0 && (
              <span className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 font-600 text-18/16 text-gray-500">NO ROOM YET.</span>
            )}

            <ul className="flex flex-col gap-2">
              {rooms.length === 0 && [...Array(15).keys()].map((i) => (
                <li key={i} className="w-full flex items-center rounded-2xl bg-gray-100 gap-4 py-2.5 px-4">
                  <span className="w-10 h-10 bg-gray-300 rounded-full" />

                  <span className="w-full flex-1 flex flex-col items-start gap-2">
                    <span className="w-4/12 h-4 bg-gray-300 rounded-full" />

                    <span className="w-7/12 h-2.5 bg-gray-300 rounded-full" />
                  </span>
                </li>
              ))}

              {rooms.map((room) => {
                return (
                  <li
                    key={room.id}
                    className={classNames('w-full flex items-center rounded-2xl transform transition-colors duration-200 gap-4 py-2.5 px-4', {
                      'hover:bg-gray-100 active:bg-gray-200 cursor-pointer': selectedRoomId !== room.id,
                      'bg-gray-100 pointer-events-none': selectedRoomId === room.id,
                    })}
                    onClick={() => handleSelectRoom(room.id)}
                  >
                    <Avatar name={room.id} />

                    <span className="w-full flex-1 flex flex-col items-start gap-1 overflow-x-hidden">
                      <h6 className="font-600 text-16/16 truncate">{room.id}</h6>

                      <p className="text-gray-500 truncate">{`${room.sockets.length} member${room.sockets.length > 1 ? 's' : ''}`}</p>
                    </span>
                  </li>
                );
              })}
            </ul>
          </main>

          <footer className="max-w-full flex justify-start p-4">
            <button
              className="flex items-center bg-gray-50 rounded-2xl gap-4 p-4"
              onClick={() => setShowModalSetUsername(true)}
            >
              <Avatar name={username} size={8} />

              <span className="block text-16/16">{username}</span>
            </button>
          </footer>
        </aside>

        <div className="w-full h-full flex-1 bg-gray-50 border-l overflow-hidden">
          {room && (
            <>
              <span className="w-full h-full flex-1 flex flex-col overflow-hidden">
                <nav className="w-full h-16 flex-shrink-0 flex items-center justify-between bg-white border-b px-8 overflow-hidden">
                  <span className="flex flex-row items-center gap-4">
                    <Avatar name={room.id} size={8} />

                    <span className="flex flex-col leading-none gap-0.5">
                      <h1 className="font-700 text-16/16">{room.id}</h1>

                      <span
                        className="blocktext-gray-500 font-400 text-12/16"
                      >
                        {room.sockets.length > 1
                          ? `${room.sockets.length} members`
                          : `${room.sockets.length} member`
                        }
                      </span>
                    </span>
                  </span>

                  <button
                    className="text-red-500 hover:bg-red-50 active:bg-red-100 font-500 rounded-2xl py-2 px-2"
                    onClick={() => {
                      setSelectedRoomId(null);
                      setMessages([]);
      
                      connection.current.emit('leave room', selectedRoomId);
                    }}
                  >LEAVE ROOM</button>
                </nav>

                <main className="w-full h-full flex-1 overflow-y-auto p-8" ref={roomMainRef}>
                  <ul className="flex flex-col select-text gap-2">
                    {mappedMessages.map((message) => {
                      return (
                        <Message
                          key={message.id}
                          type={message.type}
                          username={message.username}
                          message={message.message}
                          again={message?.again}
                          me={message.socketId === id}
                        />
                      );
                    })}
                  </ul>
                </main>

                <footer className="w-full flex-shrink-0 overflow-hidden p-4">
                  <form
                    className="block w-full relative rounded-2xl bg-white shadow-sm"
                    onSubmit={handleSendMessage}
                  >
                    <input
                      className="w-full bg-transparent focus:outline-none text-16/16 py-4 pl-8 pr-14"
                      placeholder="type message"
                      value={message}
                      onChange={(e) => setMessage(e.currentTarget.value)}
                    />
                  </form>
                </footer>
              </span>
            </>
          )}

          {!room && (
            <main className="w-full h-full flex-1 flex items-center justify-center gap-2 p-8">
              <p>Join</p>
              <p>or</p>

              <button
                className="text-blue-600 hover:bg-blue-50 active:bg-blue-100 font-500 rounded-2xl py-2 px-2"
                onClick={() => setShowModalCreateRoom(true)}
              >CREATE ROOM</button>
            </main>
          )}
        </div>
      </span>

      {showModalCreateRoom && (
        <ModalCreateRoom
          onClose={() => setShowModalCreateRoom(false)}
          onCreateRoom={handleCreateRoom}
        />
      )}

      {showModalSetUsername && (
        <ModalSetUsername
          initialUsername={username}
          onClose={() => setShowModalSetUsername(false)}
          onSetUsername={handleSetUsername}
        />
      )}
    </>
  );
}

export default App;
