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
} from "recharts";
import {
  FaHeartbeat,
  FaCalendarAlt,
  FaUserMd,
  FaPills,
  FaFileMedical,
  FaChartLine,
  FaBell,
  FaClock,
  FaMapMarkerAlt,
  FaPhone,
  FaVideo,
  FaNotesMedical,
  FaWeight,
  FaTint,
  FaThermometerHalf,
  FaLungs,
  FaArrowRight,
  FaPlus,
  FaArrowUp,
  FaArrowDown,
  FaCheckCircle,
  FaExclamationTriangle,
  FaFlask,
  FaXRay,
  FaRunning,
  FaAppleAlt,
  FaBed,
  FaWater,
  FaStar,
  FaStethoscope,
  FaShieldAlt,
  FaHistory,
} from "react-icons/fa";
import { MdHealthAndSafety, MdLocalHospital, MdSchedule, MdTrendingUp, MdTrendingDown, MdOutlineWaterDrop } from "react-icons/md";
import { BsDropletFill, BsLightningChargeFill, BsActivity } from "react-icons/bs";
import { HiSparkles, HiLightningBolt } from "react-icons/hi";
import { BiPulse } from "react-icons/bi";
import { RiMentalHealthLine, RiHeartPulseFill } from "react-icons/ri";
import { GiMeditation, GiNightSleep } from "react-icons/gi";

const PatientDashboard = () => {
  const { dbUser, userProfile, apiCall } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [activeMetricTab, setActiveMetricTab] = useState("week");
  const [healthScore, setHealthScore] = useState(92);
  const [healthMetrics, setHealthMetrics] = useState({
    heartRate: 72,
    bloodPressure: { systolic: 120, diastolic: 80 },
    bloodOxygen: 98,
    temperature: 98.6,
    weight: 165,
    bloodSugar: 95,
    steps: 8547,
    calories: 1850,
    sleep: 7.5,
    water: 6,
  });
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [medications, setMedications] = useState([]);
  const [recentRecords, setRecentRecords] = useState([]);
  const [notifications, setNotifications] = useState([]);

  // Heart Rate Trend Data
  const heartRateTrend = [
    { time: "6AM", value: 62, min: 58, max: 68 },
    { time: "9AM", value: 75, min: 70, max: 82 },
    { time: "12PM", value: 82, min: 78, max: 88 },
    { time: "3PM", value: 78, min: 72, max: 85 },
    { time: "6PM", value: 85, min: 80, max: 92 },
    { time: "9PM", value: 70, min: 65, max: 76 },
    { time: "12AM", value: 58, min: 54, max: 64 },
  ];

  // Weekly Health Data
  const weeklyHealthData = [
    { day: "Mon", heartRate: 72, steps: 8500, sleep: 7.2, calories: 1850 },
    { day: "Tue", heartRate: 75, steps: 10200, sleep: 6.8, calories: 2100 },
    { day: "Wed", heartRate: 70, steps: 7800, sleep: 7.5, calories: 1750 },
    { day: "Thu", heartRate: 73, steps: 9100, sleep: 8.0, calories: 1920 },
    { day: "Fri", heartRate: 76, steps: 11500, sleep: 6.5, calories: 2200 },
    { day: "Sat", heartRate: 68, steps: 6200, sleep: 8.5, calories: 1650 },
    { day: "Sun", heartRate: 65, steps: 5500, sleep: 9.0, calories: 1580 },
  ];

  // Blood Pressure History
  const bpHistory = [
    { date: "Dec 1", systolic: 118, diastolic: 78 },
    { date: "Dec 2", systolic: 122, diastolic: 82 },
    { date: "Dec 3", systolic: 120, diastolic: 80 },
    { date: "Dec 4", systolic: 125, diastolic: 85 },
    { date: "Dec 5", systolic: 119, diastolic: 79 },
    { date: "Dec 6", systolic: 121, diastolic: 81 },
    { date: "Dec 7", systolic: 120, diastolic: 80 },
  ];

  // Health Score Breakdown
  const healthScoreBreakdown = [
    { name: "Vitals", value: 95, fill: "#10b981" },
    { name: "Activity", value: 88, fill: "#3b82f6" },
    { name: "Sleep", value: 92, fill: "#8b5cf6" },
    { name: "Nutrition", value: 85, fill: "#f59e0b" },
    { name: "Mental", value: 90, fill: "#ec4899" },
  ];

  // Activity Distribution
  const activityData = [
    { name: "Walking", value: 45, color: "#10b981" },
    { name: "Running", value: 20, color: "#3b82f6" },
    { name: "Cycling", value: 15, color: "#8b5cf6" },
    { name: "Swimming", value: 10, color: "#14b8a6" },
    { name: "Other", value: 10, color: "#6b7280" },
  ];

  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true);

      // Try to fetch real data from API
      try {
        const [profileResponse] = await Promise.all([
          apiCall("/patients/me/profile"),
        ]);

        if (profileResponse?.success && profileResponse?.data?.vitals) {
          const vitals = profileResponse.data.vitals;
          setHealthMetrics(prev => ({
            ...prev,
            heartRate: vitals.heartRate?.value || prev.heartRate,
            bloodPressure: vitals.bloodPressure || prev.bloodPressure,
            bloodOxygen: vitals.oxygenSaturation?.value || prev.bloodOxygen,
            temperature: vitals.temperature?.value || prev.temperature,
            weight: vitals.weight?.value || prev.weight,
            bloodSugar: vitals.bloodGlucose?.value || prev.bloodSugar,
          }));
        }
      } catch (error) {
        console.log("Using default health metrics");
      }

      setTimeout(() => {
        setUpcomingAppointments([
          {
            id: 1,
            doctor: "Dr. Sarah Wilson",
            specialty: "Cardiologist",
            date: "Dec 10, 2024",
            time: "10:00 AM",
            type: "in-person",
            avatar: null,
            hospital: "City Medical Center",
          },
          {
            id: 2,
            doctor: "Dr. Michael Chen",
            specialty: "General Physician",
            date: "Dec 15, 2024",
            time: "2:30 PM",
            type: "video",
            avatar: null,
            hospital: "Virtual Clinic",
          },
          {
            id: 3,
            doctor: "Dr. Emily Davis",
            specialty: "Dermatologist",
            date: "Dec 20, 2024",
            time: "11:00 AM",
            type: "in-person",
            avatar: null,
            hospital: "Skin Care Clinic",
          },
        ]);

        setMedications([
          { id: 1, name: "Metformin", dosage: "500mg", frequency: "Twice daily", nextDose: "8:00 PM", taken: true, remaining: 24 },
          { id: 2, name: "Lisinopril", dosage: "10mg", frequency: "Once daily", nextDose: "Tomorrow 8:00 AM", taken: false, remaining: 18 },
          { id: 3, name: "Vitamin D3", dosage: "1000 IU", frequency: "Once daily", nextDose: "Tomorrow 8:00 AM", taken: false, remaining: 30 },
        ]);

        setRecentRecords([
          { id: 1, type: "Lab Results", title: "Blood Work Panel", date: "Dec 1, 2024", status: "completed", icon: FaFlask },
          { id: 2, type: "Imaging", title: "Chest X-Ray", date: "Nov 28, 2024", status: "completed", icon: FaXRay },
          { id: 3, type: "Prescription", title: "Medication Renewal", date: "Nov 25, 2024", status: "completed", icon: FaPills },
          { id: 4, type: "Consultation", title: "Follow-up Visit", date: "Nov 20, 2024", status: "completed", icon: FaStethoscope },
        ]);

        setNotifications([
          { id: 1, type: "reminder", message: "Take your evening medication", time: "30 min ago" },
          { id: 2, type: "appointment", message: "Upcoming appointment with Dr. Wilson", time: "2 hours ago" },
          { id: 3, type: "result", message: "New lab results available", time: "1 day ago" },
        ]);

        setLoading(false);
      }, 800);
    };

    loadDashboardData();
  }, [apiCall]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/95 backdrop-blur-sm p-3 rounded-xl shadow-lg border border-gray-100">
          <p className="font-semibold text-gray-900 text-sm">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-xs" style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const vitalCards = [
    {
      title: "Heart Rate",
      value: healthMetrics.heartRate,
      unit: "BPM",
      icon: RiHeartPulseFill,
      gradient: "from-red-500 to-rose-600",
      bgGlow: "bg-red-500/20",
      status: healthMetrics.heartRate >= 60 && healthMetrics.heartRate <= 100 ? "Normal" : "Check",
      trend: "+2",
      trendUp: true,
    },
    {
      title: "Blood Pressure",
      value: `${healthMetrics.bloodPressure.systolic}/${healthMetrics.bloodPressure.diastolic}`,
      unit: "mmHg",
      icon: BiPulse,
      gradient: "from-blue-500 to-indigo-600",
      bgGlow: "bg-blue-500/20",
      status: "Normal",
      trend: "-3",
      trendUp: false,
    },
    {
      title: "Blood Oxygen",
      value: healthMetrics.bloodOxygen,
      unit: "%",
      icon: FaLungs,
      gradient: "from-cyan-500 to-teal-600",
      bgGlow: "bg-cyan-500/20",
      status: healthMetrics.bloodOxygen >= 95 ? "Excellent" : "Low",
      trend: "+1",
      trendUp: true,
    },
    {
      title: "Blood Sugar",
      value: healthMetrics.bloodSugar,
      unit: "mg/dL",
      icon: BsDropletFill,
      gradient: "from-purple-500 to-violet-600",
      bgGlow: "bg-purple-500/20",
      status: healthMetrics.bloodSugar >= 70 && healthMetrics.bloodSugar <= 100 ? "Optimal" : "Monitor",
      trend: "-5",
      trendUp: false,
    },
  ];

  const dailyGoals = [
    { name: "Steps", current: healthMetrics.steps, goal: 10000, icon: FaRunning, color: "#10b981", unit: "steps" },
    { name: "Calories", current: healthMetrics.calories, goal: 2000, icon: BsLightningChargeFill, color: "#f59e0b", unit: "kcal" },
    { name: "Sleep", current: healthMetrics.sleep, goal: 8, icon: GiNightSleep, color: "#8b5cf6", unit: "hrs" },
    { name: "Water", current: healthMetrics.water, goal: 8, icon: MdOutlineWaterDrop, color: "#3b82f6", unit: "glasses" },
  ];

  const quickActions = [
    { title: "Book Appointment", icon: FaCalendarAlt, path: "/appointments/book", gradient: "from-teal-500 to-cyan-500", description: "Schedule a visit" },
    { title: "Find Doctors", icon: FaUserMd, path: "/doctors", gradient: "from-blue-500 to-indigo-500", description: "Search specialists" },
    { title: "AI Symptom Check", icon: MdHealthAndSafety, path: "/ai/symptom-checker", gradient: "from-purple-500 to-pink-500", description: "Check symptoms" },
    { title: "Health Metrics", icon: FaChartLine, path: "/patient/metrics", gradient: "from-emerald-500 to-green-500", description: "Track vitals" },
    { title: "Lab Results", icon: FaFlask, path: "/diagnostics/results", gradient: "from-amber-500 to-orange-500", description: "View reports" },
    { title: "Prescriptions", icon: FaPills, path: "/billing", gradient: "from-rose-500 to-red-500", description: "Manage meds" },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-teal-500/30 border-t-teal-500 mx-auto"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <FaHeartbeat className="text-teal-500 text-xl animate-pulse" />
            </div>
          </div>
          <p className="mt-4 text-gray-600">Loading your health dashboard...</p>
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
                  <MdHealthAndSafety className="text-white text-3xl" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-lg flex items-center justify-center">
                  <FaCheckCircle className="text-white text-xs" />
                </div>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                  Welcome, {dbUser?.firstName || "Patient"}!
                  <HiSparkles className="text-yellow-500" />
                </h1>
                <p className="text-gray-500">Your personalized health dashboard</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              
              <Link
                to="/appointments/book"
                className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-xl hover:from-teal-600 hover:to-cyan-600 transition shadow-lg shadow-teal-500/25 font-medium"
              >
                <FaPlus /> Book Appointment
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Health Score Banner with Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-teal-500 via-cyan-500 to-blue-500 rounded-3xl p-6 mb-8 text-white overflow-hidden relative"
        >
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />

          <div className="relative grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
            {/* Health Score */}
            <div className="flex items-center gap-6">
              <div className="relative">
                <svg className="w-32 h-32 transform -rotate-90">
                  <circle cx="64" cy="64" r="56" stroke="rgba(255,255,255,0.2)" strokeWidth="12" fill="none" />
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="white"
                    strokeWidth="12"
                    fill="none"
                    strokeDasharray={`${(healthScore / 100) * 352} 352`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-bold">{healthScore}</span>
                  <span className="text-sm text-white/80">Health Score</span>
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-1">Excellent Health!</h2>
                <p className="text-white/80 text-sm">Your health indicators are above average</p>
                <div className="flex items-center gap-2 mt-2">
                  <MdTrendingUp className="text-green-300" />
                  <span className="text-sm">+5 from last week</span>
                </div>
              </div>
            </div>

            {/* Health Score Breakdown */}
            <div className="lg:col-span-2">
              <h3 className="text-sm font-medium text-white/80 mb-3">Health Score Breakdown</h3>
              <div className="grid grid-cols-5 gap-3">
                {healthScoreBreakdown.map((item, index) => (
                  <div key={index} className="text-center">
                    <div className="relative h-20 w-full bg-white/10 rounded-lg overflow-hidden">
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${item.value}%` }}
                        transition={{ delay: index * 0.1, duration: 0.8 }}
                        className="absolute bottom-0 w-full rounded-t-lg"
                        style={{ backgroundColor: item.fill }}
                      />
                    </div>
                    <p className="text-xs mt-2 font-medium">{item.name}</p>
                    <p className="text-xs text-white/70">{item.value}%</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="relative mt-6 flex flex-wrap gap-3">
            <Link
              to="/ai/predictions"
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 rounded-xl hover:bg-white/30 transition text-sm font-medium"
            >
              <HiSparkles /> AI Health Insights
            </Link>
            <Link
              to="/patient/metrics"
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 rounded-xl hover:bg-white/30 transition text-sm font-medium"
            >
              <FaChartLine /> View Detailed Metrics
            </Link>
          </div>
        </motion.div>

        {/* Vital Signs Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {vitalCards.map((vital, index) => (
            <motion.div
              key={vital.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-lg transition-all group relative overflow-hidden"
            >
              {/* Glow Effect */}
              <div className={`absolute -top-20 -right-20 w-40 h-40 ${vital.bgGlow} rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity`} />

              <div className="relative">
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-2.5 rounded-xl bg-gradient-to-br ${vital.gradient} shadow-lg`}>
                    <vital.icon className="text-xl text-white" />
                  </div>
                  <div className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
                    vital.status === "Normal" || vital.status === "Excellent" || vital.status === "Optimal"
                      ? "bg-green-100 text-green-700"
                      : "bg-amber-100 text-amber-700"
                  }`}>
                    {vital.status === "Normal" || vital.status === "Excellent" || vital.status === "Optimal" ? (
                      <FaCheckCircle className="text-xs" />
                    ) : (
                      <FaExclamationTriangle className="text-xs" />
                    )}
                    {vital.status}
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-gray-900">
                  {vital.value}
                  <span className="text-sm font-normal text-gray-500 ml-1">{vital.unit}</span>
                </h3>
                <div className="flex items-center justify-between mt-2">
                  <p className="text-sm text-gray-500">{vital.title}</p>
                  <span className={`flex items-center gap-1 text-xs font-medium ${vital.trendUp ? "text-green-600" : "text-blue-600"}`}>
                    {vital.trendUp ? <FaArrowUp className="text-xs" /> : <FaArrowDown className="text-xs" />}
                    {vital.trend}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Daily Goals Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Today's Goals</h2>
              <p className="text-sm text-gray-500">Track your daily health targets</p>
            </div>
            <Link to="/patient/metrics" className="text-sm text-teal-600 hover:text-teal-700 font-medium flex items-center gap-1">
              View Details <FaArrowRight className="text-xs" />
            </Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {dailyGoals.map((goal, index) => {
              const percentage = Math.min((goal.current / goal.goal) * 100, 100);
              return (
                <motion.div
                  key={goal.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="relative w-24 h-24 mx-auto mb-3">
                    <svg className="w-24 h-24 transform -rotate-90">
                      <circle cx="48" cy="48" r="40" stroke="#f3f4f6" strokeWidth="8" fill="none" />
                      <motion.circle
                        cx="48"
                        cy="48"
                        r="40"
                        stroke={goal.color}
                        strokeWidth="8"
                        fill="none"
                        strokeDasharray={`${(percentage / 100) * 251.2} 251.2`}
                        strokeLinecap="round"
                        initial={{ strokeDasharray: "0 251.2" }}
                        animate={{ strokeDasharray: `${(percentage / 100) * 251.2} 251.2` }}
                        transition={{ duration: 1, delay: index * 0.1 }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <goal.icon className="text-2xl mb-1" style={{ color: goal.color }} />
                      <span className="text-xs font-semibold text-gray-700">{Math.round(percentage)}%</span>
                    </div>
                  </div>
                  <h4 className="font-medium text-gray-900">{goal.name}</h4>
                  <p className="text-sm text-gray-500">
                    {goal.current.toLocaleString()} / {goal.goal.toLocaleString()} {goal.unit}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Heart Rate Trend */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Heart Rate Trend</h3>
                <p className="text-sm text-gray-500">Today's heart rate throughout the day</p>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 bg-red-500 rounded-full"></span>
                  Current
                </span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={heartRateTrend}>
                <defs>
                  <linearGradient id="heartGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="time" stroke="#9ca3af" fontSize={11} />
                <YAxis stroke="#9ca3af" fontSize={11} domain={[50, 100]} />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#ef4444"
                  fill="url(#heartGradient)"
                  strokeWidth={2}
                  name="Heart Rate"
                />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Blood Pressure History */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Blood Pressure</h3>
                <p className="text-sm text-gray-500">7-day history</p>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
                  Systolic
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 bg-indigo-400 rounded-full"></span>
                  Diastolic
                </span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={bpHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" stroke="#9ca3af" fontSize={11} />
                <YAxis stroke="#9ca3af" fontSize={11} domain={[60, 140]} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="systolic" stroke="#3b82f6" strokeWidth={2} dot={{ fill: "#3b82f6" }} name="Systolic" />
                <Line type="monotone" dataKey="diastolic" stroke="#818cf8" strokeWidth={2} dot={{ fill: "#818cf8" }} name="Diastolic" />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Weekly Activity Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Weekly Activity</h3>
              <p className="text-sm text-gray-500">Steps and calories burned this week</p>
            </div>
            <div className="flex items-center gap-2">
              {["week", "month"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveMetricTab(tab)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                    activeMetricTab === tab
                      ? "bg-teal-100 text-teal-700"
                      : "text-gray-500 hover:bg-gray-100"
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={weeklyHealthData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="day" stroke="#9ca3af" fontSize={12} />
              <YAxis yAxisId="left" stroke="#9ca3af" fontSize={12} />
              <YAxis yAxisId="right" orientation="right" stroke="#9ca3af" fontSize={12} />
              <Tooltip content={<CustomTooltip />} />
              <Bar yAxisId="left" dataKey="steps" fill="#14b8a6" name="Steps" radius={[4, 4, 0, 0]} />
              <Bar yAxisId="right" dataKey="calories" fill="#f59e0b" name="Calories" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Upcoming Appointments */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Upcoming Appointments</h2>
                <p className="text-sm text-gray-500">Your scheduled visits</p>
              </div>
              <Link
                to="/patient/appointments"
                className="text-sm text-teal-600 hover:text-teal-700 font-medium flex items-center gap-1"
              >
                View all <FaArrowRight className="text-xs" />
              </Link>
            </div>
            <div className="space-y-3">
              {upcomingAppointments.length > 0 ? (
                upcomingAppointments.map((apt, index) => (
                  <motion.div
                    key={apt.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-100 hover:border-teal-200 hover:shadow-sm transition"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        apt.type === "video"
                          ? "bg-gradient-to-br from-blue-500 to-indigo-500"
                          : "bg-gradient-to-br from-teal-500 to-cyan-500"
                      }`}>
                        {apt.type === "video" ? (
                          <FaVideo className="text-white text-lg" />
                        ) : (
                          <FaUserMd className="text-white text-lg" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{apt.doctor}</p>
                        <p className="text-sm text-gray-500">{apt.specialty}</p>
                        <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <FaCalendarAlt className="text-teal-500" />
                            {apt.date}
                          </span>
                          <span className="flex items-center gap-1">
                            <FaClock className="text-teal-500" />
                            {apt.time}
                          </span>
                        </div>
                      </div>
                    </div>
                    <span className={`px-3 py-1.5 rounded-full text-xs font-medium ${
                      apt.type === "video"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-green-100 text-green-700"
                    }`}>
                      {apt.type === "video" ? "Video Call" : "In-Person"}
                    </span>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <FaCalendarAlt className="text-4xl mx-auto mb-2 text-gray-300" />
                  <p>No upcoming appointments</p>
                  <Link to="/appointments/book" className="text-teal-600 hover:text-teal-700 text-sm mt-2 inline-block">
                    Book one now
                  </Link>
                </div>
              )}
            </div>
          </motion.div>

          {/* Medications */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Medications</h2>
                <p className="text-sm text-gray-500">Your active prescriptions</p>
              </div>
              <Link
                to="/billing"
                className="text-sm text-teal-600 hover:text-teal-700 font-medium flex items-center gap-1"
              >
                View all <FaArrowRight className="text-xs" />
              </Link>
            </div>
            <div className="space-y-3">
              {medications.map((med, index) => (
                <motion.div
                  key={med.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-100"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      med.taken ? "bg-green-100" : "bg-amber-100"
                    }`}>
                      <FaPills className={med.taken ? "text-green-600" : "text-amber-600"} />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{med.name}</p>
                      <p className="text-sm text-gray-500">{med.dosage} • {med.frequency}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">Next dose</p>
                    <p className="text-sm font-medium text-teal-600">{med.nextDose}</p>
                    <p className="text-xs text-gray-400 mt-1">{med.remaining} pills left</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Recent Medical Records */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Recent Medical Records</h2>
              <p className="text-sm text-gray-500">Your latest health documents</p>
            </div>
            <Link
              to="/diagnostics/results"
              className="text-sm text-teal-600 hover:text-teal-700 font-medium flex items-center gap-1"
            >
              View all records <FaArrowRight className="text-xs" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {recentRecords.map((record, index) => (
              <motion.div
                key={record.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 border border-gray-200 rounded-xl hover:border-teal-300 hover:bg-teal-50/30 transition cursor-pointer group"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2.5 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-xl group-hover:scale-110 transition-transform">
                    <record.icon className="text-white" />
                  </div>
                  <span className="text-xs font-medium text-teal-600 bg-teal-50 px-2 py-1 rounded-full">
                    {record.type}
                  </span>
                </div>
                <p className="font-medium text-gray-900">{record.title}</p>
                <div className="flex items-center justify-between mt-2">
                  <p className="text-sm text-gray-500">{record.date}</p>
                  <span className="flex items-center gap-1 text-xs text-green-600">
                    <FaCheckCircle className="text-xs" />
                    {record.status}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Activity Distribution Mini */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8 bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 rounded-2xl p-6 text-white"
        >
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <h3 className="text-xl font-bold mb-2">Stay Active, Stay Healthy!</h3>
              <p className="text-white/80">You've been 15% more active this week compared to last week. Keep it up!</p>
              <div className="flex items-center gap-4 mt-4">
                {activityData.slice(0, 4).map((activity, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: activity.color }}></span>
                    <span className="text-sm">{activity.name}: {activity.value}%</span>
                  </div>
                ))}
              </div>
            </div>
            <Link
              to="/patient/metrics"
              className="inline-flex items-center gap-2 px-5 py-3 bg-white/20 rounded-xl hover:bg-white/30 transition font-medium whitespace-nowrap"
            >
              <FaChartLine /> View Activity Report
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PatientDashboard;
