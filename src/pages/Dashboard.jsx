import { useEffect, useState } from "react";
import API from "../api/api";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  BarChart,
  Bar,
} from "recharts";
import AccessDenied from "../components/AccessDenied";
import {
  Users,
  ShoppingCart,
  Box,
  DollarSign,
  Wallet,
  CalendarDays,
  Bell,
} from "lucide-react";
import { toast } from "react-toastify";
import { Download, Clock } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useNavigate } from "react-router-dom";
import Skeleton from "../components/Skeleton";
import CountUp from "../components/CountUp";
import { AreaChart, Area } from "recharts";
import { TrendingUp, Activity } from "lucide-react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { FileSpreadsheet } from "lucide-react";
import { Maximize2, Minimize2 } from "lucide-react";
function Dashboard() {
  const [dashboard, setDashboard] = useState({});
  const [chartData, setChartData] = useState([]);
  const [orderStats, setOrderStats] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [topCustomers, setTopCustomers] = useState([]);
  const [latestOrders, setLatestOrders] = useState([]);
  const [range, setRange] = useState("7days");
  const [loading, setLoading] = useState(true);
  const [forbidden, setForbidden] = useState(false);
  const navigate = useNavigate();
  const [couponStats, setCouponStats] = useState({});
  const [contactStats, setContactStats] = useState({});
  const [newsletterStats, setNewsletterStats] = useState({});
  const [lookbookStats, setLookbookStats] = useState({});
  const [notifications, setNotifications] = useState([]);
  const [isDark, setIsDark] = useState(
    document.documentElement.classList.contains("dark"),
  );
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isFullscreen, setIsFullscreen] = useState(false);
  const chartTheme = {
    grid: isDark ? "#374151" : "#e5e7eb",
    text: isDark ? "#9ca3af" : "#374151",
    tooltipBg: isDark ? "#1f2937" : "#fff",
    line: "#6366f1",
    gradientFrom: "#6366f1",
    gradientTo: "#6366f1",
  };
  const smoothData = chartData.map((item) => ({
    ...item,
    revenue: item.revenue === 0 ? null : item.revenue,
  }));
  const totalRevenue = chartData.reduce(
    (sum, item) => sum + (item.revenue || 0),
    0,
  );

  const [collectionStats, setCollectionStats] = useState({
    totalCollections: 0,
    featuredCollections: 0,
    totalProducts: 0,
    largestCollection: "N/A",
    bestSellingCollection: "N/A",
    highestRevenueCollection: "N/A",
  });
  const [topCollections, setTopCollections] = useState([]);

  const [wishlistStats, setWishlistStats] = useState({
    totalWishlists: 0,
    totalItems: 0,
    uniqueUsers: 0,
    mostWishedProduct: "N/A",
    averageItemsPerUser: 0,
  });

  const [topWishlistProducts, setTopWishlistProducts] = useState([]);
  //chia đôi data để so sánh
  const half = Math.floor(chartData.length / 2);

  const currentRevenue = chartData
    .slice(half)
    .reduce((sum, i) => sum + (i.revenue || 0), 0);

  const lastRevenue = chartData
    .slice(0, half)
    .reduce((sum, i) => sum + (i.revenue || 0), 0);

  // % tăng trưởng
  const percent =
    lastRevenue > 0 ? ((currentRevenue - lastRevenue) / lastRevenue) * 100 : 0;
  const fetchAllData = async () => {
    try {
      const [
        dash,
        stats,
        products,
        customers,
        latest,
        coupons,
        contacts,
        newsletter,
        lookbook,
        collectionStatsRes,
        topCollectionsRes,
        wishlistStatsRes,
        topWishlistProductsRes,
      ] = await Promise.all([
        API.get("/orders/admin/dashboard"),
        API.get("/orders/admin/orders/statistics"),
        API.get("/orders/admin/top-products"),
        API.get("/orders/admin/customers/top"),
        API.get("/orders/admin/orders/latest"),
        API.get("/coupons/stats"),
        API.get("/contact/stats"),
        API.get("/newsletter/stats"),
        API.get("/lookbooks/stats"),
        API.get("/collections/stats"),
        API.get("/collections/top-performance"),
        API.get("/wishlist/stats"),
        API.get("/wishlist/top-products"),
      ]);

      setDashboard(dash.data || {});
      setOrderStats(stats.data || []);
      setTopProducts(products.data || []);
      setTopCustomers(customers.data || []);
      setLatestOrders(latest.data || []);
      setCouponStats(coupons.data || {});
      setContactStats(contacts.data || {});
      setNewsletterStats(newsletter.data || {});
      setLookbookStats(lookbook.data || {});
      setCollectionStats(
        collectionStatsRes.data || {
          totalCollections: 0,
          featuredCollections: 0,
          totalProducts: 0,
          largestCollection: "N/A",
          bestSellingCollection: "N/A",
          highestRevenueCollection: "N/A",
        },
      );
      setTopCollections(topCollectionsRes.data || []);
      setWishlistStats(wishlistStatsRes.data || {});
      setTopWishlistProducts(topWishlistProductsRes.data || []);
    } catch (err) {
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };
  const exportPDF = () => {
    const doc = new jsPDF();

    // Title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.text("Ecommerce Analytics Report", 14, 20);

    // Date
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.text(`Generated: ${new Date().toLocaleString("vi-VN")}`, 14, 30);

    // Summary Box
    doc.setDrawColor(99, 102, 241);
    doc.roundedRect(14, 40, 180, 40, 4, 4);

    doc.setFontSize(12);
    doc.text(`Users: ${dashboard.totalUsers}`, 20, 52);
    doc.text(`Orders: ${dashboard.totalOrders}`, 20, 62);
    doc.text(
      `Revenue: ${dashboard.totalRevenue.toLocaleString("vi-VN")} VND`,
      20,
      72,
    );

    // Table
    autoTable(doc, {
      startY: 90,
      head: [["Top Products", "Sold"]],
      body: topProducts.map((p) => [p.productName, p.totalSold.toString()]),
      theme: "grid",
      headStyles: {
        fillColor: [99, 102, 241],
      },
    });

    doc.save("analytics-report.pdf");
  };
  const exportExcel = () => {
    const analyticsData = [
      ["Metric", "Value"],
      ["Users", dashboard.totalUsers],
      ["Orders", dashboard.totalOrders],
      ["Products", dashboard.totalProducts],
      ["Revenue", dashboard.totalRevenue],
      [],
      ["Top Product", "Sold"],
      ...topProducts.map((p) => [p.productName, p.totalSold]),
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(analyticsData);

    worksheet["!cols"] = [{ wch: 25 }, { wch: 18 }];

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Analytics Report");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const fileData = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });

    saveAs(fileData, "analytics-report.xlsx");
  };
  const generateNotification = () => {
    const alerts = [
      `🔔 New Order #${Math.floor(Math.random() * 100 + 50)}`,
      `📈 Revenue increased +${(Math.random() * 10).toFixed(1)}%`,
      `👤 New customer registered`,
      `🛒 Product sold successfully`,
      `💰 Payment received`,
    ];

    const randomAlert = alerts[Math.floor(Math.random() * alerts.length)];

    const newNotification = {
      id: Date.now(),
      message: randomAlert,
    };

    setNotifications((prev) => [newNotification, ...prev.slice(0, 3)]);

    setTimeout(() => {
      setNotifications((prev) =>
        prev.filter((n) => n.id !== newNotification.id),
      );
    }, 5000);
  };
  useEffect(() => {
    const interval = setInterval(() => {
      generateNotification();
    }, 20000);

    return () => clearInterval(interval);
  }, []);
  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch (err) {
      toast.error("Fullscreen not supported");
    }
  };
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);
  const hour = currentTime.getHours();

  const greeting =
    hour < 12
      ? "Good Morning ☀️"
      : hour < 18
        ? "Good Afternoon 🌤️"
        : "Good Evening 🌙";
  useEffect(() => {
    const loadDashboard = async () => {
      setLoading(true);
      await Promise.all([fetchAllData(), fetchRevenue(range)]);
      setLoading(false);
    };

    loadDashboard();
  }, []);
  useEffect(() => {
    const interval = setInterval(() => {
      fetchAllData();
      fetchRevenue(range);
      toast.success("Dashboard updated");
    }, 30000);

    return () => clearInterval(interval);
  }, [range]);
  const isEmptyDashboard =
    !dashboard.totalUsers &&
    !dashboard.totalOrders &&
    !dashboard.totalProducts &&
    !dashboard.totalRevenue;
  //STATS
  const stats = [
    {
      label: "Users",
      value: dashboard.totalUsers ?? 0,
      icon: <Users size={22} />,
      color: "text-indigo-600",
      bg: "bg-indigo-100 dark:bg-indigo-500/20",
      path: "/admin/users",
    },
    {
      label: "Orders",
      value: dashboard.totalOrders ?? 0,
      icon: <ShoppingCart size={22} />,
      color: "text-blue-600",
      bg: "bg-blue-100 dark:bg-blue-500/20",
      path: "/admin/orders",
    },
    {
      label: "Products",
      value: dashboard.totalProducts ?? 0,
      icon: <Box size={22} />,
      color: "text-green-600",
      bg: "bg-green-100 dark:bg-green-500/20",
      path: "/admin/products",
    },
    {
      label: "Revenue",
      value: dashboard.totalRevenue ?? 0,
      icon: <DollarSign size={22} />,
      color: "text-red-500",
      bg: "bg-red-100 dark:bg-red-500/20",
    },
  ];
  const fetchRevenue = async (type) => {
    try {
      let url = "/orders/admin/revenue-7-days";

      if (type === "30days") url = "/orders/admin/revenue-30-days";
      if (type === "month") url = "/orders/admin/revenue-by-month";

      const res = await API.get(url);
      setChartData(res.data || []);
    } catch (err) {
      toast.error("Failed to load revenue data");
    }
  };
  useEffect(() => {
    fetchRevenue(range);
  }, [range]);

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains("dark"));
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);
  if (forbidden) return <AccessDenied />;
  //loading dark mode
  if (loading) {
    return (
      <div className="p-6 space-y-6">
        {/* TITLE */}
        <Skeleton className="h-8 w-48" />

        {/* STATS CARDS */}
        <p className="text-xs text-gray-400 mt-1">Live analytics</p>
        <div className="grid grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 rounded-2xl shadow-lg hover:shadow-indigo-500/20 hover:-translate-y-1 transition-all duration-300 border border-gray-200/40 dark:border-gray-700/40 p-6 rounded-2xl shadow-lg hover:shadow-indigo-500/20 hover:scale-[1.03] hover:-translate-y-2 transition-all duration-500 cursor-pointer "
            >
              <Skeleton className="h-4 w-20 mb-3" />
              <Skeleton className="h-6 w-28" />
            </div>
          ))}
        </div>

        {/* FILTER */}
        <div className="flex gap-2">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-8 w-20 rounded-lg" />
          ))}
        </div>

        {/* CHART */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 rounded-2xl shadow-lg hover:shadow-indigo-500/20 hover:-translate-y-1 transition-all duration-300 border border-gray-200/50 dark:border-gray-700/50 p-6 rounded-xl shadow">
          <Skeleton className="h-5 w-40 mb-4" />
          <Skeleton className="h-64 w-full" />
        </div>
        {/* QUICK INSIGHTS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 rounded-2xl shadow-lg hover:shadow-indigo-500/20 hover:-translate-y-1 transition-all duration-300 border border-gray-200/50 dark:border-gray-700/50 p-5 rounded-xl shadow hover:shadow-lg transition">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-500/20">
                <TrendingUp className="text-indigo-600" size={20} />
              </div>
              <p className="text-gray-500">Revenue Trend</p>
            </div>

            <h3 className="text-2xl font-bold text-indigo-600">
              {percent > 0 ? "Growing 📈" : "Dropping 📉"}
            </h3>
          </div>

          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 rounded-2xl shadow-lg hover:shadow-indigo-500/20 hover:-translate-y-1 transition-all duration-300 border border-gray-200/50 dark:border-gray-700/50 p-5 rounded-xl shadow hover:shadow-lg transition">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-green-100 dark:bg-green-500/20">
                <Wallet className="text-green-600" size={20} />
              </div>
              <p className="text-gray-500">Total Revenue</p>
            </div>

            <h3 className="text-2xl font-bold text-green-600">
              {totalRevenue.toLocaleString("vi-VN")} đ
            </h3>
          </div>

          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 rounded-2xl shadow-lg hover:shadow-indigo-500/20 hover:-translate-y-1 transition-all duration-300 border border-gray-200/50 dark:border-gray-700/50 p-5 rounded-xl shadow hover:shadow-lg transition">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-500/20">
                <CalendarDays className="text-blue-600" size={20} />
              </div>
              <p className="text-gray-500">Current Range</p>
            </div>

            <h3 className="text-2xl font-bold text-blue-600">{range}</h3>
          </div>
        </div>
        {/* 2 BLOCK */}
        <div className="grid grid-cols-2 gap-6">
          {[...Array(2)].map((_, i) => (
            <div
              key={i}
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 rounded-2xl shadow-lg hover:shadow-indigo-500/20 hover:-translate-y-1 transition-all duration-300 border border-gray-200/50 dark:border-gray-700/50 p-6 rounded-xl shadow"
            >
              <Skeleton className="h-5 w-32 mb-4" />
              {[...Array(4)].map((_, j) => (
                <Skeleton key={j} className="h-4 w-full mb-2" />
              ))}
            </div>
          ))}
        </div>

        {/* TABLE */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 rounded-2xl shadow-lg hover:shadow-indigo-500/20 hover:-translate-y-1 transition-all duration-300 border border-gray-200/50 dark:border-gray-700/50 p-6 rounded-xl shadow">
          <Skeleton className="h-5 w-40 mb-4" />
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-10 w-full mb-2" />
          ))}
        </div>
      </div>
    );
  }
  const MiniChart = ({ data }) => {
    const id = "miniGradient-" + Math.random();

    return (
      <ResponsiveContainer width="100%" height={70}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.5} />
              <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
            </linearGradient>
          </defs>

          <Area
            type="monotone"
            dataKey="revenue"
            stroke="#6366f1"
            fill={`url(#${id})`}
            strokeWidth={5}
            dot={false}
            isAnimationActive
            animationDuration={1800}
          />
        </AreaChart>
      </ResponsiveContainer>
    );
  };
  const getStatusIcon = (status) => {
    switch (status) {
      case "COMPLETED":
        return "✅";
      case "PENDING":
        return "⏳";
      case "CONFIRMED":
        return "🟣";
      case "SHIPPING":
        return "🚚";
      default:
        return "❌";
    }
  };
  return (
    <div
      className="flex-1 min-h-screen p-4 sm:p-6 lg:p-8 max-w-full overflow-x-hidden transition-all duration-500
        bg-gradient-to-br
        from-slate-100
        via-indigo-50
        to-purple-100
        dark:from-gray-950
        dark:via-gray-900
        dark:to-indigo-950"
    >
      <div className="mb-8">
        <div className="flex justify-between items-start flex-wrap gap-4">
          <div>
            <p className="text-sm text-indigo-500 font-medium">
              {greeting}, Admin
            </p>

            <h1 className="text-3xl font-bold text-black dark:text-white">
              Dashboard
            </h1>

            <p className="text-gray-500 mt-1">
              Real-time business insights & revenue tracking
            </p>

            <div className="flex items-center gap-2 mt-3">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Live Analytics
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={exportPDF}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition shadow-lg"
            >
              <Download size={18} />
              PDF
            </button>

            <button
              onClick={exportExcel}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition shadow-lg"
            >
              <FileSpreadsheet size={18} />
              Excel
            </button>

            <div className="relative bg-white dark:bg-gray-800 p-3 rounded-xl shadow-lg">
              <Bell className="text-indigo-600 animate-bounce" size={22} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-ping"></span>
            </div>

            <button
              onClick={toggleFullscreen}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition shadow-lg"
            >
              {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
              {isFullscreen ? "Exit" : "Present"}
            </button>
          </div>
        </div>
      </div>
      {/* EMPTY DASHBOARD */}
      {isEmptyDashboard && (
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 rounded-2xl shadow-lg hover:shadow-indigo-500/20 hover:-translate-y-1 transition-all duration-300 border border-gray-200/50 dark:border-gray-700/50 p-12 rounded-xl shadow text-center mb-6">
          <div className="text-6xl mb-4 animate-bounce">🚀</div>

          <p className="text-2xl font-semibold mb-2">
            Welcome to your dashboard
          </p>

          <p className="text-gray-500 dark:text-gray-400 mb-5">
            You don’t have any data yet
          </p>

          <button
            onClick={() => navigate("/admin/orders/create")}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition shadow"
          >
            Create your first order
          </button>
        </div>
      )}

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((s, i) => {
          const isRevenue = s.label === "Revenue";

          return (
            <div
              key={i}
              onClick={() => s.path && navigate(s.path)}
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 rounded-2xl shadow-lg hover:shadow-indigo-500/20 hover:-translate-y-1 transition-all duration-300 border border-gray-200/50 dark:border-gray-700/50 p-5 rounded-xl shadow 
             hover:shadow-2xl hover:scale-[1.05] hover:-translate-y-1
             transition-all duration-500 cursor-pointer
             opacity-0 translate-y-6 animate-fadeIn"
              style={{
                animationDelay: `${i * 120}ms`,
                animationFillMode: "forwards",
              }}
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-gray-500">{s.label}</p>
                  <h2 className={`text-2xl font-bold ${s.color}`}>
                    {s.label === "Revenue" ? (
                      <>
                        <CountUp
                          key={dashboard.totalRevenue}
                          value={dashboard.totalRevenue ?? 0}
                        />
                        {" đ"}
                      </>
                    ) : (
                      <CountUp key={s.value} value={s.value ?? 0} />
                    )}
                  </h2>
                </div>

                <div className={`p-3 rounded-full ${s.bg}`}>{s.icon}</div>
              </div>

              {/* 👉 MINI CHART */}
              {isRevenue && chartData.length > 0 && (
                <div className="mt-4">
                  <MiniChart data={smoothData} />

                  <p
                    className={`text-xs mt-2 font-semibold ${
                      percent >= 0 ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {percent >= 0 ? "▲" : "▼"} {Math.abs(percent).toFixed(1)}%
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
      {/* QUICK INSIGHTS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-gradient-to-br from-white to-indigo-50 dark:from-gray-800 dark:to-gray-900 p-6 rounded-2xl shadow-lg hover:scale-105 transition-all">
          <p className="text-gray-500 text-sm">Average Order Value</p>
          <h3 className="text-2xl font-bold text-indigo-600">
            {dashboard.totalOrders > 0
              ? (dashboard.totalRevenue / dashboard.totalOrders).toLocaleString(
                  "vi-VN",
                )
              : 0}{" "}
            đ
          </h3>
        </div>

        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 rounded-2xl shadow-lg hover:shadow-indigo-500/20 hover:-translate-y-1 transition-all duration-300 border border-gray-200/50 dark:border-gray-700/50 p-5 rounded-xl shadow">
          <p className="text-gray-500 text-sm">Conversion Rate</p>
          <h3 className="text-2xl font-bold text-green-600">
            {dashboard.totalUsers > 0
              ? ((dashboard.totalOrders / dashboard.totalUsers) * 100).toFixed(
                  1,
                )
              : 0}
            %
          </h3>
        </div>

        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 rounded-2xl shadow-lg hover:shadow-indigo-500/20 hover:-translate-y-1 transition-all duration-300 border border-gray-200/50 dark:border-gray-700/50 p-5 rounded-xl shadow">
          <p className="text-gray-500 text-sm">Revenue / Product</p>
          <h3 className="text-2xl font-bold text-orange-500">
            {dashboard.totalProducts > 0
              ? (
                  dashboard.totalRevenue / dashboard.totalProducts
                ).toLocaleString("vi-VN")
              : 0}{" "}
            đ
          </h3>
        </div>
      </div>
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-6 rounded-2xl shadow-xl mb-8">
        <h2 className="text-lg font-semibold mb-4">Revenue Comparison</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-sm opacity-80">This Period</p>
            <h3 className="text-2xl font-bold">
              {currentRevenue.toLocaleString("vi-VN")} đ
            </h3>
          </div>

          <div>
            <p className="text-sm opacity-80">Previous Period</p>
            <h3 className="text-2xl font-bold">
              {lastRevenue.toLocaleString("vi-VN")} đ
            </h3>
          </div>

          <div>
            <p className="text-sm opacity-80">Growth</p>
            <h3 className="text-2xl font-bold">
              {percent >= 0 ? "▲" : "▼"} {Math.abs(percent).toFixed(1)}%
            </h3>
          </div>
        </div>
      </div>
      {/* Filter */}
      <div className="flex gap-2 mb-6 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl w-fit">
        {[
          { key: "7days", label: "7 Days" },
          { key: "30days", label: "30 Days" },
          { key: "month", label: "Monthly" },
        ].map((r) => (
          <button
            key={r.key}
            onClick={() => setRange(r.key)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
              range === r.key
                ? "bg-white dark:bg-gray-700 shadow text-indigo-600"
                : "text-gray-500 dark:text-gray-400"
            }`}
          >
            {r.label}
          </button>
        ))}
      </div>
      {/* CHART */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 rounded-2xl shadow-lg hover:shadow-indigo-500/20 hover:-translate-y-1 transition-all duration-300 border border-gray-200/50 dark:border-gray-700/50 p-6 rounded-xl shadow hover:shadow-lg transition w-full">
        <h2 className="mb-4 font-semibold flex items-center gap-2 text-black dark:text-white">
          Revenue (
          {range === "7days"
            ? "Last 7 days"
            : range === "30days"
              ? "Last 30 days"
              : "Monthly"}
          ){/* % tăng trưởng */}
          {chartData.length > 0 && (
            <span
              className={`text-sm font-bold px-2 py-0.5 rounded ${
                percent >= 0
                  ? "bg-green-100 text-green-600 dark:bg-green-500/20"
                  : "bg-red-100 text-red-600 dark:bg-red-500/20"
              }`}
            >
              {percent >= 0 ? "▲" : "▼"} {Math.abs(percent).toFixed(1)}%
            </span>
          )}
        </h2>
        {chartData.length === 0 ? (
          <div className="flex flex-col items-center py-16 text-gray-400">
            <span className="text-4xl">📊</span>
            <p className="text-gray-500 dark:text-gray-400 animate-pulse">
              No revenue data
            </p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={340}>
            <AreaChart data={smoothData}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.5} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>

              <CartesianGrid stroke={chartTheme.grid} strokeDasharray="3 3" />

              <XAxis
                dataKey={range === "month" ? "month" : "date"}
                stroke={chartTheme.text}
              />

              <YAxis
                tickFormatter={(v) => v.toLocaleString("vi-VN")}
                stroke={chartTheme.text}
              />

              <Tooltip
                formatter={(v) => v.toLocaleString("vi-VN") + " đ"}
                contentStyle={{
                  background: chartTheme.tooltipBg,
                  borderRadius: "12px",
                  border: "none",
                }}
              />

              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#6366f1"
                strokeWidth={4}
                fill="url(#colorRevenue)"
                connectNulls
                isAnimationActive
                animationDuration={1200}
                activeDot={{
                  r: 8,
                  fill: "#6366f1",
                  stroke: "#fff",
                  strokeWidth: 3,
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      {/*2 BLOCK */}
      <div className="grid grid-cols-2 gap-6 mt-10">
        {/* PIE */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 rounded-2xl shadow-lg hover:shadow-indigo-500/20 hover:-translate-y-1 transition-all duration-300 border border-gray-200/50 dark:border-gray-700/50 p-6 rounded-xl shadow">
          <h2 className="mb-4 font-semibold text-black dark:text-white">
            Order Status
          </h2>

          {orderStats.length === 0 ? (
            <p className="text-center text-gray-400 dark:text-gray-500 py-10 animate-pulse">
              No data
            </p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <text
                  x="50%"
                  y="50%"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="fill-gray-700 dark:fill-gray-200 text-lg font-bold"
                >
                  {dashboard.totalOrders || 0}
                </text>
                <Pie
                  data={orderStats}
                  dataKey="total"
                  nameKey="status"
                  innerRadius={70}
                  outerRadius={110}
                  paddingAngle={4}
                  label
                >
                  {orderStats.map((_, i) => (
                    <Cell
                      key={i}
                      fill={["#facc15", "#3b82f6", "#22c55e", "#ef4444"][i % 4]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend
                  wrapperStyle={{
                    color: isDark ? "#d1d5db" : "#374151",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* TOP PRODUCTS */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 rounded-2xl shadow-lg hover:shadow-indigo-500/20 hover:-translate-y-1 transition-all duration-300 border border-gray-200/50 dark:border-gray-700/50 p-6 rounded-xl shadow">
          <h2 className="mb-4 font-semibold text-black dark:text-white">
            Top Products
          </h2>

          {topProducts.length === 0 ? (
            <p className="text-center text-gray-400 py-10 animate-pulse">
              No products
            </p>
          ) : (
            topProducts.map((p, i) => (
              <div
                key={i}
                className="py-3 border-b border-gray-200 dark:border-gray-700"
              >
                <div className="flex justify-between mb-2">
                  <span className="text-gray-800 dark:text-gray-200">
                    {p.productName}
                  </span>

                  <span className="font-semibold text-indigo-600">
                    {p.totalSold}
                  </span>
                </div>

                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-indigo-500 h-2 rounded-full transition-all duration-700"
                    style={{
                      width: `${(p.totalSold / topProducts[0].totalSold) * 100}%`,
                    }}
                  />
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* TOP CUSTOMERS */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 rounded-2xl shadow-lg hover:shadow-indigo-500/20 hover:-translate-y-1 transition-all duration-300 border border-gray-200/50 dark:border-gray-700/50 p-6 rounded-xl shadow">
        <h2 className="mb-4 font-semibold text-black dark:text-white">
          Top Customers
        </h2>

        {topCustomers.length === 0 ? (
          <p className="text-center text-gray-400 py-10 animate-pulse">
            No customers
          </p>
        ) : (
          topCustomers.map((c, i) => (
            <div
              key={i}
              className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700"
            >
              <span className="text-gray-800 dark:text-gray-200 truncate max-w-[250px]">
                {c.email}
              </span>
              <span className="text-blue-600 font-semibold">
                {c.totalSpent.toLocaleString("vi-VN")} đ
              </span>
            </div>
          ))
        )}
      </div>
      {/* COUPON STATS */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 rounded-2xl shadow-lg hover:shadow-indigo-500/20 hover:-translate-y-1 transition-all duration-300 border border-gray-200/50 dark:border-gray-700/50 p-6 rounded-xl shadow mt-10">
        <h2 className="mb-4 font-semibold text-black dark:text-white">
          Coupon Analytics
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-blue-100 dark:bg-blue-500/20 p-4 rounded-lg">
            <p className="text-sm text-gray-500">Total</p>
            <p className="text-2xl font-bold text-blue-600">
              {couponStats.totalCoupons || 0}
            </p>
          </div>

          <div className="bg-green-100 dark:bg-green-500/20 p-4 rounded-lg">
            <p className="text-sm text-gray-500">Active</p>
            <p className="text-2xl font-bold text-green-600">
              {couponStats.activeCoupons || 0}
            </p>
          </div>

          <div className="bg-yellow-100 dark:bg-yellow-500/20 p-4 rounded-lg">
            <p className="text-sm text-gray-500">Used</p>
            <p className="text-2xl font-bold text-yellow-600">
              {couponStats.usedCoupons || 0}
            </p>
          </div>

          <div className="bg-purple-100 dark:bg-purple-500/20 p-4 rounded-lg">
            <p className="text-sm text-gray-500">Most Used</p>
            <p className="text-lg font-bold text-purple-600 truncate">
              {couponStats.mostUsedCoupon || "N/A"}
            </p>
          </div>
        </div>
      </div>
      {/*  Contact analytics */}
      <div className=" bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 rounded-2xl shadow-lg p-6 mt-10">
        <h2 className="mb-4 font-semibold">Contact Analytics</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-indigo-100 dark:bg-indigo-500/20 p-4 rounded-lg">
            <p className="text-sm text-gray-500">Total Messages</p>

            <p className="text-2xl font-bold text-indigo-600">
              {contactStats.totalMessages || 0}
            </p>
          </div>

          <div className="bg-red-100 dark:bg-red-500/20 p-4 rounded-lg">
            <p className="text-sm text-gray-500">Unread</p>

            <p className="text-2xl font-bold text-red-600">
              {contactStats.unreadMessages || 0}
            </p>
          </div>

          <div className="bg-green-100 dark:bg-green-500/20 p-4 rounded-lg">
            <p className="text-sm text-gray-500">Today</p>

            <p className="text-2xl font-bold text-green-600">
              {contactStats.todayMessages || 0}
            </p>
          </div>

          <div className="bg-yellow-100 dark:bg-yellow-500/20 p-4 rounded-lg">
            <p className="text-sm text-gray-500">This Month</p>

            <p className="text-2xl font-bold text-yellow-600">
              {contactStats.monthMessages || 0}
            </p>
          </div>
        </div>
      </div>
      {/*  Newsletter analytics */}
      <div
        className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl
border border-gray-200/50 dark:border-gray-700/50
rounded-2xl shadow-lg p-6 mt-10"
      >
        <h2 className="mb-4 font-semibold text-black dark:text-white">
          Newsletter Analytics
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-indigo-100 dark:bg-indigo-500/20 p-4 rounded-lg">
            <p className="text-sm text-gray-500">Total</p>
            <p className="text-2xl font-bold text-indigo-600">
              {newsletterStats.totalSubscribers || 0}
            </p>
          </div>

          <div className="bg-green-100 dark:bg-green-500/20 p-4 rounded-lg">
            <p className="text-sm text-gray-500">Active</p>
            <p className="text-2xl font-bold text-green-600">
              {newsletterStats.activeSubscribers || 0}
            </p>
          </div>

          <div className="bg-blue-100 dark:bg-blue-500/20 p-4 rounded-lg">
            <p className="text-sm text-gray-500">Today</p>
            <p className="text-2xl font-bold text-blue-600">
              {newsletterStats.todaySubscribers || 0}
            </p>
          </div>

          <div className="bg-purple-100 dark:bg-purple-500/20 p-4 rounded-lg">
            <p className="text-sm text-gray-500">This Month</p>
            <p className="text-2xl font-bold text-purple-600">
              {newsletterStats.monthSubscribers || 0}
            </p>
          </div>
        </div>
      </div>
      {/*  Lookbook analytics */}
      <div
        className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl
border border-gray-200/50 dark:border-gray-700/50
rounded-2xl shadow-lg p-6 mt-10"
      >
        <h2 className="mb-4 font-semibold text-black dark:text-white">
          Lookbook Analytics
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-pink-100 dark:bg-pink-500/20 p-4 rounded-xl">
            <p className="text-sm text-gray-500">Lookbooks</p>
            <p className="text-2xl font-bold text-pink-600">
              {lookbookStats.totalLookbooks || 0}
            </p>
          </div>

          <div className="bg-indigo-100 dark:bg-indigo-500/20 p-4 rounded-xl">
            <p className="text-sm text-gray-500">Images</p>
            <p className="text-2xl font-bold text-indigo-600">
              {lookbookStats.totalImages || 0}
            </p>
          </div>

          <div className="bg-yellow-100 dark:bg-yellow-500/20 p-4 rounded-xl">
            <p className="text-sm text-gray-500">Featured</p>
            <p className="font-bold text-yellow-700 truncate">
              {lookbookStats.featuredLookbook || "N/A"}
            </p>
          </div>

          <div className="bg-green-100 dark:bg-green-500/20 p-4 rounded-xl">
            <p className="text-sm text-gray-500">Latest Season</p>
            <p className="font-bold text-green-700 truncate">
              {lookbookStats.latestSeason || "N/A"}
            </p>
          </div>
        </div>
      </div>

      {/*  Collection analytics */}
      <div
        className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl
          border border-gray-200/50 dark:border-gray-700/50
          rounded-2xl shadow-lg p-6 mt-10"
      >
        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6">
          Collection Analytics
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <div className="bg-indigo-100 dark:bg-indigo-500/20 rounded-xl p-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Total Collections
            </p>
            <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
              {collectionStats.totalCollections}
            </p>
          </div>

          <div className="bg-pink-100 dark:bg-pink-500/20 rounded-xl p-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Featured Collections
            </p>
            <p className="text-3xl font-bold text-pink-600 dark:text-pink-400">
              {collectionStats.featuredCollections}
            </p>
          </div>

          <div className="bg-green-100 dark:bg-green-500/20 rounded-xl p-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Products in Collections
            </p>
            <p className="text-3xl font-bold text-green-600 dark:text-green-400">
              {collectionStats.totalProducts}
            </p>
          </div>

          <div className="bg-amber-100 dark:bg-amber-500/20 rounded-xl p-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Largest Collection
            </p>
            <p className="text-lg font-bold text-amber-600 dark:text-amber-400 truncate">
              {collectionStats.largestCollection}
            </p>
          </div>
          <div className="bg-cyan-100 dark:bg-cyan-500/20 rounded-xl p-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Best Selling
            </p>
            <p className="text-lg font-bold text-cyan-600 dark:text-cyan-400 truncate">
              {collectionStats?.bestSellingCollection || "N/A"}
            </p>
          </div>

          <div className="bg-purple-100 dark:bg-purple-500/20 rounded-xl p-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Highest Revenue
            </p>
            <p className="text-lg font-bold text-purple-600 dark:text-purple-400 truncate">
              {collectionStats?.highestRevenueCollection || "N/A"}
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-8">
          {/* Top Collection Table */}
          <div className="bg-gray-50 dark:bg-gray-900/30 rounded-xl p-5">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
              🏆 Top Collection Performance
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b dark:border-gray-700">
                    <th className="text-left py-2">Collection</th>
                    <th className="text-center py-2">Products</th>
                    <th className="text-center py-2">Sold</th>
                    <th className="text-right py-2">Revenue</th>
                  </tr>
                </thead>

                <tbody>
                  {topCollections.map((item, index) => (
                    <tr
                      key={item.name}
                      className="border-b dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800/40"
                    >
                      <td className="py-3 font-medium">
                        {index === 0
                          ? "🥇 "
                          : index === 1
                            ? "🥈 "
                            : index === 2
                              ? "🥉 "
                              : ""}
                        {item.name}
                      </td>

                      <td className="text-center">{item.products}</td>

                      <td className="text-center">{item.sold}</td>

                      <td className="text-right font-semibold">
                        {Number(item.revenue).toLocaleString("vi-VN")} đ
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Revenue Chart */}
          <div className="bg-gray-50 dark:bg-gray-900/30 rounded-xl p-5">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
              📈 Revenue by Collection
            </h3>

            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={topCollections}>
                <defs>
                  <linearGradient
                    id="revenueGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.9} />
                    <stop offset="95%" stopColor="#06B6D4" stopOpacity={0.8} />
                  </linearGradient>
                </defs>

                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip
                  formatter={(value) =>
                    `${Number(value).toLocaleString("vi-VN")} đ`
                  }
                />

                <Bar
                  dataKey="revenue"
                  fill="url(#revenueGradient)"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      {/* Wishlist Analytics */}
      <div
        className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl
  border border-gray-200/50 dark:border-gray-700/50
  rounded-2xl shadow-lg p-6 mt-10"
      >
        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6">
          Wishlist Analytics
        </h2>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-pink-100 dark:bg-pink-500/20 rounded-xl p-4">
            <p className="text-sm text-gray-500">Total Wishlist Records</p>
            <p className="text-3xl font-bold text-pink-600">
              {wishlistStats.totalWishlists}
            </p>
          </div>

          <div className="bg-indigo-100 dark:bg-indigo-500/20 rounded-xl p-4">
            <p className="text-sm text-gray-500">Total Items</p>
            <p className="text-3xl font-bold text-indigo-600">
              {wishlistStats.totalItems}
            </p>
          </div>

          <div className="bg-green-100 dark:bg-green-500/20 rounded-xl p-4">
            <p className="text-sm text-gray-500">Unique Users</p>
            <p className="text-3xl font-bold text-green-600">
              {wishlistStats.uniqueUsers}
            </p>
          </div>

          <div className="bg-yellow-100 dark:bg-yellow-500/20 rounded-xl p-4">
            <p className="text-sm text-gray-500">Most Wished</p>
            <p className="text-lg font-bold text-yellow-700 truncate">
              {wishlistStats.mostWishedProduct || "N/A"}
            </p>
          </div>

          <div className="bg-cyan-100 dark:bg-cyan-500/20 rounded-xl p-4">
            <p className="text-sm text-gray-500">Avg Items/User</p>
            <p className="text-3xl font-bold text-cyan-600">
              {wishlistStats.averageItemsPerUser}
            </p>
          </div>
        </div>

        {/* Table + Chart */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-8">
          {/* Top Products Table */}
          <div className="bg-gray-50 dark:bg-gray-900/30 rounded-xl p-5">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
              ❤️ Most Wishlisted Products
            </h3>

            <table className="w-full text-sm">
              <thead>
                <tr className="border-b dark:border-gray-700">
                  <th className="text-left py-2">Product</th>
                  <th className="text-right py-2">Wishlist Count</th>
                </tr>
              </thead>

              <tbody>
                {topWishlistProducts.map((item, index) => (
                  <tr
                    key={index}
                    className="border-b dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800/40"
                  >
                    <td className="py-3">
                      {index === 0
                        ? "🥇 "
                        : index === 1
                          ? "🥈 "
                          : index === 2
                            ? "🥉 "
                            : ""}
                      {item.productName}
                    </td>

                    <td className="text-right font-semibold text-pink-600">
                      {item.totalWishlists}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Chart */}
          <div className="bg-gray-50 dark:bg-gray-900/30 rounded-xl p-5">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
              📊 Wishlist Distribution
            </h3>

            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={topWishlistProducts}>
                <XAxis dataKey="productName" />
                <YAxis />
                <Tooltip />
                <Bar
                  dataKey="totalWishlists"
                  fill="#ec4899"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      {/* LATEST ORDERS */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 rounded-2xl shadow-lg hover:shadow-indigo-500/20 hover:-translate-y-1 transition-all duration-300 border border-gray-200/50 dark:border-gray-700/50 p-6 rounded-xl shadow mt-10">
        <h2 className="mb-4 font-semibold text-black dark:text-white">
          Latest Orders
        </h2>

        {latestOrders.length === 0 ? (
          <p className="text-center text-gray-400 py-10">No orders</p>
        ) : (
          <table className="w-full table-fixed text-sm">
            <thead>
              <tr className="text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-2">ID</th>
                <th className="text-left py-2">Total</th>
                <th className="text-left py-2">Status</th>
              </tr>
            </thead>

            <tbody>
              {latestOrders.map((o) => (
                <tr
                  key={o.id}
                  onClick={() => navigate(`/admin/orders/${o.id}`)}
                  className="border-b hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer border-gray-200 dark:border-gray-700"
                >
                  <td className="py-2 align-middle text-gray-700 dark:text-gray-300">
                    #{o.id}
                  </td>

                  <td className="py-2 align-middle text-gray-700 dark:text-gray-300">
                    {o.totalPrice.toLocaleString("vi-VN")} đ
                  </td>

                  <td className="py-2 align-middle text-gray-700 dark:text-gray-300">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        o.status === "COMPLETED"
                          ? "bg-green-100 text-green-600"
                          : o.status === "PENDING"
                            ? "bg-yellow-100 text-yellow-600"
                            : o.status === "CONFIRMED"
                              ? "bg-purple-100 text-purple-600"
                              : o.status === "SHIPPING"
                                ? "bg-blue-100 text-blue-600"
                                : "bg-red-100 text-red-600"
                      }`}
                    >
                      {getStatusIcon(o.status)} {o.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
