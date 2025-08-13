export default function TweetItem({ tweet }) {
  console.log('Tweet data:', tweet); // ➕ Thêm dòng này để debug

  return (
    <div className="p-4 border-b border-gray-700 text-white">
      <div className="text-sm text-gray-400">@user</div>
      <div className="text-xs text-gray-500">{new Date(tweet.created_at).toLocaleString()}</div>
      <div className="mt-2">{tweet.content}</div>

      {tweet.hashtags && tweet.hashtags.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {tweet.hashtags.map((tag, index) => (
            <span
              key={index}
              className="text-blue-400 hover:underline cursor-pointer"
            >
              #{typeof tag === 'string' ? tag : tag.name}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
