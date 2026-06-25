import { NavLink, Outlet, useNavigate } from "react-router-dom";

function UserLayout() {
  const navigate = useNavigate();

  // =========================
  // LOGOUT
  // =========================

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid md:grid-cols-[260px_1fr] gap-8">
          {/* SIDEBAR */}

          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 h-fit sticky top-6">
            <h2 className="text-2xl font-bold mb-6">My Account</h2>

            <div className="flex flex-col gap-3">
              {/* PROFILE */}

              <NavLink
                to="/user/profile"
                className={({ isActive }) =>
                  `px-4 py-3 rounded-2xl transition-all duration-200 font-medium
                  ${
                    isActive
                      ? "bg-black text-white shadow"
                      : "hover:bg-gray-100 text-gray-700"
                  }`
                }
              >
                Profile
              </NavLink>

              {/* ORDERS */}

              <NavLink
                to="/user/orders"
                className={({ isActive }) =>
                  `px-4 py-3 rounded-2xl transition-all duration-200 font-medium
                  ${
                    isActive
                      ? "bg-black text-white shadow"
                      : "hover:bg-gray-100 text-gray-700"
                  }`
                }
              >
                My Orders
              </NavLink>

              {/* CHANGE PASSWORD */}

              <NavLink
                to="/user/change-password"
                className={({ isActive }) =>
                  `px-4 py-3 rounded-2xl transition-all duration-200 font-medium
                  ${
                    isActive
                      ? "bg-black text-white shadow"
                      : "hover:bg-gray-100 text-gray-700"
                  }`
                }
              >
                Change Password
              </NavLink>

              {/* DIVIDER */}

              <div className="border-t my-2"></div>

              {/* LOGOUT */}

              <button
                onClick={handleLogout}
                className="px-4 py-3 rounded-2xl text-left font-medium text-red-500 hover:bg-red-50 transition-all duration-200"
              >
                Logout
              </button>
            </div>
          </div>

          {/* CONTENT */}

          <div>
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserLayout;
