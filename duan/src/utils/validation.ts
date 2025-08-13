import { NextFunction, Request, Response } from 'express'
import { validationResult, ValidationChain } from 'express-validator'
import { RunnableValidationChains } from 'express-validator/lib/middlewares/schema'
import HTTP_STATUS from '~/constants/httpStatus'
import { EntityError, ErrorWithStatus } from '~/models/Errors'


const validate = (validations: RunnableValidationChains<ValidationChain>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    await validations.run(req)
    const errors = validationResult(req)
    if (errors.isEmpty()) {
      return next()
    }
const errorsObject = errors.mapped()  
const entityError = new EntityError({ errors: {} })  
for (const key in errorsObject) {  
  const { msg } = errorsObject[key]  
  if (msg instanceof ErrorWithStatus && msg.status === HTTP_STATUS.UNPROCESSABLE_ENTITY) {  
    return next(msg)  
  }  
  entityError.errors[key] = msg  
}  

    return next(
      new ErrorWithStatus({
        status: HTTP_STATUS.UNPROCESSABLE_ENTITY,
        message: 'Validation error',
        error: errors.mapped()
      })
    )
  }
}

export default validate
