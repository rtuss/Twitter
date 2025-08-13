import { useState, useEffect } from "react";
import TweetForm from "../../components/TweetForm";
import Feed from "../../components/Feed";
import axios from "../../utils/api";

export default function Home() {
  const [tweets, setTweets] = useState([]);

  useEffect(() => {
    const fetchTweets = async () => {
      try {
        const res = await axios.get("/tweets");
        setTweets(res.data.result || []);
      } catch (err) {
        console.error("Error fetching tweets:", err);
      }
    };
    fetchTweets();
  }, []);

  const handleTweetCreated = (newTweet) => {
    setTweets((prev) => [newTweet, ...prev]);
  };

  return (
    <div className="flex max-w-7xl mx-auto w-full">
      {/* Sidebar (nếu có) nằm trong layout App.js */}
      {/* Home feed */}
      <div className="flex-1 border-r border-gray-700 h-screen overflow-y-auto">
        <div className="p-4 border-b border-gray-700 text-white text-xl font-bold">
          Home
        </div>
        <TweetForm onPostSuccess={handleTweetCreated} />
        <Feed tweets={tweets} />
        
      </div>
    </div>
  );
}
