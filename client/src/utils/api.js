import axios from 'axios'

function getLocalToken() {
  return window.localStorage.getItem('token')
}

function getLocalRefreshToken() {
  return window.localStorage.getItem('refreshToken')
}

const instance = axios.create({
  baseURL: 'http://localhost:4000',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  }
})

// Hàm cập nhật token vào header và localStorage
instance.setToken = (token) => {
  instance.defaults.headers.common['Authorization'] = `Bearer ${token}`
  window.localStorage.setItem('token', token)
}

// Hàm lưu refreshToken
instance.setRefreshToken = (refreshToken) => {
  window.localStorage.setItem('refreshToken', refreshToken)
}

// Gắn token tự động trước mỗi request (trừ /login và /token)
instance.interceptors.request.use((config) => {
  const token = getLocalToken()
  const isAuthRoute = config.url.includes('/login') || config.url.includes('/token')
  if (token && !isAuthRoute) {
    config.headers['Authorization'] = `Bearer ${token}`
  }
  return config
}, (error) => {
  return Promise.reject(error)
})

// Hàm gọi refresh token
function refreshToken () {
  return instance.post('/token', {
    refreshToken: getLocalRefreshToken()
  })
}

// Xử lý lỗi 401 và tự động refresh token
instance.interceptors.response.use((response) => {
  return response
}, async (error) => {
  const originalRequest = error.config

  if (error.response?.status === 401 && !originalRequest._retry) {
    originalRequest._retry = true
    try {
      const rs = await refreshToken()
      const newToken = rs.data.token
      instance.setToken(newToken)
      originalRequest.headers['Authorization'] = `Bearer ${newToken}`
      return instance(originalRequest)
    } catch (refreshError) {
      return Promise.reject(refreshError)
    }
  }

  return Promise.reject(error)
})

export default instance
