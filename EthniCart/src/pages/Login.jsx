import { useState } from "react";
import { Link } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <section className="min-h-screen bg-[#F8F4EE] flex items-center justify-center p-6">
      <div className="max-w-6xl w-full bg-white rounded-3xl overflow-hidden shadow-2xl grid md:grid-cols-2">

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
              <span className="text-[#F4C95D]">EthniCart</span>
            </h1>

            <p className="mt-5 text-lg text-gray-200 max-w-sm">
              Discover premium ethnic fashion crafted for every occasion.
            </p>
          </div>
        </div>

        {/* Right Side */}
        <div className="p-10 md:p-14 flex items-center">
          <div className="w-full">

            <div className="mb-10">
              <h2 className="text-4xl font-bold text-gray-800">
                Sign In
              </h2>

              <p className="text-gray-500 mt-2">
                Login to continue shopping.
              </p>
            </div>

            <form className="space-y-6">

              {/* Email */}
              <div>
                <label className="block mb-2 font-medium text-gray-700">
                  Email Address
                </label>

                <input
                  type="email"
                  placeholder="Enter your email"
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
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    className="w-full border border-gray-300 rounded-xl px-5 py-4 pr-14 outline-none focus:ring-2 focus:ring-[#C49A6C]"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-xl text-gray-500"
                  >
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </button>

                </div>
              </div>

              {/* Remember */}
              <div className="flex justify-between items-center text-sm">

                <label className="flex items-center gap-2">
                  <input type="checkbox" />
                  Remember me
                </label>

                <Link
                  to="/forgot-password"
                  className="text-[#C49A6C] hover:underline"
                >
                  Forgot Password?
                </Link>

              </div>

              {/* Login Button */}
              <button
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
            <button className="w-full border border-gray-300 rounded-xl py-4 font-medium hover:bg-gray-100 transition">
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