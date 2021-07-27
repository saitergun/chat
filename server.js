const { createServer } = require('http')
const path = require('path')
const cors = require('cors')
const express = require('express')
const socketIo = require('socket.io')
const _includes = require('lodash/includes')
const _reverse = require('lodash/reverse')
const { v4: uuidV4 } = require('uuid')

const PORT = process.env.PORT || 5000

const app = express()
const server = createServer(app)

const io = socketIo(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  }
})

app.use(cors())

app.use(express.static(path.join(__dirname, 'build')))
app.use(express.static(path.join(__dirname, 'public')))

app.get('/helo', async (req, res) => {
  res.json('helö')
})

server.listen(PORT, '0.0.0.0', () => {
  console.log('Listening on port %d', PORT)
})

io.on('connection', async (socket) => {
  const sendSockets = () => {
    const sockets = Array.from(io.sockets.sockets.values())
      .map(({ id, username }) => ({ id, username }))

    io.emit('sockets', sockets)
  }

  const sendRooms = () => {
    const userIds = Array.from(io.sockets.sockets.values()).map((s) => s.id)

    const rooms = Array.from(socket.adapter.rooms)
      .map(([id, sockets]) => ({ id, sockets: Array.from(sockets) }))
      .filter((r) => !_includes(userIds, r.id))

    io.emit('rooms', _reverse(rooms))
  }

  sendRooms()
  sendSockets()

  // socket.on('disconnect', () => {})

  socket.on('set username', (username, roomId) => {
    const oldUsername = socket.username;

    socket.username = username

    socket.emit('set username', username)

    if (roomId) {
      io.to(roomId).emit('send message', {
        id: uuidV4(),
        roomId,
        socketId: socket.id,
        time: new Date(),
        type: 'notification',
        message: `"${oldUsername}" is now "${username}"`,
      });
    }

    sendSockets()
  })

  socket.on('join room', (roomId) => {
    socket.join(roomId)

    io.to(roomId).emit('send message', {
      id: uuidV4(),
      roomId,
      socketId: socket.id,
      time: new Date(),
      type: 'notification',
      message: `${socket.username} join`,
    });

    sendRooms()
  })

  socket.on('leave room', (roomId) => {
    socket.leave(roomId)

    io.to(roomId).emit('send message', {
      id: uuidV4(),
      roomId,
      socketId: socket.id,
      time: new Date(),
      type: 'notification',
      message: `${socket.username} left`,
    });

    sendRooms()
  })

  socket.on('send message', ({ roomId, message }) => {
    io.to(roomId).emit('send message', {
      id: uuidV4(),
      roomId,
      socketId: socket.id,
      time: new Date(),
      type: 'message',
      message,
    });
  })
})
