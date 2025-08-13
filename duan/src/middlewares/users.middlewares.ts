import { Request, Response, NextFunction } from 'express'
import { body, checkSchema } from 'express-validator'
import HTTP_STATUS from '~/constants/httpStatus'
import { ErrorWithStatus } from '~/models/Errors'
import database from '~/services/database.services'
import { verifyToken, verifyTokens } from '~/utils/jwt'
import validate from '~/utils/validation'
import { USERS_MESSAGES } from '~/constants/messages'
import { verify } from 'jsonwebtoken'
import { JsonWebTokenError } from 'jsonwebtoken'



// Đặt đầu file, dưới các import:
const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1)

export const registerValidator = validate(
  checkSchema(
    {
      username: {
        trim: true,
        isLength: {
          options: {
            min: 1,
            max: 100
          },
          errorMessage: 'Username must be between 1 and 100 characters'
        }
      },
      email: {
        isEmail: {
          errorMessage: 'Email must be a valid email address'
        },
        custom: {
          options: async (value, { req }) => {
            if (await database.users().findOne({ email: value })) {
              throw new Error('Email already exists')
            }
            return true
          }
        }
      },
      password: {
        isStrongPassword: {
          errorMessage:
            'Password must be at least 8 characters, contain at least 1 lowercase letter, 1 uppercase letter, 1 number, and 1 symbol'
        }
      },
      confirmPassword: {
        custom: {
          options: (value, { req }) => {
            if (value !== req.body.password) {
              throw new Error('Confirm password does not match password')
            }
            return true
          }
        }
      },
      date_of_birth: {
        isISO8601: {
          options: {
            strict: true,
            strictSeparator: true
          },
          errorMessage: 'Day of birth must be a valid ISO8601 date'
        }
      }
    },
    ['body']
  )
)

export const loginValidator = validate(
  checkSchema(
    {
      email: {
        isEmail: {
          errorMessage: 'Email must be a valid email address'
        }
      },
      password: {
        isStrongPassword: {
          errorMessage:
            'Password must be at least 8 characters, contain at least 1 lowercase letter, 1 uppercase letter, 1 number, and 1 symbol'
        }
      }
    },
    ['body']
  )
)
export const accessTokenValidator = validate(
  checkSchema({
    Authorization: {
      notEmpty: {
        errorMessage: USERS_MESSAGES.ACCESS_TOKEN_IS_REQUIRED,
      },
      custom: {
        options: async (value: string, { req }) => {
          const access_token = value.split(' ')[1];
          if (!access_token) {
            throw new ErrorWithStatus({
              message: USERS_MESSAGES.ACCESS_TOKEN_IS_REQUIRED,
              status: HTTP_STATUS.UNAUTHORIZED,
            })
          }
          try {
            const decoded_authorization = await verifyToken({ token: access_token, secretOrPublicKey: process.env.JWT_SECRET_ACCESS_TOKEN as string});
            (req as Request).decoded_authorization = decoded_authorization;
          } catch (error) {
            throw new ErrorWithStatus({
              message: capitalize((error as JsonWebTokenError).message),
              status: HTTP_STATUS.UNAUTHORIZED,
            });
          }
         
          return true; 
        }
      }
    }
  },
  ['headers']
)
);
export const refreshTokenValidator = validate(
  checkSchema(
    {
      refresh_token: {
        trim: true,
        custom: {
          options: async (value: string, { req }) => {
            try {
              if (!value) {
                throw new ErrorWithStatus({
                  message: USERS_MESSAGES.REFRESH_TOKEN_IS_REQUIRED,
                  status: HTTP_STATUS.UNAUTHORIZED
                })
              }
              const [decoded_refresh_token, refresh_token] = await Promise.all([
                verifyToken({ token: value, secretOrPublicKey: process.env.REFRESH_TOKEN_SECRET as string }),
                 database.refresh_tokens().findOne({ token: value })
              ])
              if (!refresh_token) {
                throw new ErrorWithStatus({
                  message: USERS_MESSAGES.USED_REFRESH_TOKEN_OR_NOT_EXIST,
                  status: HTTP_STATUS.UNAUTHORIZED
                })
              }
              ;(req as Request).decoded_refresh_token = decoded_refresh_token
            } catch (error) {
              if (error instanceof JsonWebTokenError) {
                throw new ErrorWithStatus({
                  message: capitalize(error.message),
                  status: HTTP_STATUS.UNAUTHORIZED
                })
              }

              throw error
            }
            return true
          }
        }
      }
    },
    ['body']
  )
)
export const emailVerifyTokenValidator = validate(
  checkSchema(
    {
     email_Verify_Token: {
        notEmpty:{
          errorMessage:USERS_MESSAGES.EMAIL_VERIFY_TOKEN_IS_REQUIED
        },
        custom: {
          options: async (value: string, { req }) => {
            try {
              if (!value) {
                throw new ErrorWithStatus({
                  message: USERS_MESSAGES.REFRESH_TOKEN_IS_REQUIRED,
                  status: HTTP_STATUS.UNAUTHORIZED
                })
              }
              const [decoded_refresh_token, refresh_token] = await Promise.all([
                verifyToken({token: value, secretOrPublicKey: process.env.JWT_SECRET_REFRESH_TOKEN as string}),                database.refresh_tokens().findOne({ token: value })
              ])
              if (!refresh_token) {
                throw new ErrorWithStatus({
                  message: USERS_MESSAGES.USED_REFRESH_TOKEN_OR_NOT_EXIST,
                  status: HTTP_STATUS.UNAUTHORIZED
                })
              }
              ;(req as Request).decoded_refresh_token = decoded_refresh_token
            } catch (error) {
              if (error instanceof JsonWebTokenError) {
                throw new ErrorWithStatus({
                  message: capitalize(error.message),
                  status: HTTP_STATUS.UNAUTHORIZED
                })
              }

              throw error
            }
            return true
          }
        }
      }
    },
    ['body']
  )
)