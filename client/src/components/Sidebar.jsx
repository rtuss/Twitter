import React, { useState, useRef, useEffect } from "react";

import {
  HomeIcon,
  BellIcon,
  MailIcon,
  UserIcon,
  BookmarkIcon,
  HashtagIcon,
  DotsCircleHorizontalIcon,
} from "@heroicons/react/outline";
import { FiLogOut, FiMoreHorizontal } from "react-icons/fi";
import { Link } from "react-router-dom"; // 🧭 Dùng để tạo link chuyển trang
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef();

  // 🛠️ Thêm thuộc tính `path` cho từng mục cần chuyển trang
  const menu = [
    { icon: <HomeIcon className="h-6" />, label: "Home", path: "/" },
    { icon: <HashtagIcon className="h-6" />, label: "Explore" },
    { icon: <BellIcon className="h-6" />, label: "Notifications" },
    { icon: <MailIcon className="h-6" />, label: "Messages", path: "/chat" }, // 🛠️ Chuyển đến trang chat
    { icon: <BookmarkIcon className="h-6" />, label: "Bookmarks" },
    { icon: <UserIcon className="h-6" />, label: "Profile" },
    { icon: <DotsCircleHorizontalIcon className="h-6" />, label: "More" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    navigate("/login");
  };

  // Auto hide dropdown khi click ngoài
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="w-[250px] p-4 space-y-6 border-r border-gray-700 flex flex-col justify-between h-screen">
      <div>
        {menu.map((item, index) =>
          item.path ? (
            // 🛠️ Nếu mục đó có path thì bọc bằng <Link> để chuyển trang
            <Link
              to={item.path}
              key={index}
              className="flex items-center space-x-4 hover:bg-gray-800 p-3 rounded-full cursor-pointer transition-all"
            >
              {item.icon}
              <span className="text-lg font-semibold">{item.label}</span>
            </Link>
          ) : (
            // 🛠️ Nếu không có path thì giữ là div không chuyển trang
            <div
              key={index}
              className="flex items-center space-x-4 hover:bg-gray-800 p-3 rounded-full cursor-pointer transition-all"
            >
              {item.icon}
              <span className="text-lg font-semibold">{item.label}</span>
            </div>
          )
        )}
        <button className="bg-blue-500 text-white px-6 py-2 rounded-full font-bold hover:bg-blue-600 transition mt-6">
          Post
        </button>
      </div>

      {/* Avatar + Menu */}
      <div className="relative" ref={menuRef}>
        <div
          className="flex items-center justify-between p-3 hover:bg-gray-800 rounded-full cursor-pointer transition-all"
          onClick={() => setShowMenu(!showMenu)}
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gray-500 text-white flex items-center justify-center font-bold">
              H
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold leading-4"></p>
              <p className="text-sm text-gray-400"></p>
            </div>
          </div>
          <FiMoreHorizontal className="h-5 w-5 text-gray-400" />
        </div>

        {/* Dropdown */}
        {showMenu && (
          <div className="absolute bottom-16 left-0 w-full bg-black border border-gray-700 rounded-xl shadow-lg z-50">
            <div
              onClick={handleLogout}
              className="flex items-center space-x-3 px-4 py-3 hover:bg-red-600 text-red-400 rounded-b-xl cursor-pointer transition-all"
            >
              <FiLogOut className="h-5 w-5" />
              <span className="text-sm font-semibold">Log out</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
