import httpStatus from '~/constants/httpStatus'
import { USERS_MESSAGES } from '../constants/messages'

type ErrorsType = Record<  
  string,  
  {  
    msg: string  
    [key: string]: any  
  }  
>  

export class ErrorWithStatus {
  status: number
  message: string
  error: any
  constructor({ status, message, error }: { status: number; message: string; error?: any }) {
    this.message = message
    this.status = status
    if (error) this.error = error
  }
}
export class EntityError extends ErrorWithStatus {  
  errors: ErrorsType  
  constructor({ message= USERS_MESSAGES.VALIDATION_ERROR,errors }: { message?: string, errors: ErrorsType }) {  
    super({ message, status: httpStatus.UNPROCESSABLE_ENTITY })  
    this.errors = errors  
  }  
}  
