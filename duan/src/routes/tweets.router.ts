import express from 'express'
import { accessTokenValidator } from '~/middlewares/users.middlewares'
import { createTweetValidator } from '~/middlewares/tweets.middlewares'
import { wrapReqHandler } from '~/utils/handler'
import { createTweetController } from '~/controllers/tweets.controllers'

const tweetsRouter = express.Router()

tweetsRouter.post(
  '/',
  accessTokenValidator,
  createTweetValidator,
  wrapReqHandler(createTweetController)
)

export default tweetsRouter
