import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import "./App.css";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/profile/Profile";
import Chat from './pages/chat' // 👈 import file chat

export default function App() {
  return (
     <BrowserRouter>
      <Routes>
        {/* Main layout */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/Profile" element={<Profile />} />
        {/* 👇 THÊM DÒNG NÀY */}
        <Route path="/chat" element={<Chat />} />
    
      </Routes>
      
    </BrowserRouter>
  );
}
