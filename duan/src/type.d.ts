import { Request } from 'express'
import { TokenPayload } from 'jsonwebtoken'
import { TokenPayload } from '~/types/user.type'
import User from './models/schemas/User.schemas'
declare module 'express' {
  interface Request {
    user?: User
    decoded_refresh_token?: TokenPayload
    decoded_authorization?:TokenPayload
    decoded_email_verify_token?: TokenPayload
  }
}
