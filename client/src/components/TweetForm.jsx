import { useState } from 'react'
import axios from '../utils/api'

export default function TweetForm({ onPostSuccess }) {
  const [content, setContent] = useState('')
  const [hashtags, setHashtags] = useState([])
  const [hashtagInput, setHashtagInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleAddHashtag = (e) => {
    if ((e.key === 'Enter' || e.key === ',') && hashtagInput.trim()) {
      e.preventDefault()
      const tag = hashtagInput.trim().replace(/^#/, '')
      if (tag && !hashtags.includes(tag)) {
        setHashtags([...hashtags, tag])
      }
      setHashtagInput('')
    }
  }

  const removeHashtag = (tagToRemove) => {
    setHashtags(hashtags.filter(tag => tag !== tagToRemove))
  }

  const handleSubmit = async () => {
    if (!content.trim()) {
      setError('Nội dung không được để trống.')
      return
    }

    const tweetPayload = {
      type: 0,
      audience: 1,
      content: content.trim(),
      parent_id: null,
      hashtags,
      mentions: [],
      medias: []
    }

    try {
      setLoading(true)
      setError(null)

      const token = localStorage.getItem('token')
      if (!token) {
        setError('Không tìm thấy access token. Vui lòng đăng nhập lại.')
        setLoading(false)
        return
      }

      const response = await axios.post('/tweets', tweetPayload, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      setContent('')
      setHashtags([])
      setHashtagInput('')
      if (onPostSuccess) onPostSuccess(response.data.result)
    } catch (err) {
      const serverMessage =
        err.response?.data?.message ||
        err.response?.data?.error?.authorization?.msg ||
        'Đã xảy ra lỗi.'
      setError(serverMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex gap-4 p-4 border-b border-gray-700">
      {/* Avatar */}
      <div className="w-10 h-10 rounded-full bg-gray-600 flex-shrink-0" />

      {/* Form area */}
      <div className="flex-1">
        {error && (
          <div className="mb-2 text-red-500 text-sm">⚠️ {error}</div>
        )}

        {/* Content */}
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What’s happening?"
          rows={3}
          maxLength={280}
          className="w-full bg-black text-white border-none outline-none resize-none text-lg placeholder-gray-500"
        />

        {/* Hashtag Input */}
        <input
          type="text"
          value={hashtagInput}
          onChange={(e) => setHashtagInput(e.target.value)}
          onKeyDown={handleAddHashtag}
          placeholder="Thêm hashtag và nhấn Enter..."
          className="w-full mt-2 bg-black text-white placeholder-gray-500 border border-gray-600 p-2 rounded-md text-sm"
        />

        {/* Hashtag List */}
        {hashtags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {hashtags.map((tag) => (
              <span
                key={tag}
                className="bg-gray-700 text-white px-3 py-1 rounded-full text-sm flex items-center gap-1"
              >
                #{tag}
                <button
                  onClick={() => removeHashtag(tag)}
                  className="text-red-400 hover:text-red-600 font-bold ml-1"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="mt-4 flex items-center justify-between">
          <span className="text-sm text-gray-400">
            {content.length}/280
          </span>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-500 rounded-full text-white hover:bg-blue-600 disabled:opacity-50"
            disabled={loading || !content.trim()}
          >
            {loading ? 'Đang đăng...' : 'Đăng'}
          </button>
        </div>
      </div>
    </div>
  )
}
