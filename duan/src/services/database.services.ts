import { Collection, Db, MongoClient } from 'mongodb'
import 'dotenv/config'
import User from '~/models/schemas/User.schemas'
import Refresh_token from '~/models/schemas/Refresh_token.schemas'
import Tweet from '~/models/schemas/Tweet.schemas'
import Hashtag from '~/models/schemas/Hashtag.schemas'
const DATABASE_URL = 'mongodb+srv://1150080138:12345@twitter.mfb42.mongodb.net/'

class Database {
  private client: MongoClient
  private db: Db
  constructor() {
    this.client = new MongoClient(process.env.DB_URI as string)
    this.db = this.client.db(process.env.DB_NAME as string)
  }

  async connect() {
    try {
      await this.db.command({ ping: 1 })
      console.log('Successfully connected to MongoDB!')
    } catch (error: any) {
      throw new Error(error)
    }
  }

  users(): Collection<User> {
    return this.db.collection('users')
  }
  refresh_tokens(): Collection<Refresh_token> {
    return this.db.collection('refresh_tokens')
  }
  get tweets(): Collection<Tweet> {
  return this.db.collection(process.env.DB_TWEETS_COLLECTION as string)
}
get hashtags(): Collection<Hashtag> {
  return this.db.collection(process.env.DB_HASHTAGS_COLLECTION as string)
}
}


export default new Database()
