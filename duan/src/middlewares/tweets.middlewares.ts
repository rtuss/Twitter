import { checkSchema } from 'express-validator'
import { MediaType, TweetType, TweetAudience } from '~/constants/enums'
import validate from '~/utils/validation'
import { numberEnumToArray } from '~/utils/commons'
import { ObjectId } from 'mongodb'
import { isEmpty } from 'lodash'

const tweetTypes = numberEnumToArray(TweetType)
const tweetAudiences = numberEnumToArray(TweetAudience)
const mediaTypes = numberEnumToArray(MediaType)

export const createTweetValidator = validate(
  checkSchema({
    type: {
      isIn: {
        options: [tweetTypes],
        errorMessage: 'INVALID_TYPE'
      }
    },
    audience: {
      isIn: {
        options: [tweetAudiences],
        errorMessage: 'INVALID_AUDIENCE'
      }
    },
    parent_id: {
      custom: {
        options: (value, { req }) => {
          const type = req.body.type as TweetType

          if (
            [TweetType.Retweet, TweetType.Comment, TweetType.QuoteTweet].includes(type) &&
            !ObjectId.isValid(value)
          ) {
            throw new Error('PARENT_ID_MUST_BE_A_VALID_TWEET_ID')
          }

          if (type === TweetType.Tweet && value !== null) {
            throw new Error('PARENT_ID_MUST_BE_NULL')
          }

          return true
        }
      }
    },
    content: {
      isString: true,
      custom: {
        options: (value, { req }) => {
          const type = req.body.type as TweetType
          const hashtags = req.body.hashtags as string[]
          const mentions = req.body.mentions as string[]

          if (
            [TweetType.Comment, TweetType.QuoteTweet, TweetType.Tweet].includes(type) &&
            isEmpty(hashtags) &&
            isEmpty(mentions) &&
            value === ''
          ) {
            throw new Error('CONTENT_MUST_BE_A_NON_EMPTY_STRING')
          }

          if (type === TweetType.Retweet && value !== '') {
            throw new Error('CONTENT_MUST_BE_EMPTY_STRING')
          }

          return true
        }
      }
    },
    hashtags: {
      isArray: true,
      custom: {
        options: (value) => {
          if (value.some((item: any) => typeof item !== 'string')) {
            throw new Error('HASHTAGS_MUST_BE_ARRAY_OF_STRINGS')
          }
          return true
        }
      }
    },
    mentions: {
      isArray: true,
      custom: {
        options: (value) => {
          if (value.some((item: any) => !ObjectId.isValid(item))) {
            throw new Error('MENTIONS_MUST_BE_AN_ARRAY_OF_USER_ID')
          }
          return true
        }
      }
    },
    medias: {
      isArray: true,
      custom: {
        options: (value) => {
          if (
            value.some((item: any) => typeof item.url !== 'string' || !mediaTypes.includes(item.type))
          ) {
            throw new Error('MEDIAS_MUST_BE_AN_ARRAY_OF_MEDIA_OBJECT')
          }
          return true
        }
      }
    }
  })
)
