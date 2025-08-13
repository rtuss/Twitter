import React from "react";

const Widgets = () => {
  return (
    <div className="w-[350px] p-4 hidden lg:block">
      <input
        type="text"
        placeholder="Search Twitter"
        className="w-full p-2 rounded-full bg-gray-800 placeholder-gray-400 text-white"
      />

      <div className="mt-6 bg-gray-800 rounded-xl p-4 space-y-3">
        <h2 className="text-xl font-bold">What’s happening</h2>
        <div className="text-sm text-gray-400">
          Trending in Vietnam <br />
          <span className="text-white font-semibold">clemente dvorsky</span>
        </div>
        <div className="text-sm text-gray-400">
          Trending in Vietnam <br />
          <span className="text-white font-semibold">sharyl earleywine</span>
        </div>
      </div>
    </div>
  );
};

export default Widgets;
