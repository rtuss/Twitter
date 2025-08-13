import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { IoMdClose } from "react-icons/io";
import { FiEye, FiEyeOff } from "react-icons/fi";
import api from "../../utils/api";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errorEmail, setErrorEmail] = useState("");
  const [errorPassword, setErrorPassword] = useState("");
  const navigate = useNavigate();

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (name === "email") setErrorEmail("");
    if (name === "password") setErrorPassword("");
  };

  const onClick = async () => {
    try {
      setErrorEmail("");
      setErrorPassword("");

      const res = await api.post("/login", form);
      const tokens = res.data?.result;

      if (tokens?.access_token) {
  // ✅ Lưu vào localStorage
  localStorage.setItem("token", tokens.access_token); // để đồng nhất với api.js
  localStorage.setItem("refresh_token", tokens.refresh_token);

  // Vẫn có thể set vào instance nếu bạn dùng cho axios default
  api.setToken(tokens.access_token);
  api.setRefreshToken(tokens.refresh_token);

  navigate("/");
}
    } catch (err) {
      const message = err?.data?.message?.toLowerCase?.() || "";

      if (message.includes("email")) {
        setErrorEmail("Email không đúng");
      } else if (message.includes("password")) {
        setErrorPassword("Mật khẩu không đúng");
      } else {
        setErrorEmail("Đăng nhập thất bại!");
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#202327] flex items-center justify-center">
      <div className="bg-black text-white w-full max-w-md rounded-2xl p-6 relative">
        {/* Close Button */}
        <button className="absolute top-4 left-4 text-xl text-white">
          <IoMdClose />
        </button>

        {/* X Logo */}
        <div className="text-4xl font-bold text-center mt-2">X</div>

        {/* Heading */}
        <h2 className="text-center text-2xl font-bold mt-6 mb-4">
          Sign in to X
        </h2>

        {/* Google Login */}
        <button className="flex items-center justify-center w-full py-2 bg-white text-black rounded-full font-semibold text-sm hover:bg-gray-200 transition mb-3">
          <FcGoogle className="mr-2 text-lg" />
          Sign in with Google
        </button>

        {/* Divider */}
        <div className="flex items-center my-4">
          <div className="flex-grow h-px bg-gray-700" />
          <span className="mx-2 text-gray-500 text-sm">or</span>
          <div className="flex-grow h-px bg-gray-700" />
        </div>

        {/* Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onClick();
          }}
        >
          {/* Email Input */}
          <div className="mb-4">
            <input
              type="text"
              name="email"
              value={form.email}
              onChange={onChange}
              placeholder="Phone, email, or username"
              className={`w-full bg-transparent border ${
                errorEmail ? "border-red-500" : "border-gray-700"
              } rounded-md px-4 py-2 text-sm placeholder-gray-500 focus:outline-none focus:border-blue-500`}
            />
            {errorEmail && (
              <p className="text-red-500 text-sm mt-1">{errorEmail}</p>
            )}
          </div>

          {/* Password Input */}
          <div className="mb-4 relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={form.password}
              onChange={onChange}
              placeholder="Password"
              className={`w-full bg-transparent border ${
                errorPassword ? "border-red-500" : "border-gray-700"
              } rounded-md px-4 py-2 text-sm placeholder-gray-500 focus:outline-none focus:border-blue-500 pr-10`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </button>
            {errorPassword && (
              <p className="text-red-500 text-sm mt-1">{errorPassword}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-2 bg-white text-black rounded-full font-semibold text-sm hover:bg-gray-200 transition mb-4"
          >
            Next
          </button>
        </form>

        {/* Forgot Password */}
        <button className="w-full py-2 border border-gray-600 text-white rounded-full font-semibold text-sm hover:bg-[#1a1a1a] transition">
          Forgot password?
        </button>

        {/* Sign up */}
        <p className="text-sm text-gray-500 text-center mt-6">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-blue-500 hover:underline cursor-pointer"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
