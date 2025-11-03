import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import API from "../../axios.js";

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // ✅ Call user login API
      const res = await API.post("/auth/login", { email, password });

      if (res.data.success) {
        // ✅ Save tokens
        localStorage.setItem("accessToken", res.data.accessToken);
        localStorage.setItem("refreshToken", res.data.refreshToken);

        // ✅ Show success message
        setMessage("Login successful!");

        // ✅ Navigate to user home page
        navigate("/home");
      } else {
        setMessage(res.data.message || "Login failed");
      }
    } catch (error) {
      console.error(error);
      setMessage("Login failed, please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#40a7cf] via-[#5bb5d8] to-[#da4453] px-4 py-12 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-white/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-white/5 rounded-full blur-3xl animate-pulse delay-700"></div>
      </div>

      <div className="w-full max-w-md bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl p-8 md:p-10 relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#40a7cf] to-[#da4453] rounded-full mb-4 shadow-lg">
            <img
              src="https://images.unsplash.com/photo-1432888622747-4eb9a8f2c293?w=100&h=100&fit=crop"
              alt="logo"
              className="h-12 w-12 rounded-full object-cover"
            />
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-[#40a7cf] to-[#da4453] bg-clip-text text-transparent">
            Welcome Back
          </h2>
          <p className="text-gray-500 mt-2">Sign in to continue your journey</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email */}
          <div className="relative group">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#40a7cf]" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
              className="w-full pl-11 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#40a7cf] focus:ring-4 focus:ring-[#40a7cf]/10 bg-gray-50 focus:bg-white"
            />
          </div>

          {/* Password */}
          <div className="relative group">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#40a7cf]" />
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
              className="w-full pl-11 pr-12 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#40a7cf] focus:ring-4 focus:ring-[#40a7cf]/10 bg-gray-50 focus:bg-white"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#40a7cf]"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* Message */}
          {message && (
            <p
              className={`text-center text-sm ${
                message.includes("successful") ? "text-green-600" : "text-red-500"
              }`}
            >
              {message}
            </p>
          )}

          {/* Login Button */}
          <button
            type="submit"
            className="w-full py-3.5 bg-gradient-to-r from-[#da4453] to-[#40a7cf] text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 relative overflow-hidden group"
          >
            <span className="relative z-10">Sign In</span>
            <div className="absolute inset-0 bg-gradient-to-r from-[#40a7cf] to-[#da4453] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>

          {/* Sign Up Link */}
          <div className="text-center pt-4">
            <p className="text-gray-600">
              Don’t have an account?{" "}
              <Link
                to="/signup"
                className="text-[#40a7cf] hover:text-[#da4453] font-semibold transition-colors hover:underline"
              >
                Sign up now
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
