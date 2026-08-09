import { useContext, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";

import { AuthContext } from "../context/AuthContext";

const Login = () => {
  const { login } = useContext(AuthContext);

  const navigate = useNavigate();
  const location = useLocation();

  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const result = login(
      form.email,
      form.password
    );

    if (!result.success) {
      setError(result.message);
      return;
    }

    // Where user wanted to go before login
    const from = location.state?.from || "/shop";

    navigate(from, { replace: true });
  };

  return (
    <section className="min-h-screen bg-[#FAF7F2] flex items-center justify-center px-6 py-10">

      <div className="w-full max-w-6xl bg-white rounded-3xl overflow-hidden shadow-lg grid md:grid-cols-2 min-h-[650px]">

        {/* Left Side */}
        <div className="hidden md:flex relative">

          <img
            src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=80"
            alt="Fashion"
            className="w-full h-full object-cover"
          />

          <div className="absolute inset-0 bg-black/35"></div>

          <div className="absolute bottom-10 left-10 text-white">

            <h1 className="text-5xl font-bold leading-tight">
              Welcome to <br />

              <span className="text-[#F4C95D]">
                EthniCart
              </span>
            </h1>

            <p className="mt-5 text-lg text-gray-200 max-w-sm">
              Discover premium ethnic fashion crafted
              for every occasion.
            </p>

          </div>
        </div>

        {/* Right Side */}
        <div className="p-8 md:p-14 flex items-center">

          <div className="w-full">

            {/* Heading */}
            <div className="mb-10">

              <h2 className="text-4xl font-bold text-gray-800">
                Sign In
              </h2>

              <p className="text-gray-500 mt-2">
                Login to continue shopping.
              </p>

            </div>

            {/* Error */}
            {error && (
              <div className="mb-6 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-red-600 text-sm">
                {error}
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="space-y-6"
            >

              {/* Email */}
              <div>

                <label className="block mb-2 font-medium text-gray-700">
                  Email Address
                </label>

                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-xl px-5 py-4 outline-none focus:ring-2 focus:ring-[#C49A6C]"
                />

              </div>

              {/* Password */}
              <div>

                <label className="block mb-2 font-medium text-gray-700">
                  Password
                </label>

                <div className="relative">

                  <input
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    name="password"
                    placeholder="Enter your password"
                    value={form.password}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded-xl px-5 py-4 pr-14 outline-none focus:ring-2 focus:ring-[#C49A6C]"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-xl text-gray-500"
                  >
                    {showPassword ? (
                      <FiEyeOff />
                    ) : (
                      <FiEye />
                    )}
                  </button>

                </div>

              </div>

              {/* Remember */}
              <div className="flex justify-between items-center text-sm">

                <label className="flex items-center gap-2">

                  <input
                    type="checkbox"
                  />

                  Remember me

                </label>

                <Link
                  to="/forgot-password"
                  className="text-[#C49A6C] hover:underline"
                >
                  Forgot Password?
                </Link>

              </div>

              {/* Login */}
              <button
                type="submit"
                className="w-full bg-[#C49A6C] hover:bg-[#b78958] text-white py-4 rounded-xl font-semibold transition"
              >
                Login
              </button>

            </form>

            {/* Divider */}
            <div className="flex items-center my-8">

              <div className="flex-1 h-px bg-gray-200"></div>

              <span className="px-4 text-gray-500">
                OR
              </span>

              <div className="flex-1 h-px bg-gray-200"></div>

            </div>

            {/* Google */}
            <button
              type="button"
              className="w-full border border-gray-300 rounded-xl py-4 font-medium hover:bg-gray-100 transition"
            >
              Continue with Google
            </button>

            {/* Register */}
            <p className="text-center mt-8 text-gray-600">

              Don't have an account?{" "}

              <Link
                to="/register"
                className="font-semibold text-[#C49A6C]"
              >
                Create Account
              </Link>

            </p>

          </div>

        </div>

      </div>

    </section>
  );
};

export default Login;