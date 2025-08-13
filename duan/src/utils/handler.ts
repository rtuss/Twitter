import { Request, Response, NextFunction } from 'express'

export const wrapReqHandler = (callback: any) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await callback(req, res, next)
    } catch (error) {
      next(error)
    }
  }
}
