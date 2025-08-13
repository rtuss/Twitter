import TweetItem from './TweetItem'

export default function TweetList({ tweets }) {
  return (
    <div>
      {tweets.map((tweet) => (
        <TweetItem key={tweet.name} tweet={tweet} />
      ))}
    </div>
  )
}
