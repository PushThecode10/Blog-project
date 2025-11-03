import { Link, useNavigate } from "react-router-dom";
import { User, Mail, Lock, Eye, EyeOff, UserCheck } from "lucide-react";
import { useState } from "react";
import API from "../../axios.js";

const Signup = () => {
  const navigate = useNavigate();

  // form states
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "user",
  });

  // UI states
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState(""); // <-- add this
  const [loading, setLoading] = useState(false);

  // handle input
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setMessage("Passwords do not match!");
      return;
    }

    try {
      setLoading(true);
      const res = await API.post("/auth/register", formData);

      if (res.data.success) {
        setMessage("✅ Signup successful! Redirecting to login...");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setMessage(res.data.message || "Signup failed");
      }
    } catch (error) {
      console.error(error);
      setMessage(
        error.response?.data?.message ||
          "Signup failed. Please check your details and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#40a7cf] via-[#5bb5d8] to-[#da4453] px-2 py-2 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden ">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-white/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-white/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-white/10 rounded-full blur-2xl"></div>
      </div>

      <div className="w-full max-w-md bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl p-8 md:p-10 relative z-10 transform transition-all duration-500 hover:shadow-3xl">
        <div className="text-center mb-3">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#40a7cf] to-[#da4453] rounded-full mb-4 shadow-lg">
            <UserCheck className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-[#40a7cf] to-[#da4453] bg-clip-text text-transparent">
            Create Account
          </h2>
          <p className="text-gray-500 mt-1">Join us today and start your journey</p>
        </div>

        {/* show message */}
        {message && (
          <div
            className={`text-center mb-2 font-medium ${
              message.includes("success") ? "text-green-600" : "text-red-600"
            }`}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-2">
          {/* Name */}
          <div className="relative group">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Full Name"
              className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#40a7cf] focus:ring-4 focus:ring-[#40a7cf]/10 bg-gray-50 focus:bg-white transition-all"
            />
          </div>

          {/* Email */}
          <div className="relative group">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Email Address"
              className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#40a7cf] focus:ring-4 focus:ring-[#40a7cf]/10 bg-gray-50 focus:bg-white transition-all"
            />
          </div>

          {/* Password */}
          <div className="relative group">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Password (min 6 characters)"
              className="w-full pl-11 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:border-[#40a7cf] focus:ring-4 focus:ring-[#40a7cf]/10 bg-gray-50 focus:bg-white transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
            >
              {showPassword ? <EyeOff /> : <Eye />}
            </button>
          </div>

          {/* Confirm Password */}
          <div className="relative group">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              placeholder="Confirm Password"
              className="w-full pl-11 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:border-[#40a7cf] focus:ring-4 focus:ring-[#40a7cf]/10 bg-gray-50 focus:bg-white transition-all"
            />
            <button
              type="button"
              onClick={() =>
                setShowConfirmPassword(!showConfirmPassword)
              }
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
            >
              {showConfirmPassword ? <EyeOff /> : <Eye />}
            </button>
          </div>

          {/* Role Selection */}
      

          {/* Terms */}
          <label className="flex items-start space-x-3 cursor-pointer group">
            <input
              type="checkbox"
              required
              className="w-5 h-5 mt-0.5 border-2 border-gray-300 rounded text-[#40a7cf]"
            />
            <span className="text-sm text-gray-600">
              I agree to the{" "}
              <Link to="/terms" className="text-[#40a7cf] hover:text-[#da4453] font-medium">
                Terms & Conditions
              </Link>{" "}
              and{" "}
              <Link to="/privacy" className="text-[#40a7cf] hover:text-[#da4453] font-medium">
                Privacy Policy
              </Link>
            </span>
          </label>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-[#da4453] to-[#40a7cf] text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 relative overflow-hidden group"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>

          {/* Login link */}
          <div className="text-center pt-4">
            <p className="text-gray-600">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-[#40a7cf] hover:text-[#da4453] font-semibold transition-colors hover:underline"
              >
                Sign in
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
