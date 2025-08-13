export interface registerReqBody {
  username: string
  email: string
  date_of_birth: string
  password: string
}
export interface loginReqBody {
  email: string
  password: string
}

export interface logoutReqBody {
  refresh_token: string
}

export interface refreshTokenReqBody {
  refresh_token: string
}
export interface TokenPayload {
  user_id: string // hoặc ObjectId nếu bạn dùng MongoDB ObjectId
  email: string
  verify: boolean
  exp?: number
  iat?: number
}

