import { loginReqBody, logoutReqBody, refreshTokenReqBody, registerReqBody } from '~/models/requests/User.requests'
import database from './database.services'
import User from '~/models/schemas/User.schemas'
import { hashPassword } from '~/utils/crypto'
import { signToken } from '~/utils/jwt'
import { TokenType, UserVerifyStatus } from '~/constants/enums'
import 'dotenv/config'
import Refresh_token from '~/models/schemas/Refresh_token.schemas'

// Create access token
const signAccessToken = async (user_id: string, verify: UserVerifyStatus) => {
  return await signToken({
    payload: {
      user_id,
      verify,
      token_type: TokenType.AccessToken
    },
    privateKey: process.env.JWT_SECRET_ACCESS_TOKEN as string,
    options: {
      expiresIn: Number(process.env.ACCESS_TOKEN_EXPIRES_IN),
    }
  })
}

// Create refresh token
const signRefreshToken = async (user_id: string, verify: UserVerifyStatus, exp?: number) => {
  if (exp) {
    return await signToken({
      payload: {
        user_id,
        verify,
        token_type: TokenType.RefreshToken,
      
      },
      privateKey: process.env.JWT_SECRET_REFRESH_TOKEN as string,
    })
  } else {
    return await signToken({
      payload: {
        user_id,
        verify,
        token_type: TokenType.RefreshToken
      },
      privateKey: process.env.JWT_SECRET_REFRESH_TOKEN as string,
      options: {
        expiresIn: Number(process.env.ACCESS_TOKEN_EXPIRES_IN),
      }
    })
  }
}

// Create tokens
const createTokens = async (user_id: string, verify: UserVerifyStatus, expRT?: number) => {
  const [access_token, refresh_token] = await Promise.all([
    signAccessToken(user_id, verify),
    signRefreshToken(user_id, verify, expRT)
  ])
  return {
    access_token,
    refresh_token
  }
}

// Register
export const registerService = async (reqBody: registerReqBody) => {
  // Insert user to database
  return await database.users().insertOne(
    new User({
      ...reqBody,
      date_of_birth: new Date(reqBody.date_of_birth),
      password: hashPassword(reqBody.password)
    })
  )
}

// Login
export const loginService = async (reqBody: loginReqBody) => {
  // Check if user exists
  const user = await database.users().findOne({ ...reqBody, password: hashPassword(reqBody.password) })

  if (user) {
    const userId = user._id.toString()
    const verify = user.verify

    // Create tokens
    const token = await createTokens(userId, verify)

    // Save refresh token to database
    const refresh_token = new Refresh_token({ user_id: userId, verify, token: token.refresh_token })
    await database.refresh_tokens().insertOne(refresh_token)

    // Return tokens to client
    return token

    // null if user does not exist
  } else return user
}

//logout
export const logoutService = async (reqBody: logoutReqBody) => {
  // Delete refresh token
  return await database.refresh_tokens().deleteOne({ token: reqBody.refresh_token })
}

// Refresh token
export const refreshTokenService = async ({
  user_id,
  verify,
  exp,
  refresh_token
}: {
  user_id: string
  verify: UserVerifyStatus
  exp: number
  refresh_token: string
}) => {
  // Create new tokens
  const { access_token: newAT, refresh_token: newRT } = await createTokens(user_id, verify, exp)
  // Update refresh token
  await database
    .refresh_tokens()
    .updateOne({ token: refresh_token }, { $set: { verify, token: newRT, updated_at: new Date() } })

  // Return new tokens
  return {
    access_token: newAT,
    refresh_token: newRT
  }
}
