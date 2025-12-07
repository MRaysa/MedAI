import { useState, useEffect, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router";
import { AuthContext } from "../../contexts/AuthContext";
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  RadialBarChart,
  RadialBar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  FaUserInjured,
  FaCalendarCheck,
  FaCalendarAlt,
  FaClock,
  FaStar,
  FaMoneyBillWave,
  FaChartLine,
  FaStethoscope,
  FaClipboardList,
  FaVideo,
  FaPhoneAlt,
  FaNotesMedical,
  FaUserPlus,
  FaCheckCircle,
  FaTimesCircle,
  FaArrowRight,
  FaBell,
  FaComments,
  FaArrowUp,
  FaArrowDown,
  FaFlask,
  FaFileMedical,
  FaPills,
  FaHeartbeat,
  FaUsers,
  FaHospital,
  FaXRay,
  FaPlay,
  FaPause,
  FaEye,
} from "react-icons/fa";
import { MdLocalHospital, MdSchedule, MdVerified, MdPending, MdTrendingUp, MdOutlineAccessTime } from "react-icons/md";
import { HiSparkles, HiLightningBolt } from "react-icons/hi";
import { BiPulse, BiTime } from "react-icons/bi";
import { RiStethoscopeFill, RiUserHeartFill } from "react-icons/ri";
import { BsGraphUpArrow, BsClockHistory } from "react-icons/bs";
import { DOCTOR_VERIFICATION_STATUS } from "../../contexts/AuthProvider";

const DoctorDashboard = () => {
  const { dbUser, userProfile, apiCall } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [stats, setStats] = useState({
    totalPatients: 0,
    todayAppointments: 0,
    pendingAppointments: 0,
    completedToday: 0,
    monthlyEarnings: 0,
    rating: 0,
    totalConsultations: 0,
    newPatients: 0,
  });
  const [todaySchedule, setTodaySchedule] = useState([]);
  const [recentPatients, setRecentPatients] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);

  const isVerified = userProfile?.verificationStatus === DOCTOR_VERIFICATION_STATUS.APPROVED;

  // Weekly Appointments Data
  const weeklyAppointments = [
    { day: "Mon", appointments: 12, completed: 10, cancelled: 2 },
    { day: "Tue", appointments: 15, completed: 14, cancelled: 1 },
    { day: "Wed", appointments: 10, completed: 9, cancelled: 1 },
    { day: "Thu", appointments: 18, completed: 16, cancelled: 2 },
    { day: "Fri", appointments: 14, completed: 13, cancelled: 1 },
    { day: "Sat", appointments: 8, completed: 8, cancelled: 0 },
    { day: "Sun", appointments: 4, completed: 4, cancelled: 0 },
  ];

  // Monthly Earnings Data
  const monthlyEarningsData = [
    { month: "Jan", earnings: 8500, patients: 45 },
    { month: "Feb", earnings: 9200, patients: 52 },
    { month: "Mar", earnings: 10500, patients: 58 },
    { month: "Apr", earnings: 9800, patients: 55 },
    { month: "May", earnings: 11200, patients: 62 },
    { month: "Jun", earnings: 12500, patients: 68 },
  ];

  // Patient Demographics
  const patientDemographics = [
    { name: "0-18", value: 15, color: "#8b5cf6" },
    { name: "19-35", value: 30, color: "#3b82f6" },
    { name: "36-50", value: 28, color: "#14b8a6" },
    { name: "51-65", value: 18, color: "#f59e0b" },
    { name: "65+", value: 9, color: "#ef4444" },
  ];

  // Consultation Types
  const consultationTypes = [
    { name: "In-Person", value: 45, fill: "#14b8a6" },
    { name: "Video Call", value: 35, fill: "#3b82f6" },
    { name: "Phone", value: 12, fill: "#8b5cf6" },
    { name: "Follow-up", value: 8, fill: "#f59e0b" },
  ];

  // Hourly Distribution
  const hourlyDistribution = [
    { time: "9AM", patients: 3 },
    { time: "10AM", patients: 5 },
    { time: "11AM", patients: 4 },
    { time: "12PM", patients: 2 },
    { time: "2PM", patients: 6 },
    { time: "3PM", patients: 5 },
    { time: "4PM", patients: 4 },
    { time: "5PM", patients: 3 },
  ];

  // Patient Satisfaction Trend
  const satisfactionTrend = [
    { month: "Jan", rating: 4.5 },
    { month: "Feb", rating: 4.6 },
    { month: "Mar", rating: 4.7 },
    { month: "Apr", rating: 4.6 },
    { month: "May", rating: 4.8 },
    { month: "Jun", rating: 4.8 },
  ];

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true);

      setTimeout(() => {
        setStats({
          totalPatients: 156,
          todayAppointments: 8,
          pendingAppointments: 3,
          completedToday: 5,
          monthlyEarnings: 12500,
          rating: 4.8,
          totalConsultations: 1245,
          newPatients: 12,
        });

        setTodaySchedule([
          {
            id: 1,
            patient: "John Smith",
            time: "09:00 AM",
            type: "video",
            reason: "Follow-up consultation",
            status: "completed",
            avatar: "JS",
            condition: "Hypertension",
          },
          {
            id: 2,
            patient: "Emily Davis",
            time: "10:30 AM",
            type: "in-person",
            reason: "Annual checkup",
            status: "completed",
            avatar: "ED",
            condition: "Routine",
          },
          {
            id: 3,
            patient: "Michael Brown",
            time: "11:30 AM",
            type: "video",
            reason: "Prescription renewal",
            status: "in-progress",
            avatar: "MB",
            condition: "Diabetes",
          },
          {
            id: 4,
            patient: "Sarah Wilson",
            time: "02:00 PM",
            type: "in-person",
            reason: "New patient consultation",
            status: "upcoming",
            avatar: "SW",
            condition: "New Patient",
          },
          {
            id: 5,
            patient: "James Lee",
            time: "03:30 PM",
            type: "video",
            reason: "Lab results review",
            status: "upcoming",
            avatar: "JL",
            condition: "Follow-up",
          },
          {
            id: 6,
            patient: "Anna Martinez",
            time: "04:30 PM",
            type: "in-person",
            reason: "Post-surgery checkup",
            status: "upcoming",
            avatar: "AM",
            condition: "Post-Op",
          },
        ]);

        setRecentPatients([
          { id: 1, name: "John Smith", lastVisit: "Today", condition: "Hypertension", avatar: "JS", age: 45, visits: 8 },
          { id: 2, name: "Emily Davis", lastVisit: "Today", condition: "Diabetes", avatar: "ED", age: 38, visits: 12 },
          { id: 3, name: "Robert Chen", lastVisit: "Yesterday", condition: "General Checkup", avatar: "RC", age: 52, visits: 3 },
          { id: 4, name: "Lisa Johnson", lastVisit: "Dec 3", condition: "Anxiety", avatar: "LJ", age: 29, visits: 6 },
          { id: 5, name: "Mark Williams", lastVisit: "Dec 2", condition: "Back Pain", avatar: "MW", age: 41, visits: 4 },
        ]);

        setPendingRequests([
          { id: 1, patient: "New Patient A", type: "New Appointment", time: "Dec 10, 2:00 PM", urgency: "normal" },
          { id: 2, patient: "New Patient B", type: "Consultation Request", time: "Dec 11, 10:00 AM", urgency: "urgent" },
          { id: 3, patient: "Follow-up Request", type: "Lab Review", time: "Dec 12, 3:00 PM", urgency: "normal" },
        ]);

        setLoading(false);
      }, 800);
    };

    loadDashboardData();
  }, []);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/95 backdrop-blur-sm p-3 rounded-xl shadow-lg border border-gray-100">
          <p className="font-semibold text-gray-900 text-sm">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-xs" style={{ color: entry.color }}>
              {entry.name}: {typeof entry.value === "number" && entry.name.toLowerCase().includes("earning") ? `$${entry.value.toLocaleString()}` : entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const statCards = [
    {
      title: "Today's Appointments",
      value: stats.todayAppointments,
      icon: FaCalendarCheck,
      gradient: "from-teal-500 to-cyan-500",
      bgGlow: "bg-teal-500/20",
      subtext: `${stats.completedToday} completed`,
      change: "+2",
      changeType: "positive",
    },
    {
      title: "Total Patients",
      value: stats.totalPatients,
      icon: FaUserInjured,
      gradient: "from-blue-500 to-indigo-500",
      bgGlow: "bg-blue-500/20",
      subtext: `${stats.newPatients} new this month`,
      change: "+12",
      changeType: "positive",
    },
    {
      title: "Monthly Earnings",
      value: `$${stats.monthlyEarnings.toLocaleString()}`,
      icon: FaMoneyBillWave,
      gradient: "from-emerald-500 to-green-500",
      bgGlow: "bg-emerald-500/20",
      subtext: "Target: $15,000",
      change: "+18%",
      changeType: "positive",
    },
    {
      title: "Patient Rating",
      value: stats.rating,
      icon: FaStar,
      gradient: "from-amber-500 to-orange-500",
      bgGlow: "bg-amber-500/20",
      subtext: "Based on 142 reviews",
      change: "+0.2",
      changeType: "positive",
    },
  ];

  const quickActions = [
    { title: "View Schedule", icon: MdSchedule, path: "/doctor/schedule", gradient: "from-teal-500 to-cyan-500", description: "Manage appointments" },
    { title: "Patient Records", icon: FaNotesMedical, path: "/doctor/patients", gradient: "from-blue-500 to-indigo-500", description: "View all patients" },
    { title: "Lab Results", icon: FaFlask, path: "/diagnostics/lab-tests", gradient: "from-purple-500 to-pink-500", description: "Review diagnostics" },
    { title: "Imaging", icon: FaXRay, path: "/diagnostics/imaging", gradient: "from-amber-500 to-orange-500", description: "View scans" },
    { title: "Prescriptions", icon: FaPills, path: "/doctor/prescriptions", gradient: "from-rose-500 to-red-500", description: "Write prescriptions" },
    { title: "Messages", icon: FaComments, path: "/doctor/messages", gradient: "from-indigo-500 to-violet-500", description: "Patient messages" },
  ];

  const getStatusBadge = (status) => {
    switch (status) {
      case "completed":
        return (
          <span className="flex items-center gap-1 px-2.5 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
            <FaCheckCircle className="text-xs" /> Completed
          </span>
        );
      case "in-progress":
        return (
          <span className="flex items-center gap-1 px-2.5 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium animate-pulse">
            <FaPlay className="text-xs" /> In Progress
          </span>
        );
      case "upcoming":
        return (
          <span className="flex items-center gap-1 px-2.5 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
            <FaClock className="text-xs" /> Upcoming
          </span>
        );
      default:
        return null;
    }
  };

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-teal-500/30 border-t-teal-500 mx-auto"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <RiStethoscopeFill className="text-teal-500 text-xl animate-pulse" />
            </div>
          </div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // Show verification pending message if not verified
  if (!isVerified) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 py-8">
        <div className="max-w-3xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 text-center overflow-hidden relative"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-100 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl opacity-50" />
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-br from-amber-400 to-orange-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-amber-500/25">
                <MdPending className="text-5xl text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-3">Verification Pending</h1>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                Your doctor profile is currently under review. Once approved by our admin team,
                you'll have full access to the doctor dashboard and can start accepting patients.
              </p>
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-6 mb-6">
                <div className="flex items-center justify-center gap-3 mb-3">
                  <BsClockHistory className="text-amber-600 text-xl" />
                  <p className="text-lg font-semibold text-amber-800">
                    Status: {userProfile?.verificationStatus || "Pending Review"}
                  </p>
                </div>
                <div className="w-full bg-amber-200 rounded-full h-2 mb-2">
                  <div className="bg-gradient-to-r from-amber-500 to-orange-500 h-2 rounded-full w-1/3 animate-pulse"></div>
                </div>
                <p className="text-sm text-amber-600">
                  Estimated time: 1-2 business days
                </p>
              </div>
              <Link
                to="/doctor/profile"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-xl hover:from-teal-600 hover:to-cyan-600 transition font-medium shadow-lg shadow-teal-500/25"
              >
                Complete Your Profile <FaArrowRight />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Decorative Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-teal-200 rounded-full blur-3xl opacity-30" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-200 rounded-full blur-3xl opacity-30" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-200 rounded-full blur-3xl opacity-20" />
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
                <div className="w-16 h-16 bg-gradient-to-br from-teal-500 via-cyan-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-xl shadow-teal-500/25">
                  <RiStethoscopeFill className="text-white text-3xl" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-lg flex items-center justify-center">
                  <MdVerified className="text-white text-xs" />
                </div>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                  {getGreeting()}, Dr. {dbUser?.lastName || "Doctor"}!
                  <HiSparkles className="text-yellow-500" />
                </h1>
                <p className="text-gray-500 flex items-center gap-2">
                  <BsClockHistory className="text-teal-500" />
                  {currentTime.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
                  <span className="mx-1">•</span>
                  {stats.todayAppointments} appointments today
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl">
                <FaStar className="text-amber-500" />
                <span className="font-bold text-gray-900">{stats.rating}</span>
                <span className="text-gray-500 text-sm">rating</span>
              </div>
              
              <Link
                to="/doctor/schedule"
                className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-xl hover:from-teal-600 hover:to-cyan-600 transition shadow-lg shadow-teal-500/25 font-medium"
              >
                <MdSchedule /> View Schedule
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statCards.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-lg transition-all group relative overflow-hidden"
            >
              {/* Glow Effect */}
              <div className={`absolute -top-20 -right-20 w-40 h-40 ${stat.bgGlow} rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity`} />

              <div className="relative">
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-2.5 rounded-xl bg-gradient-to-br ${stat.gradient} shadow-lg`}>
                    <stat.icon className="text-xl text-white" />
                  </div>
                  <span className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
                    stat.changeType === "positive" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                  }`}>
                    {stat.changeType === "positive" ? <FaArrowUp className="text-xs" /> : <FaArrowDown className="text-xs" />}
                    {stat.change}
                  </span>
                </div>
                <h3 className="text-3xl font-bold text-gray-900">{stat.value}</h3>
                <p className="text-sm text-gray-500 mt-1">{stat.title}</p>
                <p className="text-xs text-teal-600 mt-1">{stat.subtext}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Weekly Appointments Chart */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Weekly Appointments</h3>
                <p className="text-sm text-gray-500">Completed vs Scheduled</p>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 bg-teal-500 rounded-full"></span>
                  Completed
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 bg-red-400 rounded-full"></span>
                  Cancelled
                </span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={weeklyAppointments}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="day" stroke="#9ca3af" fontSize={12} />
                <YAxis stroke="#9ca3af" fontSize={12} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="completed" fill="#14b8a6" name="Completed" radius={[4, 4, 0, 0]} />
                <Bar dataKey="cancelled" fill="#f87171" name="Cancelled" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Monthly Earnings Chart */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Earnings Overview</h3>
                <p className="text-sm text-gray-500">Monthly revenue trend</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-emerald-600">${stats.monthlyEarnings.toLocaleString()}</p>
                <p className="text-xs text-gray-500">This month</p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={monthlyEarningsData}>
                <defs>
                  <linearGradient id="earningsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#9ca3af" fontSize={12} />
                <YAxis stroke="#9ca3af" fontSize={12} tickFormatter={(v) => `$${v / 1000}k`} />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="earnings"
                  stroke="#10b981"
                  fill="url(#earningsGradient)"
                  strokeWidth={2}
                  name="Earnings"
                />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Second Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Patient Demographics Pie */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
          >
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Patient Demographics</h3>
              <p className="text-sm text-gray-500">Age distribution</p>
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie
                  data={patientDemographics}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={70}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {patientDemographics.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-3 gap-2 mt-2">
              {patientDemographics.slice(0, 3).map((item, index) => (
                <div key={index} className="text-center">
                  <span className="w-2 h-2 rounded-full inline-block mr-1" style={{ backgroundColor: item.color }}></span>
                  <span className="text-xs text-gray-600">{item.name}: {item.value}%</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Consultation Types */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
          >
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Consultation Types</h3>
              <p className="text-sm text-gray-500">This month</p>
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <RadialBarChart cx="50%" cy="50%" innerRadius="30%" outerRadius="90%" data={consultationTypes} startAngle={180} endAngle={0}>
                <RadialBar minAngle={15} background clockWise dataKey="value" cornerRadius={10} />
                <Tooltip />
              </RadialBarChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {consultationTypes.map((item, index) => (
                <div key={index} className="flex items-center gap-2 text-xs">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.fill }}></span>
                  <span className="text-gray-600">{item.name}: {item.value}%</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Hourly Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
          >
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Peak Hours</h3>
              <p className="text-sm text-gray-500">Patient visits by hour</p>
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={hourlyDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="time" stroke="#9ca3af" fontSize={10} />
                <YAxis stroke="#9ca3af" fontSize={10} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="patients" fill="#8b5cf6" name="Patients" radius={[4, 4, 0, 0]}>
                  {hourlyDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.patients > 4 ? "#8b5cf6" : "#c4b5fd"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {quickActions.map((action, index) => (
              <motion.div
                key={action.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link
                  to={action.path}
                  className="bg-white rounded-2xl p-5 border border-gray-100 hover:shadow-lg transition-all hover:-translate-y-1 flex flex-col items-center text-center gap-3 group h-full"
                >
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${action.gradient} text-white shadow-lg group-hover:scale-110 transition-transform`}>
                    <action.icon className="text-xl" />
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-900 block">{action.title}</span>
                    <span className="text-xs text-gray-500">{action.description}</span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Today's Schedule */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Today's Schedule</h2>
                <p className="text-sm text-gray-500">{todaySchedule.length} appointments</p>
              </div>
              <Link
                to="/doctor/schedule"
                className="text-sm text-teal-600 hover:text-teal-700 font-medium flex items-center gap-1"
              >
                View full schedule <FaArrowRight className="text-xs" />
              </Link>
            </div>
            <div className="space-y-3">
              {todaySchedule.map((apt, index) => (
                <motion.div
                  key={apt.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex items-center justify-between p-4 rounded-xl transition ${
                    apt.status === "in-progress"
                      ? "bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200"
                      : apt.status === "completed"
                      ? "bg-gray-50 opacity-70"
                      : "bg-gradient-to-r from-gray-50 to-white border border-gray-100 hover:border-teal-200"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="text-center min-w-[70px]">
                      <p className={`text-sm font-bold ${apt.status === "in-progress" ? "text-blue-600" : "text-gray-900"}`}>
                        {apt.time}
                      </p>
                      <p className="text-xs text-gray-500">{apt.status === "in-progress" ? "NOW" : ""}</p>
                    </div>
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-white ${
                      apt.status === "in-progress"
                        ? "bg-gradient-to-br from-blue-500 to-indigo-500"
                        : apt.status === "completed"
                        ? "bg-gray-400"
                        : "bg-gradient-to-br from-teal-500 to-cyan-500"
                    }`}>
                      {apt.avatar}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{apt.patient}</p>
                      <p className="text-sm text-gray-500">{apt.reason}</p>
                      <span className={`inline-block text-xs px-2 py-0.5 rounded-full mt-1 ${
                        apt.condition === "New Patient" ? "bg-purple-100 text-purple-700" : "bg-gray-100 text-gray-600"
                      }`}>
                        {apt.condition}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {apt.type === "video" ? (
                      <span className="p-2.5 bg-blue-100 text-blue-600 rounded-xl">
                        <FaVideo />
                      </span>
                    ) : (
                      <span className="p-2.5 bg-green-100 text-green-600 rounded-xl">
                        <MdLocalHospital />
                      </span>
                    )}
                    {getStatusBadge(apt.status)}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Pending Requests */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Pending Requests</h3>
                <span className="px-2.5 py-1 bg-gradient-to-r from-amber-100 to-orange-100 text-amber-700 rounded-full text-xs font-medium">
                  {pendingRequests.length} new
                </span>
              </div>
              <div className="space-y-3">
                {pendingRequests.map((req, index) => (
                  <motion.div
                    key={req.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`p-4 rounded-xl border ${
                      req.urgency === "urgent"
                        ? "bg-red-50 border-red-200"
                        : "bg-amber-50 border-amber-100"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium text-gray-900 text-sm">{req.patient}</p>
                      {req.urgency === "urgent" && (
                        <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                          Urgent
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500">{req.type}</p>
                    <p className="text-xs text-amber-600 mt-1 flex items-center gap-1">
                      <FaClock className="text-xs" /> {req.time}
                    </p>
                    <div className="flex gap-2 mt-3">
                      <button className="flex-1 px-3 py-2 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-lg text-xs font-medium hover:from-teal-600 hover:to-cyan-600 transition shadow-sm">
                        Accept
                      </button>
                      <button className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-xs font-medium hover:bg-gray-200 transition">
                        Decline
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Recent Patients */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Recent Patients</h3>
                <Link to="/doctor/patients" className="text-sm text-teal-600 hover:text-teal-700 flex items-center gap-1">
                  View all <FaArrowRight className="text-xs" />
                </Link>
              </div>
              <div className="space-y-3">
                {recentPatients.map((patient, index) => (
                  <motion.div
                    key={patient.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-xl transition cursor-pointer group"
                  >
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center text-white font-bold text-sm group-hover:scale-105 transition-transform">
                      {patient.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 text-sm truncate">{patient.name}</p>
                      <p className="text-xs text-gray-500">{patient.condition} • {patient.visits} visits</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-gray-400">{patient.lastVisit}</span>
                      <p className="text-xs text-gray-500">Age: {patient.age}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Rating Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-gradient-to-br from-amber-500 via-orange-500 to-red-500 rounded-2xl p-6 text-white"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <FaStar className="text-2xl" />
                </div>
                <div>
                  <p className="text-3xl font-bold">{stats.rating}</p>
                  <p className="text-white/80 text-sm">Patient Rating</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/80">5 stars</span>
                  <div className="flex-1 mx-3 h-2 bg-white/20 rounded-full overflow-hidden">
                    <div className="h-full bg-white rounded-full" style={{ width: "75%" }}></div>
                  </div>
                  <span>75%</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/80">4 stars</span>
                  <div className="flex-1 mx-3 h-2 bg-white/20 rounded-full overflow-hidden">
                    <div className="h-full bg-white rounded-full" style={{ width: "20%" }}></div>
                  </div>
                  <span>20%</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/80">3 stars</span>
                  <div className="flex-1 mx-3 h-2 bg-white/20 rounded-full overflow-hidden">
                    <div className="h-full bg-white rounded-full" style={{ width: "5%" }}></div>
                  </div>
                  <span>5%</span>
                </div>
              </div>
              <p className="text-sm text-white/70 mt-4">Based on 142 patient reviews</p>
            </motion.div>
          </div>
        </div>

        {/* Performance Summary Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-8 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl p-6 text-white"
        >
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                <BsGraphUpArrow /> Monthly Performance Summary
              </h3>
              <p className="text-white/80">You're doing great! Your consultation rate increased by 18% this month.</p>
              <div className="flex items-center gap-6 mt-4">
                <div>
                  <p className="text-2xl font-bold">{stats.totalConsultations}</p>
                  <p className="text-sm text-white/70">Total Consultations</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.newPatients}</p>
                  <p className="text-sm text-white/70">New Patients</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">98%</p>
                  <p className="text-sm text-white/70">Satisfaction Rate</p>
                </div>
              </div>
            </div>
            <Link
              to="/doctor/analytics"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white/20 rounded-xl hover:bg-white/30 transition font-medium whitespace-nowrap"
            >
              <FaChartLine /> View Full Analytics
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
