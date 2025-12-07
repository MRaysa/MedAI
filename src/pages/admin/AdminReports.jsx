import { useState, useEffect, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Treemap,
  Funnel,
  FunnelChart,
  LabelList,
} from "recharts";
import {
  FaChartLine,
  FaChartBar,
  FaChartPie,
  FaChartArea,
  FaDownload,
  FaFilter,
  FaCalendarAlt,
  FaPrint,
  FaFileExcel,
  FaFilePdf,
  FaUserMd,
  FaUserInjured,
  FaMoneyBillWave,
  FaCalendarCheck,
  FaArrowUp,
  FaArrowDown,
  FaHospital,
  FaClock,
  FaStethoscope,
  FaFlask,
  FaXRay,
  FaStar,
  FaExclamationTriangle,
  FaCheckCircle,
  FaTimes,
  FaEye,
  FaExpand,
  FaCompress,
  FaSyncAlt,
  FaCog,
  FaShare,
  FaBookmark,
  FaTable,
  FaGlobe,
  FaMapMarkerAlt,
  FaUsers,
} from "react-icons/fa";
import { HiSparkles, HiTrendingUp, HiTrendingDown } from "react-icons/hi";
import { BiPulse, BiTime } from "react-icons/bi";
import { MdHealthAndSafety, MdInsights, MdAnalytics } from "react-icons/md";
import { RiMentalHealthLine } from "react-icons/ri";

const AdminReports = () => {
  const { apiCall } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [dateRange, setDateRange] = useState("month");
  const [selectedYear, setSelectedYear] = useState(2024);
  const [showExportModal, setShowExportModal] = useState(false);
  const [expandedChart, setExpandedChart] = useState(null);

  // Report Data
  const [reportData, setReportData] = useState({
    revenue: [],
    appointments: [],
    patients: [],
    doctors: [],
  });

  // Revenue Data - Monthly
  const revenueData = [
    { month: "Jan", revenue: 125000, expenses: 45000, profit: 80000, target: 120000 },
    { month: "Feb", revenue: 138000, expenses: 48000, profit: 90000, target: 130000 },
    { month: "Mar", revenue: 152000, expenses: 52000, profit: 100000, target: 140000 },
    { month: "Apr", revenue: 145000, expenses: 50000, profit: 95000, target: 145000 },
    { month: "May", revenue: 168000, expenses: 55000, profit: 113000, target: 150000 },
    { month: "Jun", revenue: 175000, expenses: 58000, profit: 117000, target: 160000 },
    { month: "Jul", revenue: 182000, expenses: 60000, profit: 122000, target: 170000 },
    { month: "Aug", revenue: 195000, expenses: 65000, profit: 130000, target: 180000 },
    { month: "Sep", revenue: 210000, expenses: 68000, profit: 142000, target: 190000 },
    { month: "Oct", revenue: 225000, expenses: 72000, profit: 153000, target: 200000 },
    { month: "Nov", revenue: 240000, expenses: 75000, profit: 165000, target: 220000 },
    { month: "Dec", revenue: 265000, expenses: 80000, profit: 185000, target: 250000 },
  ];

  // Appointment Statistics
  const appointmentStats = [
    { name: "Completed", value: 4520, color: "#10b981", percentage: 65 },
    { name: "Scheduled", value: 1390, color: "#3b82f6", percentage: 20 },
    { name: "Cancelled", value: 695, color: "#ef4444", percentage: 10 },
    { name: "No-show", value: 348, color: "#f59e0b", percentage: 5 },
  ];

  // Department Performance
  const departmentData = [
    { name: "Cardiology", patients: 850, revenue: 425000, rating: 4.8, appointments: 1200, growth: 15 },
    { name: "Orthopedics", patients: 720, revenue: 380000, rating: 4.7, appointments: 980, growth: 12 },
    { name: "Pediatrics", patients: 680, revenue: 295000, rating: 4.9, appointments: 1100, growth: 18 },
    { name: "Dermatology", patients: 550, revenue: 245000, rating: 4.6, appointments: 750, growth: 8 },
    { name: "Neurology", patients: 420, revenue: 320000, rating: 4.8, appointments: 580, growth: 10 },
    { name: "General Med", patients: 980, revenue: 350000, rating: 4.5, appointments: 1450, growth: 20 },
  ];

  // Patient Demographics
  const demographicsData = [
    { age: "0-18", male: 450, female: 520, total: 970 },
    { age: "19-30", male: 680, female: 750, total: 1430 },
    { age: "31-45", male: 920, female: 1050, total: 1970 },
    { age: "46-60", male: 780, female: 850, total: 1630 },
    { age: "60+", male: 520, female: 680, total: 1200 },
  ];

  // Hourly Appointment Distribution
  const hourlyData = [
    { hour: "8AM", appointments: 25, walkins: 5 },
    { hour: "9AM", appointments: 45, walkins: 8 },
    { hour: "10AM", appointments: 62, walkins: 12 },
    { hour: "11AM", appointments: 58, walkins: 10 },
    { hour: "12PM", appointments: 35, walkins: 6 },
    { hour: "1PM", appointments: 28, walkins: 4 },
    { hour: "2PM", appointments: 55, walkins: 9 },
    { hour: "3PM", appointments: 68, walkins: 14 },
    { hour: "4PM", appointments: 72, walkins: 16 },
    { hour: "5PM", appointments: 48, walkins: 8 },
    { hour: "6PM", appointments: 32, walkins: 5 },
  ];

  // Revenue by Service Type
  const serviceRevenueData = [
    { name: "Consultations", value: 850000, color: "#8b5cf6" },
    { name: "Lab Tests", value: 420000, color: "#14b8a6" },
    { name: "Imaging", value: 380000, color: "#3b82f6" },
    { name: "Procedures", value: 520000, color: "#f59e0b" },
    { name: "Pharmacy", value: 290000, color: "#ec4899" },
    { name: "Other", value: 140000, color: "#6b7280" },
  ];

  // Doctor Performance
  const doctorPerformance = [
    { name: "Dr. Sarah Wilson", specialty: "Cardiology", patients: 320, rating: 4.9, revenue: 85000 },
    { name: "Dr. Michael Chen", specialty: "Orthopedics", patients: 285, rating: 4.8, revenue: 78000 },
    { name: "Dr. Emily Davis", specialty: "Pediatrics", patients: 350, rating: 4.9, revenue: 72000 },
    { name: "Dr. James Lee", specialty: "Neurology", patients: 210, rating: 4.7, revenue: 95000 },
    { name: "Dr. Maria Garcia", specialty: "Dermatology", patients: 280, rating: 4.6, revenue: 68000 },
    { name: "Dr. Robert Kim", specialty: "General", patients: 420, rating: 4.5, revenue: 62000 },
  ];

  // Patient Acquisition Funnel
  const funnelData = [
    { name: "Website Visits", value: 15000, fill: "#8b5cf6" },
    { name: "Account Created", value: 8500, fill: "#6366f1" },
    { name: "Profile Completed", value: 6200, fill: "#3b82f6" },
    { name: "Appointment Booked", value: 4800, fill: "#14b8a6" },
    { name: "Appointment Completed", value: 4200, fill: "#10b981" },
  ];

  // Geographic Distribution
  const geographicData = [
    { region: "North", patients: 3200, percentage: 28 },
    { region: "South", patients: 2800, percentage: 24 },
    { region: "East", patients: 2400, percentage: 21 },
    { region: "West", patients: 1900, percentage: 17 },
    { region: "Central", patients: 1150, percentage: 10 },
  ];

  // Weekly Trends
  const weeklyTrends = [
    { day: "Mon", appointments: 145, revenue: 14500, newPatients: 12 },
    { day: "Tue", appointments: 168, revenue: 16800, newPatients: 15 },
    { day: "Wed", appointments: 152, revenue: 15200, newPatients: 11 },
    { day: "Thu", appointments: 178, revenue: 17800, newPatients: 18 },
    { day: "Fri", appointments: 165, revenue: 16500, newPatients: 14 },
    { day: "Sat", appointments: 95, revenue: 9500, newPatients: 8 },
    { day: "Sun", appointments: 45, revenue: 4500, newPatients: 4 },
  ];

  // KPI Summary
  const kpiData = [
    {
      title: "Total Revenue",
      value: "$2.42M",
      change: "+18.5%",
      changeType: "positive",
      icon: FaMoneyBillWave,
      color: "from-emerald-500 to-green-600",
      sparkline: [150, 180, 200, 220, 250, 265, 280, 285],
    },
    {
      title: "Total Appointments",
      value: "6,953",
      change: "+12.3%",
      changeType: "positive",
      icon: FaCalendarCheck,
      color: "from-blue-500 to-indigo-600",
      sparkline: [400, 450, 480, 520, 550, 580, 620, 695],
    },
    {
      title: "Active Patients",
      value: "11,820",
      change: "+24.8%",
      changeType: "positive",
      icon: FaUserInjured,
      color: "from-purple-500 to-pink-600",
      sparkline: [800, 900, 1000, 1100, 1180, 1200, 1250, 1182],
    },
    {
      title: "Avg. Wait Time",
      value: "12 min",
      change: "-3.2%",
      changeType: "positive",
      icon: FaClock,
      color: "from-amber-500 to-orange-600",
      sparkline: [18, 16, 15, 14, 13, 12, 12, 12],
    },
    {
      title: "Patient Satisfaction",
      value: "4.8/5.0",
      change: "+0.2",
      changeType: "positive",
      icon: FaStar,
      color: "from-yellow-500 to-amber-600",
      sparkline: [4.5, 4.5, 4.6, 4.6, 4.7, 4.7, 4.8, 4.8],
    },
    {
      title: "Bed Occupancy",
      value: "78%",
      change: "+5%",
      changeType: "warning",
      icon: FaHospital,
      color: "from-teal-500 to-cyan-600",
      sparkline: [65, 68, 70, 72, 74, 76, 77, 78],
    },
  ];

  // Diagnostics Summary
  const diagnosticsData = [
    { name: "Blood Tests", count: 2450, growth: 15, avgTime: "24h" },
    { name: "X-Ray", count: 1280, growth: 8, avgTime: "2h" },
    { name: "MRI", count: 420, growth: 22, avgTime: "48h" },
    { name: "CT Scan", count: 380, growth: 18, avgTime: "24h" },
    { name: "Ultrasound", count: 890, growth: 12, avgTime: "1h" },
    { name: "ECG", count: 1650, growth: 10, avgTime: "30m" },
  ];

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  const tabs = [
    { id: "overview", label: "Overview", icon: MdAnalytics },
    { id: "revenue", label: "Revenue", icon: FaMoneyBillWave },
    { id: "appointments", label: "Appointments", icon: FaCalendarCheck },
    { id: "patients", label: "Patients", icon: FaUserInjured },
    { id: "doctors", label: "Doctors", icon: FaUserMd },
    { id: "diagnostics", label: "Diagnostics", icon: FaFlask },
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/95 backdrop-blur-sm p-4 rounded-xl shadow-xl border border-gray-100">
          <p className="font-semibold text-gray-900 mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm flex items-center gap-2">
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }}></span>
              <span className="text-gray-600">{entry.name}:</span>
              <span className="font-medium" style={{ color: entry.color }}>
                {typeof entry.value === "number" && entry.name.toLowerCase().includes("revenue")
                  ? `$${entry.value.toLocaleString()}`
                  : entry.value.toLocaleString()}
              </span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const ChartCard = ({ title, subtitle, children, className = "", actions = true }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden ${className}`}
    >
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
          </div>
          {actions && (
            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-gray-100 rounded-lg transition">
                <FaExpand className="text-gray-400" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition">
                <FaDownload className="text-gray-400" />
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="p-6">{children}</div>
    </motion.div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-500/30 border-t-purple-500 mx-auto"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <MdAnalytics className="text-purple-500 text-xl animate-pulse" />
            </div>
          </div>
          <p className="mt-4 text-gray-600">Loading reports...</p>
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
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-xl shadow-purple-500/25">
                  <FaChartLine className="text-white text-2xl" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-lg flex items-center justify-center">
                  <HiSparkles className="text-white text-xs" />
                </div>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                  Analytics & Reports
                  <MdInsights className="text-purple-500" />
                </h1>
                <p className="text-gray-500">Comprehensive healthcare analytics and insights</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="quarter">This Quarter</option>
                <option value="year">This Year</option>
                <option value="custom">Custom Range</option>
              </select>

              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value={2024}>2024</option>
                <option value={2023}>2023</option>
                <option value={2022}>2022</option>
              </select>

              <button className="p-2.5 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition">
                <FaSyncAlt className="text-gray-600" />
              </button>

              <button
                onClick={() => setShowExportModal(true)}
                className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition shadow-lg shadow-purple-500/25"
              >
                <FaDownload />
                Export Report
              </button>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-2 inline-flex flex-wrap gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/25"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <tab.icon className={activeTab === tab.id ? "text-white" : "text-gray-400"} />
                {tab.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {kpiData.map((kpi, index) => (
            <motion.div
              key={kpi.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-all group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${kpi.color} shadow-lg`}>
                  <kpi.icon className="text-xl text-white" />
                </div>
                <span
                  className={`flex items-center gap-1 text-sm font-medium px-2.5 py-1 rounded-full ${
                    kpi.changeType === "positive"
                      ? "bg-green-100 text-green-700"
                      : kpi.changeType === "warning"
                      ? "bg-amber-100 text-amber-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {kpi.changeType === "positive" ? (
                    <HiTrendingUp className="text-sm" />
                  ) : (
                    <HiTrendingDown className="text-sm" />
                  )}
                  {kpi.change}
                </span>
              </div>
              <h3 className="text-3xl font-bold text-gray-900">{kpi.value}</h3>
              <p className="text-sm text-gray-500 mt-1">{kpi.title}</p>

              {/* Mini Sparkline */}
              <div className="mt-4 h-10">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={kpi.sparkline.map((v) => ({ value: v }))}>
                    <defs>
                      <linearGradient id={`kpi-gradient-${index}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="#8b5cf6"
                      fill={`url(#kpi-gradient-${index})`}
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Main Content Based on Active Tab */}
        <AnimatePresence mode="wait">
          {activeTab === "overview" && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Revenue vs Target Chart */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ChartCard title="Revenue Performance" subtitle="Monthly revenue vs target comparison">
                  <ResponsiveContainer width="100%" height={300}>
                    <ComposedChart data={revenueData}>
                      <defs>
                        <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="month" stroke="#9ca3af" fontSize={12} />
                      <YAxis stroke="#9ca3af" fontSize={12} tickFormatter={(v) => `$${v / 1000}k`} />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <Area
                        type="monotone"
                        dataKey="revenue"
                        fill="url(#revenueGradient)"
                        stroke="#8b5cf6"
                        strokeWidth={2}
                        name="Revenue"
                      />
                      <Line
                        type="monotone"
                        dataKey="target"
                        stroke="#f59e0b"
                        strokeWidth={2}
                        strokeDasharray="5 5"
                        name="Target"
                        dot={false}
                      />
                      <Bar dataKey="profit" fill="#10b981" name="Profit" radius={[4, 4, 0, 0]} barSize={20} />
                    </ComposedChart>
                  </ResponsiveContainer>
                </ChartCard>

                <ChartCard title="Appointment Status" subtitle="Distribution of appointment outcomes">
                  <div className="flex items-center justify-center">
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={appointmentStats}
                          cx="50%"
                          cy="50%"
                          innerRadius={70}
                          outerRadius={110}
                          paddingAngle={3}
                          dataKey="value"
                        >
                          {appointmentStats.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    {appointmentStats.map((stat, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                        <span className="w-4 h-4 rounded-full" style={{ backgroundColor: stat.color }}></span>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{stat.name}</p>
                          <p className="text-xs text-gray-500">
                            {stat.value.toLocaleString()} ({stat.percentage}%)
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ChartCard>
              </div>

              {/* Department Performance */}
              <ChartCard title="Department Performance" subtitle="Revenue and patient metrics by department">
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={departmentData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis type="number" stroke="#9ca3af" fontSize={12} />
                    <YAxis dataKey="name" type="category" stroke="#9ca3af" fontSize={12} width={100} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Bar dataKey="patients" fill="#8b5cf6" name="Patients" radius={[0, 4, 4, 0]} />
                    <Bar dataKey="appointments" fill="#14b8a6" name="Appointments" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>

              {/* Weekly Trends & Hourly Distribution */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ChartCard title="Weekly Trends" subtitle="Appointments and revenue by day">
                  <ResponsiveContainer width="100%" height={280}>
                    <AreaChart data={weeklyTrends}>
                      <defs>
                        <linearGradient id="appointmentGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="newPatientGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="day" stroke="#9ca3af" fontSize={12} />
                      <YAxis stroke="#9ca3af" fontSize={12} />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <Area
                        type="monotone"
                        dataKey="appointments"
                        stroke="#3b82f6"
                        fill="url(#appointmentGrad)"
                        strokeWidth={2}
                        name="Appointments"
                      />
                      <Area
                        type="monotone"
                        dataKey="newPatients"
                        stroke="#10b981"
                        fill="url(#newPatientGrad)"
                        strokeWidth={2}
                        name="New Patients"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </ChartCard>

                <ChartCard title="Hourly Distribution" subtitle="Appointment volume throughout the day">
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={hourlyData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="hour" stroke="#9ca3af" fontSize={11} />
                      <YAxis stroke="#9ca3af" fontSize={12} />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <Bar dataKey="appointments" fill="#8b5cf6" name="Scheduled" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="walkins" fill="#f59e0b" name="Walk-ins" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartCard>
              </div>
            </motion.div>
          )}

          {activeTab === "revenue" && (
            <motion.div
              key="revenue"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Revenue by Service */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ChartCard title="Revenue by Service Type" subtitle="Breakdown of revenue sources">
                  <ResponsiveContainer width="100%" height={320}>
                    <PieChart>
                      <Pie
                        data={serviceRevenueData}
                        cx="50%"
                        cy="50%"
                        outerRadius={120}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        labelLine={false}
                      >
                        {serviceRevenueData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartCard>

                <ChartCard title="Monthly Revenue Breakdown" subtitle="Revenue, expenses, and profit trends">
                  <ResponsiveContainer width="100%" height={320}>
                    <AreaChart data={revenueData}>
                      <defs>
                        <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="expGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="month" stroke="#9ca3af" fontSize={12} />
                      <YAxis stroke="#9ca3af" fontSize={12} tickFormatter={(v) => `$${v / 1000}k`} />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <Area
                        type="monotone"
                        dataKey="revenue"
                        stroke="#10b981"
                        fill="url(#revGrad)"
                        strokeWidth={2}
                        name="Revenue"
                      />
                      <Area
                        type="monotone"
                        dataKey="expenses"
                        stroke="#ef4444"
                        fill="url(#expGrad)"
                        strokeWidth={2}
                        name="Expenses"
                      />
                      <Line type="monotone" dataKey="profit" stroke="#8b5cf6" strokeWidth={3} name="Profit" dot />
                    </AreaChart>
                  </ResponsiveContainer>
                </ChartCard>
              </div>

              {/* Revenue Summary Table */}
              <ChartCard title="Monthly Revenue Summary" subtitle="Detailed breakdown by month">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Month</th>
                        <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">Revenue</th>
                        <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">Expenses</th>
                        <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">Profit</th>
                        <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">Target</th>
                        <th className="text-center py-3 px-4 text-sm font-semibold text-gray-600">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {revenueData.map((row, index) => (
                        <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4 font-medium text-gray-900">{row.month}</td>
                          <td className="text-right py-3 px-4 text-gray-700">${row.revenue.toLocaleString()}</td>
                          <td className="text-right py-3 px-4 text-red-600">${row.expenses.toLocaleString()}</td>
                          <td className="text-right py-3 px-4 text-green-600 font-medium">
                            ${row.profit.toLocaleString()}
                          </td>
                          <td className="text-right py-3 px-4 text-gray-500">${row.target.toLocaleString()}</td>
                          <td className="text-center py-3 px-4">
                            {row.revenue >= row.target ? (
                              <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                                <FaCheckCircle className="text-xs" />
                                Met
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">
                                <FaExclamationTriangle className="text-xs" />
                                Below
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </ChartCard>
            </motion.div>
          )}

          {activeTab === "appointments" && (
            <motion.div
              key="appointments"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Appointment by Time */}
                <ChartCard title="Peak Hours Analysis" subtitle="Busiest times throughout the day">
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={hourlyData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="hour" stroke="#9ca3af" fontSize={11} />
                      <YAxis stroke="#9ca3af" fontSize={12} />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="appointments" fill="#8b5cf6" name="Appointments" radius={[4, 4, 0, 0]}>
                        {hourlyData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={entry.appointments > 60 ? "#ef4444" : entry.appointments > 40 ? "#f59e0b" : "#10b981"}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                  <div className="flex items-center justify-center gap-6 mt-4">
                    <span className="flex items-center gap-2 text-sm">
                      <span className="w-3 h-3 rounded bg-green-500"></span>
                      Low (&lt;40)
                    </span>
                    <span className="flex items-center gap-2 text-sm">
                      <span className="w-3 h-3 rounded bg-amber-500"></span>
                      Medium (40-60)
                    </span>
                    <span className="flex items-center gap-2 text-sm">
                      <span className="w-3 h-3 rounded bg-red-500"></span>
                      High (&gt;60)
                    </span>
                  </div>
                </ChartCard>

                {/* Appointment Types */}
                <ChartCard title="Appointment Types" subtitle="By consultation category">
                  <ResponsiveContainer width="100%" height={300}>
                    <RadialBarChart
                      cx="50%"
                      cy="50%"
                      innerRadius="30%"
                      outerRadius="90%"
                      data={appointmentStats}
                      startAngle={180}
                      endAngle={0}
                    >
                      <RadialBar minAngle={15} background clockWise dataKey="value" cornerRadius={10}>
                        {appointmentStats.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </RadialBar>
                      <Tooltip />
                    </RadialBarChart>
                  </ResponsiveContainer>
                  <div className="grid grid-cols-2 gap-3 mt-4">
                    {appointmentStats.map((stat, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                        <span className="w-4 h-4 rounded-full" style={{ backgroundColor: stat.color }}></span>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{stat.name}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500">{stat.value.toLocaleString()}</span>
                            <span className="text-xs font-semibold" style={{ color: stat.color }}>
                              {stat.percentage}%
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ChartCard>
              </div>

              {/* Department Appointments */}
              <ChartCard title="Appointments by Department" subtitle="Distribution across medical departments">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={departmentData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="name" stroke="#9ca3af" fontSize={11} />
                    <YAxis stroke="#9ca3af" fontSize={12} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Bar dataKey="appointments" fill="#8b5cf6" name="Appointments" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="patients" fill="#14b8a6" name="Unique Patients" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>
            </motion.div>
          )}

          {activeTab === "patients" && (
            <motion.div
              key="patients"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Demographics */}
                <ChartCard title="Patient Demographics" subtitle="Age and gender distribution">
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={demographicsData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="age" stroke="#9ca3af" fontSize={12} />
                      <YAxis stroke="#9ca3af" fontSize={12} />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <Bar dataKey="male" fill="#3b82f6" name="Male" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="female" fill="#ec4899" name="Female" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartCard>

                {/* Geographic Distribution */}
                <ChartCard title="Geographic Distribution" subtitle="Patients by region">
                  <div className="space-y-4">
                    {geographicData.map((region, index) => (
                      <div key={index} className="flex items-center gap-4">
                        <div className="w-20 text-sm font-medium text-gray-700">{region.region}</div>
                        <div className="flex-1">
                          <div className="h-8 bg-gray-100 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${region.percentage}%` }}
                              transition={{ delay: index * 0.1, duration: 0.8 }}
                              className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-end pr-3"
                            >
                              <span className="text-white text-xs font-semibold">{region.percentage}%</span>
                            </motion.div>
                          </div>
                        </div>
                        <div className="w-20 text-right text-sm text-gray-500">
                          {region.patients.toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </ChartCard>
              </div>

              {/* Patient Acquisition Funnel */}
              <ChartCard title="Patient Acquisition Funnel" subtitle="Conversion from website visit to completed appointment">
                <div className="flex items-center justify-center">
                  <ResponsiveContainer width="100%" height={350}>
                    <FunnelChart>
                      <Tooltip />
                      <Funnel dataKey="value" data={funnelData} isAnimationActive>
                        <LabelList position="center" fill="#fff" stroke="none" dataKey="name" fontSize={12} />
                      </Funnel>
                    </FunnelChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-5 gap-2 mt-4">
                  {funnelData.map((item, index) => (
                    <div key={index} className="text-center">
                      <p className="text-lg font-bold text-gray-900">{item.value.toLocaleString()}</p>
                      <p className="text-xs text-gray-500">{item.name}</p>
                      {index < funnelData.length - 1 && (
                        <p className="text-xs text-green-600 mt-1">
                          {((funnelData[index + 1].value / item.value) * 100).toFixed(1)}% conversion
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </ChartCard>
            </motion.div>
          )}

          {activeTab === "doctors" && (
            <motion.div
              key="doctors"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Top Doctors */}
              <ChartCard title="Doctor Performance Ranking" subtitle="Based on patients, ratings, and revenue">
                <div className="space-y-4">
                  {doctorPerformance.map((doctor, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition"
                    >
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold ${
                          index === 0
                            ? "bg-gradient-to-br from-yellow-400 to-amber-500"
                            : index === 1
                            ? "bg-gradient-to-br from-gray-300 to-gray-400"
                            : index === 2
                            ? "bg-gradient-to-br from-amber-600 to-orange-700"
                            : "bg-gradient-to-br from-purple-500 to-pink-500"
                        }`}
                      >
                        #{index + 1}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{doctor.name}</h4>
                        <p className="text-sm text-gray-500">{doctor.specialty}</p>
                      </div>
                      <div className="text-center px-4">
                        <p className="text-lg font-bold text-purple-600">{doctor.patients}</p>
                        <p className="text-xs text-gray-500">Patients</p>
                      </div>
                      <div className="text-center px-4">
                        <p className="text-lg font-bold text-amber-500 flex items-center gap-1">
                          <FaStar className="text-sm" />
                          {doctor.rating}
                        </p>
                        <p className="text-xs text-gray-500">Rating</p>
                      </div>
                      <div className="text-center px-4">
                        <p className="text-lg font-bold text-green-600">${(doctor.revenue / 1000).toFixed(0)}k</p>
                        <p className="text-xs text-gray-500">Revenue</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </ChartCard>

              {/* Department Comparison */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ChartCard title="Revenue by Department" subtitle="Total revenue generated per department">
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={departmentData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis type="number" stroke="#9ca3af" fontSize={12} tickFormatter={(v) => `$${v / 1000}k`} />
                      <YAxis dataKey="name" type="category" stroke="#9ca3af" fontSize={11} width={90} />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="revenue" fill="#10b981" name="Revenue" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartCard>

                <ChartCard title="Department Ratings" subtitle="Average patient satisfaction ratings">
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={departmentData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="name" stroke="#9ca3af" fontSize={10} angle={-45} textAnchor="end" height={80} />
                      <YAxis stroke="#9ca3af" fontSize={12} domain={[4, 5]} />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="rating" fill="#f59e0b" name="Rating" radius={[4, 4, 0, 0]}>
                        {departmentData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.rating >= 4.8 ? "#10b981" : "#f59e0b"} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </ChartCard>
              </div>
            </motion.div>
          )}

          {activeTab === "diagnostics" && (
            <motion.div
              key="diagnostics"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Diagnostics Overview */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {diagnosticsData.map((diag, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 hover:shadow-lg transition"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <FaFlask className="text-purple-500" />
                      <span
                        className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                          diag.growth > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                        }`}
                      >
                        {diag.growth > 0 ? "+" : ""}
                        {diag.growth}%
                      </span>
                    </div>
                    <h4 className="text-2xl font-bold text-gray-900">{diag.count.toLocaleString()}</h4>
                    <p className="text-sm text-gray-500">{diag.name}</p>
                    <p className="text-xs text-gray-400 mt-1">Avg: {diag.avgTime}</p>
                  </motion.div>
                ))}
              </div>

              {/* Diagnostics Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ChartCard title="Test Volume Comparison" subtitle="Number of tests by category">
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={diagnosticsData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="name" stroke="#9ca3af" fontSize={11} />
                      <YAxis stroke="#9ca3af" fontSize={12} />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="count" fill="#8b5cf6" name="Tests" radius={[4, 4, 0, 0]}>
                        {diagnosticsData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={["#8b5cf6", "#14b8a6", "#3b82f6", "#f59e0b", "#ec4899", "#10b981"][index]}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </ChartCard>

                <ChartCard title="Growth Rate by Test Type" subtitle="Month-over-month growth percentage">
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={diagnosticsData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis type="number" stroke="#9ca3af" fontSize={12} />
                      <YAxis dataKey="name" type="category" stroke="#9ca3af" fontSize={11} width={90} />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="growth" name="Growth %" radius={[0, 4, 4, 0]}>
                        {diagnosticsData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.growth > 0 ? "#10b981" : "#ef4444"} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </ChartCard>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Export Modal */}
        <AnimatePresence>
          {showExportModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setShowExportModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900">Export Report</h3>
                  <button
                    onClick={() => setShowExportModal(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition"
                  >
                    <FaTimes className="text-gray-500" />
                  </button>
                </div>

                <div className="space-y-3">
                  <button className="w-full flex items-center gap-4 p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition">
                    <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                      <FaFilePdf className="text-red-500 text-xl" />
                    </div>
                    <div className="text-left">
                      <h4 className="font-semibold text-gray-900">Export as PDF</h4>
                      <p className="text-sm text-gray-500">Download printable report</p>
                    </div>
                  </button>

                  <button className="w-full flex items-center gap-4 p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition">
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                      <FaFileExcel className="text-green-500 text-xl" />
                    </div>
                    <div className="text-left">
                      <h4 className="font-semibold text-gray-900">Export as Excel</h4>
                      <p className="text-sm text-gray-500">Download spreadsheet data</p>
                    </div>
                  </button>

                  <button className="w-full flex items-center gap-4 p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition">
                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                      <FaPrint className="text-purple-500 text-xl" />
                    </div>
                    <div className="text-left">
                      <h4 className="font-semibold text-gray-900">Print Report</h4>
                      <p className="text-sm text-gray-500">Send to printer</p>
                    </div>
                  </button>

                  <button className="w-full flex items-center gap-4 p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                      <FaShare className="text-blue-500 text-xl" />
                    </div>
                    <div className="text-left">
                      <h4 className="font-semibold text-gray-900">Share Report</h4>
                      <p className="text-sm text-gray-500">Send via email</p>
                    </div>
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AdminReports;
