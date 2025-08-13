import express from 'express'
import database from './services/database.services'
import 'dotenv/config'
import usersRouter from './routes/users.router'
import { defaultErrorHandler } from './middlewares/error.middlewares'
import tweetsRouter from './routes/tweets.router'

import http from 'http' // 👈 Dành cho socket.io
import { Server } from 'socket.io' // 👈 Dành cho socket.io
const cors = require('cors');

const app = express()

const HOST = process.env.SV_HOST || 'localhost'
const PORT = parseInt(process.env.SV_PORT || '4000', 10)

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Gắn router
app.use('/', usersRouter)
app.use('/tweets', tweetsRouter)

// Middleware xử lý lỗi
app.use(defaultErrorHandler)

const startServer = async () => {
  try {
    await database.connect()

    // 🔌 Tạo HTTP server và gắn vào Socket.IO
    const server = http.createServer(app)

    const io = new Server(server, {
      cors: {
        origin: 'http://localhost:3000', // Cho phép React frontend kết nối
        methods: ['GET', 'POST']
      }
    })

    // 🎉 Khi có client kết nối
    io.on('connection', (socket) => {
      console.log('🟢 Client connected:', socket.id)

      // 📩 Khi client gửi tin nhắn
      socket.on('send_message', (data) => {
        console.log('📥 Nhận tin nhắn:', data)
        io.emit('receive_message', data) // Gửi cho tất cả các client
      })

      socket.on('disconnect', () => {
        console.log('🔴 Client disconnected:', socket.id)
      })
    })

    // 🚀 Khởi động server (socket + express)
    server.listen(PORT, HOST, () => {
      console.log(`✅ Server running at http://${HOST}:${PORT}/`)
    })
  } catch (err) {
    console.error('❌ Failed to start server:', err)
  }
}

startServer()
