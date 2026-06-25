// Sidebar.jsx

import { NavLink, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { logout } from "../utils/auth";

import {
  LayoutDashboard,
  ShoppingCart,
  Users,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Package,
  Ticket,
  Layers,
  Images,
  Mail,
  MessageSquare,
} from "lucide-react";

import { useState } from "react";

function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  const token = localStorage.getItem("token");

  const user = token ? jwtDecode(token) : null;

  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-3 py-2 rounded-lg relative group transition-all duration-200 ${
      isActive
        ? "bg-blue-500 text-white shadow-md"
        : "text-gray-300 hover:bg-gray-700 hover:text-white"
    }`;

  // =========================
  // MENU
  // =========================

  const adminMenu = [
    {
      name: "Dashboard",
      path: "/admin",
      icon: LayoutDashboard,
    },

    {
      name: "Orders",
      path: "/admin/orders",
      icon: ShoppingCart,
    },

    {
      name: "Products",
      path: "/admin/products",
      icon: Package,
    },

    {
      name: "Collections",
      path: "/admin/collections",
      icon: Layers,
    },

    {
      name: "Lookbooks",
      path: "/admin/lookbooks",
      icon: Images,
    },

    {
      name: "Newsletter",
      path: "/admin/newsletter",
      icon: Mail,
    },

    {
      name: "Contacts",
      path: "/admin/contacts",
      icon: MessageSquare,
    },

    {
      name: "Coupons",
      path: "/admin/coupons",
      icon: Ticket,
    },

    {
      name: "Users",
      path: "/admin/users",
      icon: Users,
    },
  ];

  const userMenu = [
    {
      name: "My Orders",
      path: "/user",
      icon: ShoppingCart,
    },
  ];

  const menu = user?.role === "ADMIN" ? adminMenu : userMenu;

  return (
    <div
      className={`${
        collapsed ? "w-20" : "w-64"
      } bg-gradient-to-b from-gray-900 to-gray-800 text-white min-h-screen p-4 flex flex-col shadow-xl transition-all duration-300`}
    >
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        {!collapsed && (
          <h2 className="text-xl font-bold">
            {user?.role === "ADMIN" ? "Admin" : "User"}
          </h2>
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 hover:bg-gray-700 rounded"
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      {/* USER INFO */}
      <div className="mb-6 flex items-center gap-3">
        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center font-bold">
          {user?.sub?.charAt(0)?.toUpperCase()}
        </div>

        {!collapsed && (
          <div>
            <p className="text-sm font-medium">{user?.sub}</p>

            <p className="text-xs text-gray-400">{user?.role}</p>
          </div>
        )}
      </div>

      {/* MENU */}
      <ul className="flex-1 space-y-2">
        {menu.map((item, i) => {
          const Icon = item.icon;

          return (
            <li key={i}>
              <NavLink
                to={item.path}
                end={item.path === "/admin"}
                className={linkClass}
              >
                <Icon size={20} />

                {!collapsed && <span>{item.name}</span>}

                {/* TOOLTIP */}
                {collapsed && (
                  <span className="absolute left-16 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
                    {item.name}
                  </span>
                )}
              </NavLink>
            </li>
          );
        })}
      </ul>

      {/* LOGOUT */}
      <button
        onClick={handleLogout}
        className="flex items-center justify-center gap-2 mt-4 bg-red-500 hover:bg-red-600 p-2 rounded-lg transition shadow"
      >
        <LogOut size={18} />

        {!collapsed && "Logout"}
      </button>
    </div>
  );
}

export default Sidebar;
