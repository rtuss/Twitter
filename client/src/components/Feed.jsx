import TweetItem from './TweetItem'

export default function Feed({ tweets }) {
  return (
    <div className="flex flex-col">
      {tweets.map(tweet => (
        <TweetItem key={tweet._id} tweet={tweet} />
      ))}
    </div>
  )
}
