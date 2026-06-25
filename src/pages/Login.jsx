import { useState, useEffect } from "react";
import API from "../api/api";
import { useNavigate, Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";

function Login() {
  const [username, setUsername] = useState("");

  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // =========================
  // AUTO LOGIN
  // =========================

  useEffect(() => {
    const token = localStorage.getItem("token");

    const reason = localStorage.getItem("reason");

    if (token) {
      try {
        const user = jwtDecode(token);

        if (user.role === "ADMIN") {
          navigate("/admin", { replace: true });
        } else {
          navigate("/user/profile", {
            replace: true,
          });
        }

        return;
      } catch (err) {
        console.log(err);

        localStorage.removeItem("token");
      }
    }

    if (reason === "banned") {
      toast.error("Your account has been banned!");
    }

    if (reason === "expired") {
      toast.warning("Session expired. Please login again.");
    }

    localStorage.removeItem("reason");
  }, []);

  // =========================
  // LOGIN
  // =========================

  const handleLogin = async () => {
    if (!username || !password) {
      toast.warning("Please fill all fields");

      return;
    }

    setLoading(true);

    try {
      const res = await API.post("/auth/login", {
        username,
        password,
      });

      // SAVE TOKEN

      localStorage.setItem("token", res.data);

      const user = jwtDecode(res.data);

      console.log(user);

      localStorage.setItem("userId", user.id);

      toast.success("Login success");

      // REDIRECT

      if (user.role === "ADMIN") {
        navigate("/admin", { replace: true });
      } else {
        navigate("/user/profile", {
          replace: true,
        });
      }
    } catch (err) {
      console.log(err);

      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.response?.data ||
        "Login failed";

      if (
        typeof message === "string" &&
        message.toLowerCase().includes("banned")
      ) {
        localStorage.setItem("reason", "banned");

        navigate("/login");
      }

      toast.error(typeof message === "string" ? message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-xl p-8">
        {/* TITLE */}

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">Welcome Back</h1>

          <p className="text-gray-500">Login to your account</p>
        </div>

        {/* USERNAME */}

        <div className="mb-4">
          <label className="block mb-2 font-medium">Username</label>

          <input
            type="text"
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="
              w-full
              border
              border-gray-300
              rounded-xl
              px-4
              py-3
              focus:outline-none
              focus:ring-2
              focus:ring-blue-500
            "
          />
        </div>

        {/* PASSWORD */}

        <div className="mb-2">
          <label className="block mb-2 font-medium">Password</label>

          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="
              w-full
              border
              border-gray-300
              rounded-xl
              px-4
              py-3
              focus:outline-none
              focus:ring-2
              focus:ring-blue-500
            "
          />
        </div>

        {/* FORGOT PASSWORD */}

        <div className="text-right mb-6">
          <Link
            to="/forgot-password"
            className="
              text-sm
              text-blue-500
              hover:text-blue-600
              hover:underline
            "
          >
            Forgot password?
          </Link>
        </div>

        {/* LOGIN BUTTON */}

        <button
          onClick={handleLogin}
          disabled={loading}
          className="
            w-full
            bg-black
            hover:bg-gray-800
            text-white
            py-3
            rounded-xl
            font-semibold
            transition
            disabled:bg-gray-400
          "
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* REGISTER */}

        <div className="text-center mt-6 text-sm text-gray-500">
          Don’t have an account?{" "}
          <Link to="/register" className="text-blue-500 hover:underline">
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
