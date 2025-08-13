import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import HTTP_STATUS from '~/constants/httpStatus'
import { loginReqBody, logoutReqBody, refreshTokenReqBody, registerReqBody } from '~/models/requests/User.requests'
import { loginService, logoutService, refreshTokenService, registerService } from '~/services/users.services'

export const registerController = async (req: Request<ParamsDictionary, any, registerReqBody>, res: Response) => {
  const result = await registerService(req.body)

  return res.status(HTTP_STATUS.CREATED).json({
    message: 'Register success',
    result
  })
}

export const loginController = async (req: Request<ParamsDictionary, any, loginReqBody>, res: Response) => {
  const result = await loginService(req.body)
  if (result) {
    return res.status(HTTP_STATUS.OK).json({
      message: 'Login success',
      result
    })
  } else {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      message: 'Login fail',
      result
    })
  }
}

export const logoutController = async (req: Request<ParamsDictionary, any, logoutReqBody>, res: Response) => {
  const result = await logoutService(req.body)

  return res.status(HTTP_STATUS.OK).json({
    message: 'Logout success',
    result
  })
}

export const refreshTokenController = async (
  req: Request<ParamsDictionary, any, refreshTokenReqBody>,
  res: Response
) => {
  const { refresh_token } = req.body
  const { user_id, verify, exp } = req.decoded_refresh_token
  const result = await refreshTokenService({ user_id, verify, exp, refresh_token })

  return res.status(HTTP_STATUS.OK).json({
    message: 'Refresh token success',
    result
  })
}
