import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Widgets from "../components/Widgets";

export default function MainLayout() {
  return (
    <div className="flex bg-black text-white min-h-screen">
      <Sidebar />
      <Outlet />
      <Widgets />
    </div>
  );
}
