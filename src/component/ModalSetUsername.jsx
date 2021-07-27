import { useState, useRef, useEffect } from 'react';
import { useClickAway, useKey } from 'react-use';
import classNames from 'classnames';

import Avatar from './Avatar';

const ModalSetUsername = ({ initialUsername, onClose, onSetUsername }) => {
  const [username, setUsername] = useState(initialUsername);

  const containerRef = useRef(null);
  const inputRef = useRef();

  useClickAway(containerRef, onClose);

  useKey('Escape', onClose);

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (username !== '') {
      onSetUsername(username);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <span className="w-full h-full fixed inset-0 flex items-center justify-center bg-gray-100 bg-opacity-90 cursor-pointer">

        <section className="w-full max-w-xs flex flex-grow flex-col shadow rounded-2xl bg-white p-8 cursor-auto" ref={containerRef}>
          <header>
            <h3 className="text-center font-900 text-32/16">Set Username</h3>
          </header>

          <div className="relative w-full h-12 mt-8">
            <span className="absolute left-4 top-2 bottom-2 flex items-center justify-center z-1">
              <Avatar name={username} size={5} />
            </span>

            <input
              className="absolute inset-0 w-full border rounded-2xl text-16/16 focus:outline-none py-2 pl-12 pr-4"
              placeholder="type cool username"
              minLength={1}
              maxLength={48}
              value={username}
              onChange={(e) => setUsername(e.currentTarget.value)}
              ref={inputRef}
            />
          </div>

          <footer className="grid px-4 mt-4">
            <button
              type="submit"
              className={classNames('font-500 text-white rounded-2xl py-2', {
                'bg-blue-500 active:bg-blue-600': username.length > 0,
                'bg-blue-400 cursor-not-allowed': username.length < 1,
              })}
              disabled={username.length < 1}
            >SET</button>
          </footer>
        </section>

      </span>
    </form>
  );
};

export default ModalSetUsername;
