

import { ObjectId } from 'mongodb'

export interface TweetRequestBody {
  type: number
  audience: number
  content: string
  parent_id: ObjectId | null
  hashtags: string[]
  mentions: ObjectId[]
  medias: {
    url: string
    type: string
  }[]
}
