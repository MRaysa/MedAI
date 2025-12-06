import { useState, useEffect, useContext } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router";
import { AuthContext } from "../../contexts/AuthContext";
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
} from "react-icons/fa";
import { MdLocalHospital, MdSchedule, MdVerified, MdPending } from "react-icons/md";
import { DOCTOR_VERIFICATION_STATUS } from "../../contexts/AuthProvider";

const DoctorDashboard = () => {
  const { dbUser, userProfile } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalPatients: 0,
    todayAppointments: 0,
    pendingAppointments: 0,
    completedToday: 0,
    monthlyEarnings: 0,
    rating: 0,
  });
  const [todaySchedule, setTodaySchedule] = useState([]);
  const [recentPatients, setRecentPatients] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);

  const isVerified = userProfile?.verificationStatus === DOCTOR_VERIFICATION_STATUS.APPROVED;

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
        });

        setTodaySchedule([
          {
            id: 1,
            patient: "John Smith",
            time: "09:00 AM",
            type: "video",
            reason: "Follow-up consultation",
            status: "completed",
          },
          {
            id: 2,
            patient: "Emily Davis",
            time: "10:30 AM",
            type: "in-person",
            reason: "Annual checkup",
            status: "completed",
          },
          {
            id: 3,
            patient: "Michael Brown",
            time: "11:30 AM",
            type: "video",
            reason: "Prescription renewal",
            status: "in-progress",
          },
          {
            id: 4,
            patient: "Sarah Wilson",
            time: "02:00 PM",
            type: "in-person",
            reason: "New patient consultation",
            status: "upcoming",
          },
          {
            id: 5,
            patient: "James Lee",
            time: "03:30 PM",
            type: "video",
            reason: "Lab results review",
            status: "upcoming",
          },
        ]);

        setRecentPatients([
          { id: 1, name: "John Smith", lastVisit: "Today", condition: "Hypertension", avatar: null },
          { id: 2, name: "Emily Davis", lastVisit: "Today", condition: "Diabetes", avatar: null },
          { id: 3, name: "Robert Chen", lastVisit: "Yesterday", condition: "General Checkup", avatar: null },
          { id: 4, name: "Lisa Johnson", lastVisit: "Dec 3", condition: "Anxiety", avatar: null },
        ]);

        setPendingRequests([
          { id: 1, patient: "New Patient A", type: "New Appointment", time: "Dec 10, 2:00 PM" },
          { id: 2, patient: "New Patient B", type: "Consultation Request", time: "Dec 11, 10:00 AM" },
        ]);

        setLoading(false);
      }, 500);
    };

    loadDashboardData();
  }, []);

  const statCards = [
    {
      title: "Today's Appointments",
      value: stats.todayAppointments,
      icon: FaCalendarCheck,
      color: "text-teal-500",
      bgColor: "bg-teal-50",
      subtext: `${stats.completedToday} completed`,
    },
    {
      title: "Total Patients",
      value: stats.totalPatients,
      icon: FaUserInjured,
      color: "text-blue-500",
      bgColor: "bg-blue-50",
      subtext: "+12 this month",
    },
    {
      title: "Pending Requests",
      value: stats.pendingAppointments,
      icon: MdPending,
      color: "text-amber-500",
      bgColor: "bg-amber-50",
      subtext: "Needs attention",
    },
    {
      title: "Monthly Earnings",
      value: `$${stats.monthlyEarnings.toLocaleString()}`,
      icon: FaMoneyBillWave,
      color: "text-emerald-500",
      bgColor: "bg-emerald-50",
      subtext: "+18% from last month",
    },
  ];

  const quickActions = [
    { title: "View Schedule", icon: MdSchedule, path: "/doctor/schedule", color: "bg-teal-500" },
    { title: "Patient Records", icon: FaNotesMedical, path: "/doctor/patients", color: "bg-blue-500" },
    { title: "Write Prescription", icon: FaClipboardList, path: "/doctor/prescriptions", color: "bg-purple-500" },
    { title: "Messages", icon: FaComments, path: "/doctor/messages", color: "bg-amber-500" },
  ];

  const getStatusBadge = (status) => {
    switch (status) {
      case "completed":
        return (
          <span className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
            <FaCheckCircle /> Completed
          </span>
        );
      case "in-progress":
        return (
          <span className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
            <FaClock /> In Progress
          </span>
        );
      case "upcoming":
        return (
          <span className="flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
            <FaClock /> Upcoming
          </span>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // Show verification pending message if not verified
  if (!isVerified) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-3xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center"
          >
            <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <MdPending className="text-4xl text-amber-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Verification Pending</h1>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              Your doctor profile is currently under review. Once approved by our admin team,
              you'll have full access to the doctor dashboard and can start accepting patients.
            </p>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
              <p className="text-sm text-amber-800">
                <strong>Current Status:</strong> {userProfile?.verificationStatus || "Pending Review"}
              </p>
              <p className="text-xs text-amber-600 mt-1">
                This usually takes 1-2 business days
              </p>
            </div>
            <Link
              to="/doctor/complete-profile"
              className="inline-flex items-center gap-2 px-6 py-3 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition font-medium"
            >
              Complete Your Profile <FaArrowRight />
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold text-gray-900">
                  Good morning, Dr. {dbUser?.lastName || "Doctor"}!
                </h1>
                <span className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                  <MdVerified /> Verified
                </span>
              </div>
              <p className="mt-1 text-gray-500">
                You have {stats.todayAppointments} appointments scheduled for today.
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex items-center gap-3">
              <div className="flex items-center gap-1 px-3 py-2 bg-amber-50 rounded-xl">
                <FaStar className="text-amber-500" />
                <span className="font-semibold text-gray-900">{stats.rating}</span>
                <span className="text-gray-500 text-sm">rating</span>
              </div>
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
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`text-xl ${stat.color}`} />
                </div>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-500 mt-1">{stat.title}</p>
                <p className="text-xs text-teal-600 mt-1">{stat.subtext}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Today's Schedule */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Today's Schedule</h2>
              <Link
                to="/doctor/schedule"
                className="text-sm text-teal-600 hover:text-teal-700 font-medium"
              >
                View full schedule
              </Link>
            </div>
            <div className="space-y-3">
              {todaySchedule.map((apt) => (
                <div
                  key={apt.id}
                  className={`flex items-center justify-between p-4 rounded-xl transition ${
                    apt.status === "in-progress"
                      ? "bg-blue-50 border border-blue-200"
                      : apt.status === "completed"
                      ? "bg-gray-50"
                      : "bg-gray-50 hover:bg-gray-100"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="text-center min-w-[60px]">
                      <p className="text-sm font-semibold text-gray-900">{apt.time}</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center">
                      <FaUserInjured className="text-teal-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{apt.patient}</p>
                      <p className="text-sm text-gray-500">{apt.reason}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {apt.type === "video" ? (
                      <span className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                        <FaVideo />
                      </span>
                    ) : (
                      <span className="p-2 bg-green-100 text-green-600 rounded-lg">
                        <MdLocalHospital />
                      </span>
                    )}
                    {getStatusBadge(apt.status)}
                  </div>
                </div>
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
                <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">
                  {pendingRequests.length} new
                </span>
              </div>
              <div className="space-y-3">
                {pendingRequests.map((req) => (
                  <div
                    key={req.id}
                    className="p-3 bg-amber-50 rounded-xl border border-amber-100"
                  >
                    <p className="font-medium text-gray-900 text-sm">{req.patient}</p>
                    <p className="text-xs text-gray-500">{req.type}</p>
                    <p className="text-xs text-amber-600 mt-1">{req.time}</p>
                    <div className="flex gap-2 mt-2">
                      <button className="flex-1 px-3 py-1 bg-teal-600 text-white rounded-lg text-xs font-medium hover:bg-teal-700 transition">
                        Accept
                      </button>
                      <button className="flex-1 px-3 py-1 bg-gray-200 text-gray-700 rounded-lg text-xs font-medium hover:bg-gray-300 transition">
                        Decline
                      </button>
                    </div>
                  </div>
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
                <Link to="/doctor/patients" className="text-sm text-teal-600 hover:text-teal-700">
                  View all
                </Link>
              </div>
              <div className="space-y-3">
                {recentPatients.map((patient) => (
                  <div
                    key={patient.id}
                    className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition cursor-pointer"
                  >
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                      <FaUserInjured className="text-gray-500" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 text-sm">{patient.name}</p>
                      <p className="text-xs text-gray-500">{patient.condition}</p>
                    </div>
                    <span className="text-xs text-gray-400">{patient.lastVisit}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
