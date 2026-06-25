import { useState } from "react";
import API from "../api/api";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function Register() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // =========================
  // HANDLE INPUT
  // =========================

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // =========================
  // REGISTER
  // =========================

  const handleRegister = async () => {
    const { username, email, password, confirmPassword } = formData;

    // EMPTY
    if (!username.trim()) {
      toast.error("Username is required");
      return;
    }

    if (!email.trim()) {
      toast.error("Email is required");
      return;
    }

    if (!password.trim()) {
      toast.error("Password is required");
      return;
    }

    if (!confirmPassword.trim()) {
      toast.error("Confirm password is required");
      return;
    }

    // EMAIL FORMAT
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      toast.error("Invalid email format");
      return;
    }

    // PASSWORD LENGTH
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    // CONFIRM PASSWORD
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      await API.post("/auth/register", {
        username,
        email,
        password,
      });

      toast.success("Register success. Please verify your email.");

      navigate("/login");
    } catch (err) {
      console.log(err);

      const message =
        err.response?.data?.message || err.response?.data || "Register failed";

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-[32px] shadow-xl p-10">
        {/* HEADER */}

        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold tracking-tight mb-3">
            Create Account
          </h1>
        </div>

        {/* USERNAME */}

        <div className="mb-5">
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Username
          </label>

          <input
            type="text"
            name="username"
            placeholder="Enter username"
            value={formData.username}
            onChange={handleChange}
            className="
              w-full
              px-4
              py-3
              rounded-2xl
              border
              border-gray-200
              focus:outline-none
              focus:ring-2
              focus:ring-black
              transition
            "
          />
        </div>

        {/* EMAIL */}

        <div className="mb-5">
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Email
          </label>

          <input
            type="email"
            name="email"
            placeholder="Enter email"
            value={formData.email}
            onChange={handleChange}
            className="
              w-full
              px-4
              py-3
              rounded-2xl
              border
              border-gray-200
              focus:outline-none
              focus:ring-2
              focus:ring-black
              transition
            "
          />
        </div>

        {/* PASSWORD */}

        <div className="mb-5">
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Password
          </label>

          <input
            type="password"
            name="password"
            placeholder="Enter password"
            value={formData.password}
            onChange={handleChange}
            className="
              w-full
              px-4
              py-3
              rounded-2xl
              border
              border-gray-200
              focus:outline-none
              focus:ring-2
              focus:ring-black
              transition
            "
          />
        </div>

        {/* CONFIRM PASSWORD */}

        <div className="mb-8">
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Confirm Password
          </label>

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm password"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="
              w-full
              px-4
              py-3
              rounded-2xl
              border
              border-gray-200
              focus:outline-none
              focus:ring-2
              focus:ring-black
              transition
            "
          />
        </div>

        {/* BUTTON */}

        <button
          onClick={handleRegister}
          disabled={loading}
          className="
            w-full
            bg-black
            hover:bg-gray-800
            text-white
            py-3.5
            rounded-2xl
            font-semibold
            transition-all
            duration-200
            disabled:bg-gray-400
          "
        >
          {loading ? "Creating account..." : "Create Account"}
        </button>

        {/* LOGIN */}

        <div className="mt-8 text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link
            to="/login"
            className="
              text-black
              font-semibold
              hover:underline
            "
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Register;
