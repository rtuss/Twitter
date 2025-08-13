import { TweetRequestBody } from "~/models/requests/Tweet.requests";
import databaseServices from "./database.services";
import Tweet from "~/models/schemas/Tweet.schemas";
import { ObjectId } from "mongodb";
import { MediaType } from "~/constants/enums";
import Hashtag from "~/models/schemas/Hashtag.schemas";
import { WithId } from 'mongodb';

class TweetsService {

  async checkAndCreateHashtags(hashtags: string[]) {
    const hashtagDocuments = await Promise.all(
      hashtags.map((hashtag) => {
        return databaseServices.hashtags.findOneAndUpdate(
          { name: hashtag },
          {
            $setOnInsert: new Hashtag({ name: hashtag })
          },
          {
            upsert: true,
            returnDocument: 'after'
          }
        );
      })
    );
    return hashtagDocuments
      .filter((hashtag): hashtag is WithId<Hashtag> => hashtag !== null)
      .map((hashtag) => hashtag._id);
  }

  async createTweet(user_id: string, body: TweetRequestBody) {
    const hashtags = await this.checkAndCreateHashtags(body.hashtags);

    const result = await databaseServices.tweets.insertOne(
      new Tweet({
        audience: body.audience,
        content: body.content,
        hashtags: hashtags,
        mentions: body.mentions || [],
        medias: (body.medias || []).map((media) => ({
          url: media.url,
          type: media.type as MediaType
        })),
        parent_id: body.parent_id ? new ObjectId(body.parent_id) : null,
        type: body.type,
        user_id: new ObjectId(user_id)
      })
    );

    // ✅ Trả về tweet kèm thông tin hashtag (có name)
    const [tweet] = await databaseServices.tweets.aggregate([
      { $match: { _id: result.insertedId } },
      {
        $lookup: {
          from: 'hashtags',
          localField: 'hashtags',
          foreignField: '_id',
          as: 'hashtags'
        }
      }
    ]).toArray();

    return tweet;
  }
}

const tweetsService = new TweetsService();
export default tweetsService;
