import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div style={{ padding: "2rem", maxWidth: "400px", margin: "auto" }}>
      <h2>🔐 Authentication</h2>
      <Outlet />
    </div>
  );
}
