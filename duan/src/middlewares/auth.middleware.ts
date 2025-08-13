import { Request, Response, NextFunction } from 'express'
import HTTP_STATUS from '~/constants/httpStatus'
import { JsonWebTokenError } from 'jsonwebtoken'
import { verifyToken } from '~/utils/jwt'

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  const authorization = req.headers.authorization
  const access_token = authorization?.split(' ')[1]

  if (!access_token) {
    return res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: 'ACCESS_TOKEN_IS_REQUIRED' })
  }

  try {
    const decoded = await verifyToken({
      token: access_token,
      secretOrPublicKey: process.env.JWT_SECRET_ACCESS_TOKEN as string
    })

    req.user = decoded as any// 👈 Gán vào req.user để controller dùng được
    next()
  } catch (error) {
    return res.status(HTTP_STATUS.UNAUTHORIZED).json({
      message: (error as JsonWebTokenError).message
    })
  }
}
