// Import React và các hook
import { useEffect, useState } from 'react'
// Kết nối với socket.io
import { io } from 'socket.io-client'
// Import Emoji Picker
import EmojiPicker from 'emoji-picker-react'

// Kết nối tới server backend
const socket = io('http://localhost:4000')

function Chat() {
  // Các state cơ bản
  const [username, setUsername] = useState('')
  const [inputUsername, setInputUsername] = useState('')
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([])

  // State để bật/tắt emoji picker
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)

  // Khi nhận tin nhắn từ server
  useEffect(() => {
    socket.on('receive_message', (data) => {
      setMessages((prev) => [...prev, data])
    })

    return () => socket.off('receive_message')
  }, [])

  // Gửi tin nhắn văn bản
  const sendMessage = () => {
    if (message.trim() !== '' && username.trim() !== '') {
      socket.emit('send_message', {
        username,
        content: message,
        timestamp: new Date().toLocaleTimeString(),
        type: 'text'
      })
      setMessage('')
    }
  }

  // Gửi hình ảnh
  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      socket.emit('send_message', {
        username,
        content: reader.result, // base64 image
        timestamp: new Date().toLocaleTimeString(),
        type: 'image'
      })
    }
    reader.readAsDataURL(file)
  }

  // Nếu chưa nhập tên người dùng, hiển thị form nhập tên
  if (!username.trim()) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col justify-center items-center p-6">
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg w-full max-w-md text-center">
          <h2 className="text-2xl font-bold mb-4">🔐 Nhập tên người dùng</h2>
          <input
            type="text"
            placeholder="Tên của bạn..."
            className="w-full p-3 rounded bg-gray-700 text-white mb-4 focus:ring-2 focus:ring-blue-500 outline-none"
            value={inputUsername}
            onChange={(e) => setInputUsername(e.target.value)}
          />
          <button
            className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-600"
            onClick={() => {
              if (inputUsername.trim() !== '') {
                setUsername(inputUsername)
              }
            }}
          >
            Vào Chat
          </button>
        </div>
      </div>
    )
  }

  // Nếu đã có tên, hiển thị giao diện chat
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center p-6">
      {/* Tiêu đề */}
      <div className="flex items-center gap-2 mb-6 bg-blue-600 text-white px-4 py-2 rounded-2xl shadow-lg">
        <span className="text-2xl font-bold">💬 Chat Realtime</span>
      </div>

      {/* Khung tin nhắn */}
      <div className="w-full max-w-xl bg-[#1e293b] rounded-lg shadow-lg p-4 mb-4 h-[400px] overflow-y-auto">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`mb-3 pb-2 ${
              msg.username === username ? 'text-right' : 'text-left'
            }`}
          >
            <div className="text-sm text-gray-400">
              [{msg.timestamp}] <strong>{msg.username}</strong>
            </div>
            <div className="mt-1 text-base">
              {msg.type === 'image' ? (
                <img
                  src={msg.content}
                  alt="Ảnh gửi"
                  className="max-w-xs rounded-lg inline-block"
                />
              ) : (
                msg.content
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Giao diện nhập tin nhắn và nút gửi */}
      <div className="w-full max-w-xl flex gap-2 items-center">
        {/* Nút chọn emoji */}
        <button
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          className="text-2xl bg-gray-800 rounded-full px-3"
        >
          😊
        </button>

        {/* Nút chọn ảnh */}
        <label className="text-2xl bg-gray-800 rounded-full px-3 cursor-pointer">
          📷
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
        </label>

        {/* Ô nhập tin nhắn */}
        <input
          className="flex-1 p-3 rounded-full bg-gray-800 text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Nhập tin nhắn..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
        />

        {/* Nút gửi */}
        <button
          onClick={sendMessage}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 rounded-full font-semibold"
        >
          Gửi
        </button>
      </div>

      {/* Emoji Picker */}
      {showEmojiPicker && (
        <div className="mt-2">
          <EmojiPicker
            onEmojiClick={(emojiData) => {
              setMessage((prev) => prev + emojiData.emoji)
            }}
            theme="dark"
          />
        </div>
      )}
    </div>
  )
}

export default Chat
