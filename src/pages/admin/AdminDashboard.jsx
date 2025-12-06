import { useState, useEffect, useContext } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router";
import { AuthContext } from "../../contexts/AuthContext";
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
} from "react-icons/fa";
import { MdVerified, MdPending, MdHealthAndSafety } from "react-icons/md";

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

  useEffect(() => {
    // Simulate loading dashboard data
    const loadDashboardData = async () => {
      setLoading(true);
      // In production, fetch from API
      // const data = await apiCall('/admin/dashboard-stats');

      // Simulated data for now
      setTimeout(() => {
        setStats({
          totalUsers: 1250,
          totalDoctors: 48,
          totalPatients: 1180,
          pendingVerifications: 5,
          todayAppointments: 34,
          monthlyRevenue: 45600,
        });

        setRecentActivities([
          { id: 1, type: "user_registered", message: "New patient registered", user: "John Smith", time: "2 mins ago" },
          { id: 2, type: "doctor_verified", message: "Doctor verification approved", user: "Dr. Sarah Wilson", time: "15 mins ago" },
          { id: 3, type: "appointment", message: "Appointment completed", user: "Emily Davis", time: "1 hour ago" },
          { id: 4, type: "payment", message: "Payment received", amount: "$150", time: "2 hours ago" },
          { id: 5, type: "user_registered", message: "New doctor registered", user: "Dr. Michael Brown", time: "3 hours ago" },
        ]);

        setPendingDoctors([
          { id: 1, name: "Dr. James Lee", specialty: "Cardiology", appliedDate: "2024-12-05" },
          { id: 2, name: "Dr. Maria Garcia", specialty: "Pediatrics", appliedDate: "2024-12-04" },
          { id: 3, name: "Dr. Robert Chen", specialty: "Orthopedics", appliedDate: "2024-12-03" },
        ]);

        setLoading(false);
      }, 500);
    };

    loadDashboardData();
  }, []);

  const statCards = [
    {
      title: "Total Users",
      value: stats.totalUsers.toLocaleString(),
      icon: FaUsers,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-500",
      change: "+12%",
      changeType: "positive",
    },
    {
      title: "Doctors",
      value: stats.totalDoctors,
      icon: FaUserMd,
      color: "from-teal-500 to-teal-600",
      bgColor: "bg-teal-50",
      iconColor: "text-teal-500",
      change: "+5",
      changeType: "positive",
    },
    {
      title: "Patients",
      value: stats.totalPatients.toLocaleString(),
      icon: FaUserInjured,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      iconColor: "text-purple-500",
      change: "+8%",
      changeType: "positive",
    },
    {
      title: "Pending Verifications",
      value: stats.pendingVerifications,
      icon: MdPending,
      color: "from-amber-500 to-amber-600",
      bgColor: "bg-amber-50",
      iconColor: "text-amber-500",
      change: "Action needed",
      changeType: "warning",
    },
    {
      title: "Today's Appointments",
      value: stats.todayAppointments,
      icon: FaCalendarCheck,
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
      iconColor: "text-green-500",
      change: "+15%",
      changeType: "positive",
    },
    {
      title: "Monthly Revenue",
      value: `$${stats.monthlyRevenue.toLocaleString()}`,
      icon: FaMoneyBillWave,
      color: "from-emerald-500 to-emerald-600",
      bgColor: "bg-emerald-50",
      iconColor: "text-emerald-500",
      change: "+22%",
      changeType: "positive",
    },
  ];

  const quickActions = [
    { title: "Manage Users", icon: FaUsers, path: "/admin/users", color: "bg-blue-500" },
    { title: "Verify Doctors", icon: MdVerified, path: "/admin/verify-doctors", color: "bg-teal-500" },
    { title: "View Reports", icon: FaChartLine, path: "/admin/reports", color: "bg-purple-500" },
    { title: "System Settings", icon: FaCog, path: "/admin/settings", color: "bg-gray-500" },
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
      default:
        return <FaBell className="text-gray-500" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row md:items-center md:justify-between"
          >
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="mt-1 text-gray-500">
                Welcome back, {dbUser?.firstName || "Admin"}! Here's what's happening today.
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex items-center gap-3">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-700">
                <FaShieldAlt className="mr-2" />
                Administrator
              </span>
            </div>
          </motion.div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                  <stat.icon className={`text-2xl ${stat.iconColor}`} />
                </div>
                <span
                  className={`text-sm font-medium px-2 py-1 rounded-full ${
                    stat.changeType === "positive"
                      ? "bg-green-100 text-green-700"
                      : stat.changeType === "warning"
                      ? "bg-amber-100 text-amber-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {stat.change}
                </span>
              </div>
              <div className="mt-4">
                <h3 className="text-3xl font-bold text-gray-900">{stat.value}</h3>
                <p className="text-sm text-gray-500 mt-1">{stat.title}</p>
              </div>
            </motion.div>
          ))}
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
            {quickActions.map((action) => (
              <Link
                key={action.title}
                to={action.path}
                className="bg-white rounded-xl p-4 border border-gray-100 hover:shadow-md transition-all hover:-translate-y-1 flex flex-col items-center text-center gap-3"
              >
                <div className={`p-3 rounded-xl ${action.color} text-white`}>
                  <action.icon className="text-xl" />
                </div>
                <span className="text-sm font-medium text-gray-700">{action.title}</span>
              </Link>
            ))}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Pending Doctor Verifications */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Pending Verifications</h2>
              <Link
                to="/admin/verify-doctors"
                className="text-sm text-purple-600 hover:text-purple-700 font-medium"
              >
                View all
              </Link>
            </div>
            <div className="space-y-4">
              {pendingDoctors.length > 0 ? (
                pendingDoctors.map((doctor) => (
                  <div
                    key={doctor.id}
                    className="flex items-center justify-between p-4 bg-amber-50 rounded-xl border border-amber-100"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                        <FaUserMd className="text-amber-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{doctor.name}</p>
                        <p className="text-sm text-gray-500">{doctor.specialty}</p>
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
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <MdVerified className="text-4xl mx-auto mb-2 text-green-500" />
                  <p>All verifications completed!</p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
              <Link
                to="/admin/activity-log"
                className="text-sm text-purple-600 hover:text-purple-700 font-medium"
              >
                View all
              </Link>
            </div>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-xl transition"
                >
                  <div className="p-2 bg-gray-100 rounded-lg">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">{activity.message}</p>
                    <p className="text-xs text-gray-500">
                      {activity.user || activity.amount} • {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* System Health */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-4">System Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { name: "API Server", status: "Operational", color: "green" },
              { name: "Database", status: "Operational", color: "green" },
              { name: "File Storage", status: "Operational", color: "green" },
              { name: "Email Service", status: "Operational", color: "green" },
            ].map((service) => (
              <div
                key={service.name}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
              >
                <span className="text-sm font-medium text-gray-700">{service.name}</span>
                <span className="flex items-center gap-1 text-sm text-green-600">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  {service.status}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;
