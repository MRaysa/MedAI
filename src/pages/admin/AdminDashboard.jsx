import { useState, useEffect, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router";
import { AuthContext } from "../../contexts/AuthContext";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  RadialBarChart,
  RadialBar,
  ComposedChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Sector,
} from "recharts";
import {
  FaUsers,
  FaUserMd,
  FaUserInjured,
  FaCalendarCheck,
  FaChartLine,
  FaShieldAlt,
  FaCog,
  FaBell,
  FaCheckCircle,
  FaClock,
  FaExclamationTriangle,
  FaUserPlus,
  FaClipboardList,
  FaHospital,
  FaMoneyBillWave,
  FaFileAlt,
  FaArrowUp,
  FaArrowDown,
  FaEye,
  FaHeartbeat,
  FaFlask,
  FaXRay,
  FaStar,
  FaGlobe,
  FaServer,
  FaDatabase,
  FaEnvelope,
  FaCloud,
  FaSyncAlt,
  FaDownload,
  FaFilter,
  FaCalendarAlt,
} from "react-icons/fa";
import { MdVerified, MdPending, MdHealthAndSafety, MdTrendingUp, MdTrendingDown } from "react-icons/md";
import { HiSparkles, HiLightningBolt } from "react-icons/hi";
import { BiPulse } from "react-icons/bi";
import { RiMentalHealthLine } from "react-icons/ri";

const AdminDashboard = () => {
  const { dbUser, apiCall } = useContext(AuthContext);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalDoctors: 0,
    totalPatients: 0,
    pendingVerifications: 0,
    todayAppointments: 0,
    monthlyRevenue: 0,
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [pendingDoctors, setPendingDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [timeRange, setTimeRange] = useState("week");

  // Chart Data
  const monthlyRevenueData = [
    { name: "Jan", revenue: 32000, appointments: 280, patients: 120 },
    { name: "Feb", revenue: 38000, appointments: 320, patients: 145 },
    { name: "Mar", revenue: 35000, appointments: 295, patients: 132 },
    { name: "Apr", revenue: 42000, appointments: 380, patients: 168 },
    { name: "May", revenue: 48000, appointments: 420, patients: 195 },
    { name: "Jun", revenue: 45000, appointments: 395, patients: 178 },
    { name: "Jul", revenue: 52000, appointments: 460, patients: 210 },
    { name: "Aug", revenue: 49000, appointments: 430, patients: 198 },
    { name: "Sep", revenue: 55000, appointments: 485, patients: 225 },
    { name: "Oct", revenue: 58000, appointments: 510, patients: 242 },
    { name: "Nov", revenue: 62000, appointments: 545, patients: 260 },
    { name: "Dec", revenue: 68000, appointments: 590, patients: 285 },
  ];

  const appointmentsByDepartment = [
    { name: "General Medicine", value: 450, color: "#14b8a6" },
    { name: "Cardiology", value: 280, color: "#ef4444" },
    { name: "Pediatrics", value: 220, color: "#8b5cf6" },
    { name: "Orthopedics", value: 180, color: "#3b82f6" },
    { name: "Dermatology", value: 150, color: "#f59e0b" },
    { name: "Neurology", value: 120, color: "#ec4899" },
    { name: "Others", value: 200, color: "#6b7280" },
  ];

  const userGrowthData = [
    { name: "Week 1", patients: 150, doctors: 5 },
    { name: "Week 2", patients: 220, doctors: 8 },
    { name: "Week 3", patients: 310, doctors: 12 },
    { name: "Week 4", patients: 420, doctors: 15 },
    { name: "Week 5", patients: 550, doctors: 18 },
    { name: "Week 6", patients: 680, doctors: 22 },
    { name: "Week 7", patients: 820, doctors: 28 },
    { name: "Week 8", patients: 980, doctors: 35 },
  ];

  const appointmentStatusData = [
    { name: "Completed", value: 65, fill: "#10b981" },
    { name: "Scheduled", value: 20, fill: "#3b82f6" },
    { name: "Cancelled", value: 10, fill: "#ef4444" },
    { name: "No-show", value: 5, fill: "#f59e0b" },
  ];

  const dailyAppointmentsData = [
    { day: "Mon", appointments: 45, revenue: 4500 },
    { day: "Tue", appointments: 52, revenue: 5200 },
    { day: "Wed", appointments: 48, revenue: 4800 },
    { day: "Thu", appointments: 61, revenue: 6100 },
    { day: "Fri", appointments: 55, revenue: 5500 },
    { day: "Sat", appointments: 38, revenue: 3800 },
    { day: "Sun", appointments: 22, revenue: 2200 },
  ];

  const doctorPerformanceData = [
    { name: "Dr. Sarah Wilson", appointments: 120, rating: 4.9, revenue: 12000 },
    { name: "Dr. Michael Chen", appointments: 105, rating: 4.8, revenue: 10500 },
    { name: "Dr. Emily Davis", appointments: 98, rating: 4.7, revenue: 9800 },
    { name: "Dr. James Lee", appointments: 92, rating: 4.8, revenue: 9200 },
    { name: "Dr. Maria Garcia", appointments: 88, rating: 4.6, revenue: 8800 },
  ];

  const patientDemographicsData = [
    { age: "0-18", male: 120, female: 135 },
    { age: "19-35", male: 280, female: 320 },
    { age: "36-50", male: 350, female: 380 },
    { age: "51-65", male: 220, female: 250 },
    { age: "65+", male: 150, female: 180 },
  ];

  const diagnosticsData = [
    { name: "Lab Tests", count: 450, growth: 12 },
    { name: "Imaging", count: 280, growth: 8 },
    { name: "Cardio Tests", count: 180, growth: 15 },
    { name: "Biopsies", count: 65, growth: -3 },
  ];

  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true);
      setTimeout(() => {
        setStats({
          totalUsers: 12580,
          totalDoctors: 148,
          totalPatients: 11820,
          pendingVerifications: 8,
          todayAppointments: 142,
          monthlyRevenue: 285600,
        });

        setRecentActivities([
          { id: 1, type: "user_registered", message: "New patient registered", user: "John Smith", time: "2 mins ago" },
          { id: 2, type: "doctor_verified", message: "Doctor verification approved", user: "Dr. Sarah Wilson", time: "15 mins ago" },
          { id: 3, type: "appointment", message: "Appointment completed", user: "Emily Davis", time: "1 hour ago" },
          { id: 4, type: "payment", message: "Payment received", amount: "$450", time: "2 hours ago" },
          { id: 5, type: "user_registered", message: "New doctor registered", user: "Dr. Michael Brown", time: "3 hours ago" },
          { id: 6, type: "lab_result", message: "Lab results uploaded", user: "Patient #12458", time: "4 hours ago" },
        ]);

        setPendingDoctors([
          { id: 1, name: "Dr. James Lee", specialty: "Cardiology", appliedDate: "2024-12-05", avatar: "JL" },
          { id: 2, name: "Dr. Maria Garcia", specialty: "Pediatrics", appliedDate: "2024-12-04", avatar: "MG" },
          { id: 3, name: "Dr. Robert Chen", specialty: "Orthopedics", appliedDate: "2024-12-03", avatar: "RC" },
          { id: 4, name: "Dr. Lisa Wang", specialty: "Neurology", appliedDate: "2024-12-02", avatar: "LW" },
        ]);

        setLoading(false);
      }, 800);
    };

    loadDashboardData();
  }, []);

  const statCards = [
    {
      title: "Total Users",
      value: stats.totalUsers.toLocaleString(),
      icon: FaUsers,
      gradient: "from-blue-500 to-indigo-600",
      bgGlow: "bg-blue-500/20",
      change: "+12.5%",
      changeType: "positive",
      sparkline: [30, 45, 35, 50, 49, 60, 70, 91],
    },
    {
      title: "Active Doctors",
      value: stats.totalDoctors,
      icon: FaUserMd,
      gradient: "from-teal-500 to-cyan-600",
      bgGlow: "bg-teal-500/20",
      change: "+8",
      changeType: "positive",
      sparkline: [20, 25, 30, 35, 40, 42, 45, 48],
    },
    {
      title: "Patients",
      value: stats.totalPatients.toLocaleString(),
      icon: FaUserInjured,
      gradient: "from-purple-500 to-pink-600",
      bgGlow: "bg-purple-500/20",
      change: "+18.2%",
      changeType: "positive",
      sparkline: [100, 150, 200, 280, 350, 420, 500, 580],
    },
    {
      title: "Pending Verifications",
      value: stats.pendingVerifications,
      icon: MdPending,
      gradient: "from-amber-500 to-orange-600",
      bgGlow: "bg-amber-500/20",
      change: "Action needed",
      changeType: "warning",
      sparkline: [5, 8, 6, 10, 7, 9, 8, 8],
    },
    {
      title: "Today's Appointments",
      value: stats.todayAppointments,
      icon: FaCalendarCheck,
      gradient: "from-green-500 to-emerald-600",
      bgGlow: "bg-green-500/20",
      change: "+24%",
      changeType: "positive",
      sparkline: [80, 95, 110, 100, 120, 115, 130, 142],
    },
    {
      title: "Monthly Revenue",
      value: `$${stats.monthlyRevenue.toLocaleString()}`,
      icon: FaMoneyBillWave,
      gradient: "from-emerald-500 to-green-600",
      bgGlow: "bg-emerald-500/20",
      change: "+32%",
      changeType: "positive",
      sparkline: [150, 180, 200, 220, 250, 265, 280, 285],
    },
  ];

  const quickActions = [
    { title: "Manage Users", icon: FaUsers, path: "/admin/users", color: "from-blue-500 to-blue-600", count: "12.5k" },
    { title: "Verify Doctors", icon: MdVerified, path: "/admin/verify-doctors", color: "from-teal-500 to-teal-600", count: "8 pending" },
    { title: "View Reports", icon: FaChartLine, path: "/admin/reports", color: "from-purple-500 to-purple-600", count: "Analytics" },
    { title: "System Settings", icon: FaCog, path: "/admin/settings", color: "from-gray-500 to-gray-600", count: "Configure" },
  ];

  const getActivityIcon = (type) => {
    switch (type) {
      case "user_registered":
        return <FaUserPlus className="text-blue-500" />;
      case "doctor_verified":
        return <MdVerified className="text-green-500" />;
      case "appointment":
        return <FaCalendarCheck className="text-teal-500" />;
      case "payment":
        return <FaMoneyBillWave className="text-emerald-500" />;
      case "lab_result":
        return <FaFlask className="text-purple-500" />;
      default:
        return <FaBell className="text-gray-500" />;
    }
  };

  const renderActiveShape = (props) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
    return (
      <g>
        <text x={cx} y={cy - 10} dy={8} textAnchor="middle" fill="#333" className="text-lg font-bold">
          {payload.name}
        </text>
        <text x={cx} y={cy + 15} dy={8} textAnchor="middle" fill="#666" className="text-sm">
          {value} ({(percent * 100).toFixed(0)}%)
        </text>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius + 10}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 15}
          outerRadius={outerRadius + 20}
          fill={fill}
        />
      </g>
    );
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/95 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-gray-100">
          <p className="font-semibold text-gray-900">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.name}: {typeof entry.value === 'number' && entry.name.includes('revenue') ? `$${entry.value.toLocaleString()}` : entry.value.toLocaleString()}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-500/30 border-t-purple-500 mx-auto"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <HiSparkles className="text-purple-400 text-xl animate-pulse" />
            </div>
          </div>
          <p className="mt-4 text-purple-200">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Decorative Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-200 rounded-full blur-3xl opacity-30" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-200 rounded-full blur-3xl opacity-30" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-teal-200 rounded-full blur-3xl opacity-20" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 rounded-2xl flex items-center justify-center shadow-xl shadow-purple-500/25">
                  <FaShieldAlt className="text-white text-2xl" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-lg flex items-center justify-center">
                  <FaCheckCircle className="text-white text-xs" />
                </div>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                  Admin Dashboard
                  <HiSparkles className="text-yellow-500" />
                </h1>
                <p className="text-gray-500">
                  Welcome back, {dbUser?.firstName || "Admin"}! Here's your analytics overview.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="year">This Year</option>
              </select>
              <button className="p-2.5 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition">
                <FaSyncAlt className="text-gray-600" />
              </button>
              <button className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition shadow-lg shadow-purple-500/25">
                <FaDownload />
                Export
              </button>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative bg-white rounded-2xl shadow-sm border border-gray-100 p-6 overflow-hidden hover:shadow-lg transition-all group"
            >
              {/* Glow Effect */}
              <div className={`absolute -top-20 -right-20 w-40 h-40 ${stat.bgGlow} rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity`} />

              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.gradient} shadow-lg`}>
                    <stat.icon className="text-xl text-white" />
                  </div>
                  <span
                    className={`flex items-center gap-1 text-sm font-medium px-2.5 py-1 rounded-full ${
                      stat.changeType === "positive"
                        ? "bg-green-100 text-green-700"
                        : stat.changeType === "warning"
                        ? "bg-amber-100 text-amber-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {stat.changeType === "positive" && <FaArrowUp className="text-xs" />}
                    {stat.changeType === "negative" && <FaArrowDown className="text-xs" />}
                    {stat.change}
                  </span>
                </div>
                <h3 className="text-3xl font-bold text-gray-900">{stat.value}</h3>
                <p className="text-sm text-gray-500 mt-1">{stat.title}</p>

                {/* Mini Sparkline */}
                <div className="mt-4 h-10">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={stat.sparkline.map((v, i) => ({ value: v }))}>
                      <defs>
                        <linearGradient id={`sparkline-${index}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={stat.gradient.includes('blue') ? '#3b82f6' : stat.gradient.includes('teal') ? '#14b8a6' : stat.gradient.includes('purple') ? '#8b5cf6' : stat.gradient.includes('amber') ? '#f59e0b' : stat.gradient.includes('green') ? '#10b981' : '#10b981'} stopOpacity={0.3}/>
                          <stop offset="95%" stopColor={stat.gradient.includes('blue') ? '#3b82f6' : stat.gradient.includes('teal') ? '#14b8a6' : stat.gradient.includes('purple') ? '#8b5cf6' : stat.gradient.includes('amber') ? '#f59e0b' : stat.gradient.includes('green') ? '#10b981' : '#10b981'} stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <Area
                        type="monotone"
                        dataKey="value"
                        stroke={stat.gradient.includes('blue') ? '#3b82f6' : stat.gradient.includes('teal') ? '#14b8a6' : stat.gradient.includes('purple') ? '#8b5cf6' : stat.gradient.includes('amber') ? '#f59e0b' : '#10b981'}
                        fill={`url(#sparkline-${index})`}
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Main Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Revenue & Appointments Trend */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Revenue & Appointments</h3>
                <p className="text-sm text-gray-500">Monthly performance overview</p>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <span className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></span>
                  Revenue
                </span>
                <span className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full"></span>
                  Appointments
                </span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={monthlyRevenueData}>
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} />
                <YAxis yAxisId="left" stroke="#9ca3af" fontSize={12} tickFormatter={(value) => `$${value/1000}k`} />
                <YAxis yAxisId="right" orientation="right" stroke="#9ca3af" fontSize={12} />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  yAxisId="left"
                  type="monotone"
                  dataKey="revenue"
                  fill="url(#revenueGradient)"
                  stroke="#8b5cf6"
                  strokeWidth={3}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="appointments"
                  stroke="#14b8a6"
                  strokeWidth={3}
                  dot={{ fill: "#14b8a6", strokeWidth: 2 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Appointments by Department - Pie Chart */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Appointments by Department</h3>
                <p className="text-sm text-gray-500">Distribution across specialties</p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  activeIndex={activeIndex}
                  activeShape={renderActiveShape}
                  data={appointmentsByDepartment}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  dataKey="value"
                  onMouseEnter={(_, index) => setActiveIndex(index)}
                >
                  {appointmentsByDepartment.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Second Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* User Growth - Area Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">User Growth</h3>
                <p className="text-sm text-gray-500">Patients vs Doctors over time</p>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <span className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-purple-500 rounded-full"></span>
                  Patients
                </span>
                <span className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-teal-500 rounded-full"></span>
                  Doctors
                </span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={userGrowthData}>
                <defs>
                  <linearGradient id="patientGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="doctorGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#14b8a6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} />
                <YAxis stroke="#9ca3af" fontSize={12} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="patients" stroke="#8b5cf6" fill="url(#patientGradient)" strokeWidth={2} />
                <Area type="monotone" dataKey="doctors" stroke="#14b8a6" fill="url(#doctorGradient)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Appointment Status - Radial Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
          >
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Appointment Status</h3>
              <p className="text-sm text-gray-500">Current distribution</p>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <RadialBarChart cx="50%" cy="50%" innerRadius="30%" outerRadius="90%" data={appointmentStatusData} startAngle={180} endAngle={0}>
                <RadialBar
                  minAngle={15}
                  background
                  clockWise
                  dataKey="value"
                  cornerRadius={10}
                />
                <Tooltip />
              </RadialBarChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {appointmentStatusData.map((item, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.fill }}></span>
                  <span className="text-gray-600">{item.name}: {item.value}%</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Third Row - Bar Charts and Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Daily Appointments Bar Chart */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Weekly Overview</h3>
                <p className="text-sm text-gray-500">Daily appointments & revenue</p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={dailyAppointmentsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="day" stroke="#9ca3af" fontSize={12} />
                <YAxis yAxisId="left" stroke="#9ca3af" fontSize={12} />
                <YAxis yAxisId="right" orientation="right" stroke="#9ca3af" fontSize={12} tickFormatter={(value) => `$${value/1000}k`} />
                <Tooltip content={<CustomTooltip />} />
                <Bar yAxisId="left" dataKey="appointments" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                <Bar yAxisId="right" dataKey="revenue" fill="#14b8a6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Patient Demographics */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Patient Demographics</h3>
                <p className="text-sm text-gray-500">Age & gender distribution</p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={patientDemographicsData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis type="number" stroke="#9ca3af" fontSize={12} />
                <YAxis dataKey="age" type="category" stroke="#9ca3af" fontSize={12} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="male" fill="#3b82f6" radius={[0, 4, 4, 0]} name="Male" />
                <Bar dataKey="female" fill="#ec4899" radius={[0, 4, 4, 0]} name="Female" />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <Link
                key={action.title}
                to={action.path}
                className="bg-white rounded-2xl p-5 border border-gray-100 hover:shadow-lg transition-all hover:-translate-y-1 group"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                  <action.icon className="text-xl text-white" />
                </div>
                <h3 className="font-semibold text-gray-900">{action.title}</h3>
                <p className="text-sm text-gray-500 mt-1">{action.count}</p>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Top Performing Doctors */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Top Doctors</h3>
              <Link to="/admin/users" className="text-sm text-purple-600 hover:text-purple-700 font-medium">
                View all
              </Link>
            </div>
            <div className="space-y-4">
              {doctorPerformanceData.map((doctor, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-xl flex items-center justify-center text-white font-bold text-sm">
                      #{index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{doctor.name}</p>
                      <p className="text-xs text-gray-500">{doctor.appointments} appointments</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-amber-500">
                    <FaStar className="text-xs" />
                    <span className="text-sm font-medium">{doctor.rating}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Pending Verifications */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Pending Verifications</h3>
              <Link to="/admin/verify-doctors" className="text-sm text-purple-600 hover:text-purple-700 font-medium">
                View all
              </Link>
            </div>
            <div className="space-y-3">
              {pendingDoctors.map((doctor) => (
                <div key={doctor.id} className="flex items-center justify-between p-3 bg-amber-50 rounded-xl border border-amber-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-bold text-sm">
                      {doctor.avatar}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{doctor.name}</p>
                      <p className="text-xs text-gray-500">{doctor.specialty}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition">
                      <FaCheckCircle />
                    </button>
                    <button className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition">
                      <FaExclamationTriangle />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
              <Link to="/admin/activity-log" className="text-sm text-purple-600 hover:text-purple-700 font-medium">
                View all
              </Link>
            </div>
            <div className="space-y-3">
              {recentActivities.slice(0, 5).map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 p-2 hover:bg-gray-50 rounded-xl transition">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900 truncate">{activity.message}</p>
                    <p className="text-xs text-gray-500">
                      {activity.user || activity.amount} • {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* System Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="mt-8 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 rounded-2xl p-6 text-white"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">System Status</h3>
            <span className="flex items-center gap-2 text-sm bg-white/20 px-3 py-1 rounded-full">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              All Systems Operational
            </span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: "API Server", icon: FaServer, uptime: "99.9%" },
              { name: "Database", icon: FaDatabase, uptime: "99.8%" },
              { name: "Email Service", icon: FaEnvelope, uptime: "99.7%" },
              { name: "Cloud Storage", icon: FaCloud, uptime: "99.9%" },
            ].map((service, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <service.icon className="text-xl" />
                  <div>
                    <p className="font-medium">{service.name}</p>
                    <p className="text-sm text-white/70">Uptime: {service.uptime}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;
