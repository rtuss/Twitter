import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { IoMdClose } from "react-icons/io";
import { FiEye, FiEyeOff } from "react-icons/fi";
import api from "../../utils/api";

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
    date_of_birth: "",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Tên không được để trống";
    if (!form.username.trim()) newErrors.username = "Username không được để trống";
    if (!form.email.trim()) {
      newErrors.email = "Email không được để trống";
    } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(form.email)) {
      newErrors.email = "Email không hợp lệ";
    }
    if (!form.password.trim() || form.password.length < 6) {
      newErrors.password = "Mật khẩu phải ít nhất 6 ký tự";
    }
    if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu xác nhận không khớp";
    }
    if (!form.date_of_birth) {
      newErrors.date_of_birth = "Ngày sinh không được để trống";
    }
    return newErrors;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const payload = {
        ...form,
        date_of_birth: new Date(form.date_of_birth).toISOString(),
      };

      const res = await api.post("/register", payload);
      if (res.data?.result?.acknowledged) {
        navigate("/login");
      } else {
        alert("Đăng ký thất bại!");
      }
    } catch (err) {
      const msg = err?.response?.data?.message || "Có lỗi xảy ra!";
      alert(msg);
      console.error("Error status", err?.response?.status);
    }
  };

  return (
    <div className="min-h-screen bg-[#202327] flex items-center justify-center">
      <div className="bg-black text-white w-full max-w-md rounded-2xl p-6 relative">
        <button
          onClick={() => navigate("/")}
          className="absolute top-4 left-4 text-xl text-white hover:text-red-500 transition"
          aria-label="Close"
        >
          <IoMdClose />
        </button>

        <div className="text-4xl font-bold text-center mt-2">X</div>

        <h2 className="text-center text-2xl font-bold mt-6 mb-4">
          Create your account
        </h2>

        <form onSubmit={onSubmit}>
          {[
            { name: "name", placeholder: "Name" },
            { name: "username", placeholder: "Username" },
            { name: "email", placeholder: "Email", type: "email" },
          ].map(({ name, placeholder, type = "text" }) => (
            <div key={name} className="mb-4">
              <input
                type={type}
                name={name}
                value={form[name]}
                onChange={onChange}
                placeholder={placeholder}
                className={`w-full bg-transparent border ${
                  errors[name] ? "border-red-500" : "border-gray-700"
                } rounded-md px-4 py-2 text-sm placeholder-gray-500 focus:outline-none focus:border-blue-500`}
              />
              {errors[name] && (
                <p className="text-red-500 text-sm mt-1">{errors[name]}</p>
              )}
            </div>
          ))}

          {/* Password */}
          <div className="mb-4 relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={form.password}
              onChange={onChange}
              placeholder="Password"
              className={`w-full bg-transparent border ${
                errors.password ? "border-red-500" : "border-gray-700"
              } rounded-md px-4 py-2 text-sm placeholder-gray-500 focus:outline-none focus:border-blue-500 pr-10`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              aria-label="Toggle password visibility"
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </button>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="mb-4">
            <input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={onChange}
              placeholder="Confirm Password"
              className={`w-full bg-transparent border ${
                errors.confirmPassword ? "border-red-500" : "border-gray-700"
              } rounded-md px-4 py-2 text-sm placeholder-gray-500 focus:outline-none focus:border-blue-500`}
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          {/* Date of Birth */}
          <div className="mb-4">
            <input
              type="date"
              name="date_of_birth"
              value={form.date_of_birth}
              onChange={onChange}
              className={`w-full bg-transparent border ${
                errors.date_of_birth ? "border-red-500" : "border-gray-700"
              } rounded-md px-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500`}
            />
            {errors.date_of_birth && (
              <p className="text-red-500 text-sm mt-1">
                {errors.date_of_birth}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-white text-black rounded-full font-semibold text-sm hover:bg-gray-200 transition mb-4"
          >
            Sign up
          </button>
        </form>

        <p className="text-sm text-gray-500 text-center mt-4">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-blue-500 hover:underline cursor-pointer"
          >
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
