import { useState, useEffect, useContext } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router";
import { AuthContext } from "../../contexts/AuthContext";
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
} from "react-icons/fa";
import { MdHealthAndSafety, MdLocalHospital, MdSchedule } from "react-icons/md";
import { BsDropletFill } from "react-icons/bs";

const PatientDashboard = () => {
  const { dbUser, userProfile } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [healthMetrics, setHealthMetrics] = useState({
    heartRate: 72,
    bloodPressure: "120/80",
    bloodOxygen: 98,
    temperature: 98.6,
    weight: 165,
    bloodSugar: 95,
  });
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [medications, setMedications] = useState([]);
  const [recentRecords, setRecentRecords] = useState([]);

  useEffect(() => {
    // Simulate loading dashboard data
    const loadDashboardData = async () => {
      setLoading(true);

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
          },
          {
            id: 2,
            doctor: "Dr. Michael Chen",
            specialty: "General Physician",
            date: "Dec 15, 2024",
            time: "2:30 PM",
            type: "video",
            avatar: null,
          },
        ]);

        setMedications([
          { id: 1, name: "Metformin", dosage: "500mg", frequency: "Twice daily", nextDose: "8:00 PM" },
          { id: 2, name: "Lisinopril", dosage: "10mg", frequency: "Once daily", nextDose: "Tomorrow 8:00 AM" },
          { id: 3, name: "Vitamin D3", dosage: "1000 IU", frequency: "Once daily", nextDose: "Tomorrow 8:00 AM" },
        ]);

        setRecentRecords([
          { id: 1, type: "Lab Results", title: "Blood Work Panel", date: "Dec 1, 2024", status: "completed" },
          { id: 2, type: "Imaging", title: "Chest X-Ray", date: "Nov 28, 2024", status: "completed" },
          { id: 3, type: "Prescription", title: "Medication Renewal", date: "Nov 25, 2024", status: "completed" },
        ]);

        setLoading(false);
      }, 500);
    };

    loadDashboardData();
  }, []);

  const healthCards = [
    {
      title: "Heart Rate",
      value: healthMetrics.heartRate,
      unit: "BPM",
      icon: FaHeartbeat,
      color: "text-red-500",
      bgColor: "bg-red-50",
      status: "Normal",
      statusColor: "text-green-600",
    },
    {
      title: "Blood Pressure",
      value: healthMetrics.bloodPressure,
      unit: "mmHg",
      icon: FaChartLine,
      color: "text-blue-500",
      bgColor: "bg-blue-50",
      status: "Normal",
      statusColor: "text-green-600",
    },
    {
      title: "Blood Oxygen",
      value: healthMetrics.bloodOxygen,
      unit: "%",
      icon: FaLungs,
      color: "text-cyan-500",
      bgColor: "bg-cyan-50",
      status: "Excellent",
      statusColor: "text-green-600",
    },
    {
      title: "Blood Sugar",
      value: healthMetrics.bloodSugar,
      unit: "mg/dL",
      icon: BsDropletFill,
      color: "text-purple-500",
      bgColor: "bg-purple-50",
      status: "Optimal",
      statusColor: "text-green-600",
    },
  ];

  const quickActions = [
    { title: "Book Appointment", icon: FaCalendarAlt, path: "/appointments/book", color: "bg-teal-500" },
    { title: "Find Doctors", icon: FaUserMd, path: "/doctors", color: "bg-blue-500" },
    { title: "AI Symptom Check", icon: MdHealthAndSafety, path: "/ai/symptom-checker", color: "bg-purple-500" },
    { title: "Medical Records", icon: FaFileMedical, path: "/patient/documents", color: "bg-amber-500" },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your health dashboard...</p>
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
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome back, {dbUser?.firstName || "Patient"}!
              </h1>
              <p className="mt-1 text-gray-500">
                Here's an overview of your health status and upcoming appointments.
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <Link
                to="/appointments/book"
                className="inline-flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition font-medium"
              >
                <FaPlus /> Book Appointment
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Health Score Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-teal-500 to-cyan-500 rounded-2xl p-6 mb-8 text-white"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <MdHealthAndSafety className="text-3xl" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">AI Health Score: 92/100</h2>
                <p className="text-teal-100">Your health indicators are looking great!</p>
              </div>
            </div>
            <Link
              to="/ai/predictions"
              className="mt-4 md:mt-0 inline-flex items-center gap-2 px-4 py-2 bg-white/20 rounded-xl hover:bg-white/30 transition"
            >
              View Health Insights <FaArrowRight />
            </Link>
          </div>
        </motion.div>

        {/* Health Metrics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {healthCards.map((metric, index) => (
            <motion.div
              key={metric.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2 rounded-lg ${metric.bgColor}`}>
                  <metric.icon className={`text-xl ${metric.color}`} />
                </div>
                <span className={`text-xs font-medium ${metric.statusColor}`}>{metric.status}</span>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {metric.value}
                  <span className="text-sm font-normal text-gray-500 ml-1">{metric.unit}</span>
                </p>
                <p className="text-sm text-gray-500 mt-1">{metric.title}</p>
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upcoming Appointments */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Upcoming Appointments</h2>
              <Link
                to="/appointments"
                className="text-sm text-teal-600 hover:text-teal-700 font-medium"
              >
                View all
              </Link>
            </div>
            <div className="space-y-4">
              {upcomingAppointments.length > 0 ? (
                upcomingAppointments.map((apt) => (
                  <div
                    key={apt.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center">
                        <FaUserMd className="text-teal-600 text-xl" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{apt.doctor}</p>
                        <p className="text-sm text-gray-500">{apt.specialty}</p>
                        <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                          <FaCalendarAlt />
                          <span>{apt.date}</span>
                          <span>•</span>
                          <FaClock />
                          <span>{apt.time}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {apt.type === "video" ? (
                        <span className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                          <FaVideo /> Video
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                          <MdLocalHospital /> In-person
                        </span>
                      )}
                    </div>
                  </div>
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
              <h2 className="text-xl font-semibold text-gray-900">Medications</h2>
              <Link
                to="/patient/medications"
                className="text-sm text-teal-600 hover:text-teal-700 font-medium"
              >
                View all
              </Link>
            </div>
            <div className="space-y-4">
              {medications.map((med) => (
                <div
                  key={med.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                      <FaPills className="text-purple-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{med.name}</p>
                      <p className="text-sm text-gray-500">{med.dosage} • {med.frequency}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">Next dose</p>
                    <p className="text-sm font-medium text-teal-600">{med.nextDose}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Recent Medical Records */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Recent Medical Records</h2>
            <Link
              to="/patient/documents"
              className="text-sm text-teal-600 hover:text-teal-700 font-medium"
            >
              View all records
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recentRecords.map((record) => (
              <div
                key={record.id}
                className="p-4 border border-gray-200 rounded-xl hover:border-teal-300 hover:bg-teal-50/30 transition cursor-pointer"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-teal-100 rounded-lg">
                    <FaFileMedical className="text-teal-600" />
                  </div>
                  <span className="text-xs font-medium text-teal-600 bg-teal-50 px-2 py-1 rounded-full">
                    {record.type}
                  </span>
                </div>
                <p className="font-medium text-gray-900">{record.title}</p>
                <p className="text-sm text-gray-500 mt-1">{record.date}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PatientDashboard;
