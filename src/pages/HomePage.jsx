import React, { useContext } from "react";
import { Link } from "react-router";
import { motion } from "framer-motion";
import { AuthContext } from "../contexts/AuthContext";
import {
  FaUserMd,
  FaCalendarAlt,
  FaFileMedical,
  FaHeartbeat,
  FaCreditCard,
  FaBrain,
  FaComments,
  FaStethoscope,
  FaNotesMedical,
  FaShieldAlt,
  FaChartLine,
  FaHospital,
  FaAmbulance,
  FaClock,
  FaCheckCircle,
  FaStar,
  FaQuoteLeft,
  FaArrowRight,
  FaPlay,
  FaMobileAlt,
  FaLock,
  FaUsers,
  FaAward,
  FaPhoneAlt,
} from "react-icons/fa";
import {
  MdHealthAndSafety,
  MdOutlineWatchLater,
  MdVerified,
  MdNotifications,
} from "react-icons/md";
import { BiTestTube } from "react-icons/bi";
import { RiRobot2Fill } from "react-icons/ri";

const HomePage = () => {
  const { user, dbUser } = useContext(AuthContext);

  // Get dashboard path based on user role
  const getDashboardPath = () => {
    switch (dbUser?.role) {
      case "admin":
        return "/admin/dashboard";
      case "doctor":
        return "/doctor/dashboard";
      case "patient":
      default:
        return "/patient/dashboard";
    }
  };

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  // Features data based on 8 modules
  const features = [
    {
      icon: FaNotesMedical,
      title: "Patient Health Records",
      description:
        "Comprehensive EHR with demographics, medical history, allergies, medications, and insurance details all in one place.",
      color: "from-blue-500 to-blue-600",
      link: "/patient/profile",
    },
    {
      icon: MdHealthAndSafety,
      title: "IoT Wearable Integration",
      description:
        "Connect smartwatches, fitness bands, and health monitors for real-time vital sign tracking and analysis.",
      color: "from-green-500 to-green-600",
      link: "/patient/devices",
    },
    {
      icon: FaBrain,
      title: "AI-Powered Diagnostics",
      description:
        "Advanced symptom checker and disease prediction using machine learning for early detection and prevention.",
      color: "from-purple-500 to-purple-600",
      link: "/ai/symptom-checker",
    },
    {
      icon: FaUserMd,
      title: "Doctor Management",
      description:
        "Find verified doctors by specialty, view ratings, and get AI-powered recommendations based on your symptoms.",
      color: "from-teal-500 to-teal-600",
      link: "/doctors",
    },
    {
      icon: FaCalendarAlt,
      title: "Smart Appointments",
      description:
        "Book appointments online, receive automated reminders, and enjoy teleconsultation via video, audio, or chat.",
      color: "from-orange-500 to-orange-600",
      link: "/appointments/book",
    },
    {
      icon: BiTestTube,
      title: "Diagnostic Reports",
      description:
        "Order lab tests, access results digitally, and get AI-assisted image analysis for accurate diagnostics.",
      color: "from-red-500 to-red-600",
      link: "/diagnostics/results",
    },
    {
      icon: FaCreditCard,
      title: "Billing & Insurance",
      description:
        "Transparent billing, multiple payment options, insurance claims management, and fraud detection.",
      color: "from-indigo-500 to-indigo-600",
      link: "/billing",
    },
    {
      icon: RiRobot2Fill,
      title: "AI Health Assistant",
      description:
        "24/7 chatbot support, personalized wellness tips, treatment recommendations, and health alerts.",
      color: "from-pink-500 to-pink-600",
      link: "/ai/wellness",
    },
  ];

  // Statistics
  const stats = [
    { value: "50,000+", label: "Patients Served", icon: FaUsers },
    { value: "1,200+", label: "Verified Doctors", icon: FaUserMd },
    { value: "98%", label: "Patient Satisfaction", icon: FaStar },
    { value: "24/7", label: "AI Support Available", icon: FaClock },
  ];

  // How it works steps
  const howItWorks = [
    {
      step: "01",
      title: "Create Your Profile",
      description: "Sign up and complete your health profile with medical history and preferences.",
      icon: FaNotesMedical,
    },
    {
      step: "02",
      title: "Connect Devices",
      description: "Link your wearable devices for continuous health monitoring and insights.",
      icon: MdHealthAndSafety,
    },
    {
      step: "03",
      title: "Get AI Insights",
      description: "Receive personalized health predictions, alerts, and wellness recommendations.",
      icon: FaBrain,
    },
    {
      step: "04",
      title: "Consult Doctors",
      description: "Book appointments or start teleconsultations with verified specialists.",
      icon: FaUserMd,
    },
  ];

  // Testimonials
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Diabetes Patient",
      image: "https://randomuser.me/api/portraits/women/44.jpg",
      text: "MedAI's glucose monitoring integration has been life-changing. The AI alerts helped me prevent multiple hypoglycemic episodes.",
      rating: 5,
    },
    {
      name: "Dr. Michael Chen",
      role: "Cardiologist",
      image: "https://randomuser.me/api/portraits/men/32.jpg",
      text: "The AI-powered diagnostic assistance helps me catch cardiac anomalies earlier. It's like having a brilliant colleague available 24/7.",
      rating: 5,
    },
    {
      name: "Emily Rodriguez",
      role: "Working Mother",
      image: "https://randomuser.me/api/portraits/women/68.jpg",
      text: "Teleconsultations and the symptom checker saved me countless trips to the clinic. Managing my family's health has never been easier.",
      rating: 5,
    },
  ];

  // Specializations
  const specializations = [
    { name: "Cardiology", icon: FaHeartbeat, doctors: 150 },
    { name: "Neurology", icon: FaBrain, doctors: 89 },
    { name: "Orthopedics", icon: FaStethoscope, doctors: 124 },
    { name: "Pediatrics", icon: FaUsers, doctors: 98 },
    { name: "Dermatology", icon: MdHealthAndSafety, doctors: 76 },
    { name: "Oncology", icon: FaHospital, doctors: 65 },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-teal-600 via-cyan-600 to-blue-700 text-white overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-72 h-72 bg-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/3 translate-y-1/3"></div>
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-white rounded-full"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Hero Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm mb-6">
                <RiRobot2Fill className="text-yellow-300" />
                <span>AI-Powered Healthcare Platform</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                Your Health,{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-300">
                  Reimagined
                </span>{" "}
                with AI
              </h1>

              <p className="text-lg md:text-xl text-teal-100 mb-8 leading-relaxed">
                Experience the future of healthcare with intelligent health monitoring,
                predictive diagnostics, and seamless doctor-patient connectivity. Your
                wellness journey starts here.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                {user ? (
                  <Link
                    to={getDashboardPath()}
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-teal-600 font-semibold rounded-xl hover:bg-teal-50 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    Go to Dashboard <FaArrowRight />
                  </Link>
                ) : (
                  <>
                    <Link
                      to="/signup"
                      className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-teal-600 font-semibold rounded-xl hover:bg-teal-50 transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                      Get Started Free <FaArrowRight />
                    </Link>
                    <Link
                      to="/doctors"
                      className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-xl hover:bg-white/10 transition-all duration-300"
                    >
                      Find Doctors
                    </Link>
                  </>
                )}
              </div>

              {/* Trust Badges */}
              <div className="flex flex-wrap items-center gap-6 mt-10 text-sm text-teal-100">
                <div className="flex items-center gap-2">
                  <FaShieldAlt className="text-green-300" />
                  <span>HIPAA Compliant</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaLock className="text-green-300" />
                  <span>256-bit Encryption</span>
                </div>
                <div className="flex items-center gap-2">
                  <MdVerified className="text-green-300" />
                  <span>FDA Registered</span>
                </div>
              </div>
            </motion.div>

            {/* Hero Image/Illustration */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative hidden lg:block"
            >
              <div className="relative">
                {/* Main Card */}
                <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20">
                  <div className="grid grid-cols-2 gap-4">
                    {/* Health Metric Cards */}
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="bg-white rounded-2xl p-4 text-gray-800"
                    >
                      <FaHeartbeat className="text-red-500 text-2xl mb-2" />
                      <p className="text-sm text-gray-500">Heart Rate</p>
                      <p className="text-2xl font-bold">72 BPM</p>
                      <div className="h-1 bg-red-100 rounded mt-2">
                        <div className="h-1 bg-red-500 rounded w-3/4"></div>
                      </div>
                    </motion.div>

                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="bg-white rounded-2xl p-4 text-gray-800"
                    >
                      <MdHealthAndSafety className="text-green-500 text-2xl mb-2" />
                      <p className="text-sm text-gray-500">Blood Oxygen</p>
                      <p className="text-2xl font-bold">98%</p>
                      <div className="h-1 bg-green-100 rounded mt-2">
                        <div className="h-1 bg-green-500 rounded w-[98%]"></div>
                      </div>
                    </motion.div>

                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="bg-white rounded-2xl p-4 text-gray-800"
                    >
                      <FaChartLine className="text-blue-500 text-2xl mb-2" />
                      <p className="text-sm text-gray-500">Blood Pressure</p>
                      <p className="text-2xl font-bold">120/80</p>
                      <p className="text-xs text-green-500 mt-1">Normal</p>
                    </motion.div>

                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="bg-white rounded-2xl p-4 text-gray-800"
                    >
                      <BiTestTube className="text-purple-500 text-2xl mb-2" />
                      <p className="text-sm text-gray-500">Glucose</p>
                      <p className="text-2xl font-bold">95 mg/dL</p>
                      <p className="text-xs text-green-500 mt-1">Optimal</p>
                    </motion.div>
                  </div>

                  {/* AI Alert */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 }}
                    className="mt-4 bg-gradient-to-r from-green-400 to-green-500 rounded-xl p-4 text-white"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                        <FaBrain />
                      </div>
                      <div>
                        <p className="font-semibold">AI Health Score: Excellent</p>
                        <p className="text-sm text-green-100">All vitals within optimal range</p>
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Floating Elements */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 3 }}
                  className="absolute -top-6 -right-6 bg-white rounded-xl p-3 shadow-lg"
                >
                  <div className="flex items-center gap-2 text-gray-800">
                    <MdNotifications className="text-teal-500 text-xl" />
                    <span className="text-sm font-medium">New Alert</span>
                  </div>
                </motion.div>

                <motion.div
                  animate={{ y: [0, 10, 0] }}
                  transition={{ repeat: Infinity, duration: 4 }}
                  className="absolute -bottom-4 -left-4 bg-white rounded-xl p-3 shadow-lg"
                >
                  <div className="flex items-center gap-2 text-gray-800">
                    <FaCalendarAlt className="text-orange-500 text-xl" />
                    <span className="text-sm font-medium">Appointment Today</span>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
              fill="#F9FAFB"
            />
          </svg>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-14 h-14 bg-teal-100 text-teal-600 rounded-xl mb-4">
                  <stat.icon className="text-2xl" />
                </div>
                <h3 className="text-3xl md:text-4xl font-bold text-gray-900">{stat.value}</h3>
                <p className="text-gray-600">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-1 bg-teal-100 text-teal-700 rounded-full text-sm font-medium mb-4">
              Comprehensive Healthcare
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need for Better Health
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our AI-enhanced platform combines cutting-edge technology with compassionate
              care to deliver a complete healthcare experience.
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                whileHover={{ y: -8 }}
                className="group"
              >
                <Link to={feature.link}>
                  <div className="bg-white border border-gray-100 rounded-2xl p-6 h-full shadow-sm hover:shadow-xl transition-all duration-300">
                    <div
                      className={`inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br ${feature.color} text-white rounded-xl mb-4 group-hover:scale-110 transition-transform`}
                    >
                      <feature.icon className="text-2xl" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {feature.description}
                    </p>
                    <div className="mt-4 flex items-center text-teal-600 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                      Learn more <FaArrowRight className="ml-2 text-xs" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-1 bg-teal-100 text-teal-700 rounded-full text-sm font-medium mb-4">
              Simple Process
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How MedAI Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get started in minutes and experience healthcare like never before.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorks.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                {/* Connector Line */}
                {index < howItWorks.length - 1 && (
                  <div className="hidden lg:block absolute top-12 left-1/2 w-full h-0.5 bg-gradient-to-r from-teal-300 to-teal-100"></div>
                )}

                <div className="relative bg-white rounded-2xl p-6 shadow-lg text-center">
                  <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-teal-500 to-cyan-500 text-white rounded-full mb-4 mx-auto relative">
                    <item.icon className="text-3xl" />
                    <span className="absolute -top-2 -right-2 w-8 h-8 bg-orange-500 text-white text-sm font-bold rounded-full flex items-center justify-center">
                      {item.step}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600 text-sm">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Specializations Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row md:items-end md:justify-between mb-12"
          >
            <div>
              <span className="inline-block px-4 py-1 bg-teal-100 text-teal-700 rounded-full text-sm font-medium mb-4">
                Medical Specialties
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Find the Right Specialist
              </h2>
              <p className="text-gray-600 max-w-xl">
                Access verified doctors across all major medical specializations with
                AI-powered matching.
              </p>
            </div>
            <Link
              to="/doctors/specializations"
              className="mt-6 md:mt-0 inline-flex items-center gap-2 text-teal-600 font-medium hover:text-teal-700"
            >
              View All Specialties <FaArrowRight />
            </Link>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
          >
            {specializations.map((spec, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                whileHover={{ y: -4 }}
              >
                <Link
                  to={`/doctors?specialty=${spec.name.toLowerCase()}`}
                  className="block bg-gray-50 hover:bg-teal-50 border border-gray-100 hover:border-teal-200 rounded-xl p-4 text-center transition-all duration-300"
                >
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-white text-teal-600 rounded-lg mb-3 shadow-sm">
                    <spec.icon className="text-xl" />
                  </div>
                  <h3 className="font-medium text-gray-900 mb-1">{spec.name}</h3>
                  <p className="text-sm text-gray-500">{spec.doctors} Doctors</p>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* AI Features Highlight */}
      <section className="py-20 bg-gradient-to-br from-teal-600 to-cyan-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="inline-block px-4 py-1 bg-white/20 rounded-full text-sm font-medium mb-4">
                Powered by AI
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Intelligent Health Monitoring & Predictions
              </h2>
              <p className="text-teal-100 text-lg mb-8">
                Our advanced AI algorithms analyze your health data 24/7 to provide
                early warnings, personalized recommendations, and predictive insights
                that help prevent health issues before they occur.
              </p>

              <div className="space-y-4">
                {[
                  "Real-time anomaly detection from wearable data",
                  "Predictive disease risk assessment",
                  "Personalized treatment recommendations",
                  "Natural language symptom analysis",
                  "Automated health report generation",
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <FaCheckCircle className="text-green-300 flex-shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <Link
                to="/ai/symptom-checker"
                className="inline-flex items-center gap-2 mt-8 px-6 py-3 bg-white text-teal-600 font-semibold rounded-xl hover:bg-teal-50 transition"
              >
                Try AI Symptom Checker <FaArrowRight />
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                    <FaBrain className="text-xl" />
                  </div>
                  <div>
                    <h3 className="font-semibold">AI Health Analysis</h3>
                    <p className="text-sm text-teal-200">Real-time processing</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-white/10 rounded-xl p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm">Cardiovascular Risk</span>
                      <span className="text-green-300 font-medium">Low</span>
                    </div>
                    <div className="h-2 bg-white/20 rounded-full">
                      <div className="h-2 bg-green-400 rounded-full w-1/4"></div>
                    </div>
                  </div>

                  <div className="bg-white/10 rounded-xl p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm">Diabetes Risk</span>
                      <span className="text-yellow-300 font-medium">Moderate</span>
                    </div>
                    <div className="h-2 bg-white/20 rounded-full">
                      <div className="h-2 bg-yellow-400 rounded-full w-1/2"></div>
                    </div>
                  </div>

                  <div className="bg-white/10 rounded-xl p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm">Overall Wellness</span>
                      <span className="text-green-300 font-medium">Excellent</span>
                    </div>
                    <div className="h-2 bg-white/20 rounded-full">
                      <div className="h-2 bg-green-400 rounded-full w-[90%]"></div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-green-500/20 rounded-xl border border-green-400/30">
                  <div className="flex items-start gap-3">
                    <MdNotifications className="text-green-300 text-xl mt-0.5" />
                    <div>
                      <p className="font-medium text-green-100">AI Recommendation</p>
                      <p className="text-sm text-green-200 mt-1">
                        Based on your recent glucose trends, consider scheduling a
                        consultation with an endocrinologist.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-1 bg-teal-100 text-teal-700 rounded-full text-sm font-medium mb-4">
              Testimonials
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Trusted by Thousands
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              See what patients and healthcare providers say about their MedAI experience.
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-8"
          >
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="bg-white rounded-2xl p-6 shadow-lg"
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <FaStar key={i} className="text-yellow-400" />
                  ))}
                </div>
                <FaQuoteLeft className="text-teal-200 text-2xl mb-4" />
                <p className="text-gray-600 mb-6 leading-relaxed">{testimonial.text}</p>
                <div className="flex items-center gap-3">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-teal-600 to-cyan-700 rounded-3xl p-8 md:p-12 text-white text-center relative overflow-hidden"
          >
            {/* Background Elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2"></div>

            <div className="relative">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to Transform Your Healthcare Experience?
              </h2>
              <p className="text-teal-100 text-lg mb-8 max-w-2xl mx-auto">
                Join thousands of patients who have taken control of their health with
                MedAI. Start your journey to better health today.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {user ? (
                  <Link
                    to={getDashboardPath()}
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-teal-600 font-semibold rounded-xl hover:bg-teal-50 transition-all duration-300 shadow-lg"
                  >
                    Go to Dashboard <FaArrowRight />
                  </Link>
                ) : (
                  <>
                    <Link
                      to="/signup"
                      className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-teal-600 font-semibold rounded-xl hover:bg-teal-50 transition-all duration-300 shadow-lg"
                    >
                      Create Free Account <FaArrowRight />
                    </Link>
                    <Link
                      to="/contact"
                      className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-xl hover:bg-white/10 transition-all duration-300"
                    >
                      <FaPhoneAlt /> Contact Sales
                    </Link>
                  </>
                )}
              </div>

              <p className="mt-6 text-teal-200 text-sm">
                No credit card required. Start with our free plan.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Emergency Banner */}
      <section className="bg-red-600 text-white py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-center md:text-left">
            <div className="flex items-center gap-2">
              <FaAmbulance className="text-2xl animate-pulse" />
              <span className="font-semibold">Medical Emergency?</span>
            </div>
            <p className="text-red-100">
              If you're experiencing a medical emergency, please call{" "}
              <a href="tel:911" className="font-bold underline">
                911
              </a>{" "}
              immediately or visit your nearest emergency room.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
