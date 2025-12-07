import { useState, useEffect, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router";
import { AuthContext } from "../../contexts/AuthContext";
import {
  FaHeartbeat,
  FaWeight,
  FaRulerVertical,
  FaTint,
  FaThermometerHalf,
  FaLungs,
  FaPlus,
  FaTimes,
  FaSave,
  FaChartLine,
  FaCalendarAlt,
  FaChevronRight,
  FaSpinner,
  FaCheckCircle,
  FaExclamationTriangle,
  FaHistory,
  FaArrowUp,
  FaArrowDown,
  FaMinus,
  FaRunning,
  FaBed,
  FaAppleAlt,
  FaWater,
  FaFire,
  FaBrain,
  FaEdit,
  FaSyncAlt,
} from "react-icons/fa";
import { MdBloodtype, MdMonitorHeart, MdHealthAndSafety, MdTrendingUp, MdTrendingDown, MdTrendingFlat } from "react-icons/md";
import { GiLungs, GiHeartBeats, GiMuscleUp } from "react-icons/gi";
import { BiBody, BiPulse } from "react-icons/bi";
import { IoFitness, IoWater } from "react-icons/io5";
import { RiHeartPulseLine, RiMentalHealthLine } from "react-icons/ri";
import { HiSparkles, HiLightningBolt } from "react-icons/hi";
import { TbActivityHeartbeat } from "react-icons/tb";

const HealthMetrics = () => {
  const { apiCall, dbUser, user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [metrics, setMetrics] = useState(null);
  const [vitalsHistory, setVitalsHistory] = useState([]);
  const [showAddVitalsModal, setShowAddVitalsModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [activeTab, setActiveTab] = useState("overview");

  // New vitals form
  const [newVitals, setNewVitals] = useState({
    height: "",
    weight: "",
    bloodPressureSystolic: "",
    bloodPressureDiastolic: "",
    heartRate: "",
    temperature: "",
    oxygenSaturation: "",
    respiratoryRate: "",
    bloodGlucose: "",
    notes: "",
  });

  // Daily tracking
  const [dailyMetrics, setDailyMetrics] = useState({
    steps: 0,
    waterIntake: 0,
    sleepHours: 0,
    caloriesBurned: 0,
    caloriesConsumed: 0,
    exerciseMinutes: 0,
  });

  useEffect(() => {
    fetchHealthMetrics();
  }, []);

  const fetchHealthMetrics = async () => {
    setLoading(true);
    try {
      // Fetch patient profile with vitals
      const profileResponse = await apiCall("/patients/me/profile");
      if (profileResponse.success) {
        setMetrics(profileResponse.data);

        // If there's vitals history in the response
        if (profileResponse.data?.vitalsHistory) {
          setVitalsHistory(profileResponse.data.vitalsHistory);
        }
      }
    } catch (error) {
      console.error("Error fetching health metrics:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddVitals = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Build vitals object in the format expected by the backend
      const vitalsData = {};

      // Height and weight as simple numbers
      if (newVitals.height) vitalsData.height = parseFloat(newVitals.height);
      if (newVitals.weight) vitalsData.weight = parseFloat(newVitals.weight);

      // Blood pressure as an object
      if (newVitals.bloodPressureSystolic && newVitals.bloodPressureDiastolic) {
        vitalsData.bloodPressure = {
          systolic: parseInt(newVitals.bloodPressureSystolic),
          diastolic: parseInt(newVitals.bloodPressureDiastolic),
        };
      }

      // Heart rate, temperature, oxygenSaturation as simple numbers (backend wraps them)
      if (newVitals.heartRate) vitalsData.heartRate = parseInt(newVitals.heartRate);
      if (newVitals.temperature) vitalsData.temperature = parseFloat(newVitals.temperature);
      if (newVitals.oxygenSaturation) vitalsData.oxygenSaturation = parseInt(newVitals.oxygenSaturation);
      if (newVitals.respiratoryRate) vitalsData.respiratoryRate = parseInt(newVitals.respiratoryRate);
      if (newVitals.bloodGlucose) vitalsData.bloodGlucose = parseInt(newVitals.bloodGlucose);

      // Use the correct endpoint for vitals
      const response = await apiCall("/patients/me/vitals", {
        method: "PUT",
        body: JSON.stringify(vitalsData),
      });

      if (response.success) {
        setSuccessMessage("Vitals recorded successfully!");
        setShowAddVitalsModal(false);
        setNewVitals({
          height: "",
          weight: "",
          bloodPressureSystolic: "",
          bloodPressureDiastolic: "",
          heartRate: "",
          temperature: "",
          oxygenSaturation: "",
          respiratoryRate: "",
          bloodGlucose: "",
          notes: "",
        });
        fetchHealthMetrics();
        setTimeout(() => setSuccessMessage(""), 3000);
      }
    } catch (error) {
      console.error("Error saving vitals:", error);
    } finally {
      setSaving(false);
    }
  };

  const getBMIStatus = (bmi) => {
    if (!bmi) return { status: "Unknown", color: "gray", icon: FaMinus };
    if (bmi < 18.5) return { status: "Underweight", color: "blue", icon: FaArrowDown };
    if (bmi < 25) return { status: "Normal", color: "green", icon: FaCheckCircle };
    if (bmi < 30) return { status: "Overweight", color: "yellow", icon: FaArrowUp };
    return { status: "Obese", color: "red", icon: FaExclamationTriangle };
  };

  const getBloodPressureStatus = (systolic, diastolic) => {
    if (!systolic || !diastolic) return { status: "Unknown", color: "gray" };
    if (systolic < 120 && diastolic < 80) return { status: "Normal", color: "green" };
    if (systolic < 130 && diastolic < 80) return { status: "Elevated", color: "yellow" };
    if (systolic < 140 || diastolic < 90) return { status: "High Stage 1", color: "orange" };
    return { status: "High Stage 2", color: "red" };
  };

  const getHeartRateStatus = (hr) => {
    if (!hr) return { status: "Unknown", color: "gray" };
    if (hr < 60) return { status: "Low", color: "blue" };
    if (hr <= 100) return { status: "Normal", color: "green" };
    return { status: "High", color: "red" };
  };

  const getOxygenStatus = (o2) => {
    if (!o2) return { status: "Unknown", color: "gray" };
    if (o2 >= 95) return { status: "Normal", color: "green" };
    if (o2 >= 90) return { status: "Low", color: "yellow" };
    return { status: "Critical", color: "red" };
  };

  const calculateHealthScore = () => {
    let score = 0;
    let factors = 0;

    // BMI score (0-25 points)
    const bmi = metrics?.vitals?.bmi;
    if (bmi) {
      factors++;
      if (bmi >= 18.5 && bmi < 25) score += 25;
      else if (bmi >= 25 && bmi < 30) score += 15;
      else if (bmi < 18.5) score += 10;
      else score += 5;
    }

    // Blood pressure score (0-25 points)
    const bp = metrics?.vitals?.bloodPressure;
    if (bp?.systolic && bp?.diastolic) {
      factors++;
      if (bp.systolic < 120 && bp.diastolic < 80) score += 25;
      else if (bp.systolic < 130 && bp.diastolic < 80) score += 20;
      else if (bp.systolic < 140 || bp.diastolic < 90) score += 10;
      else score += 5;
    }

    // Heart rate score (0-25 points)
    const hr = metrics?.vitals?.heartRate?.value;
    if (hr) {
      factors++;
      if (hr >= 60 && hr <= 100) score += 25;
      else if (hr >= 50 && hr <= 110) score += 15;
      else score += 5;
    }

    // Oxygen saturation score (0-25 points)
    const o2 = metrics?.vitals?.oxygenSaturation?.value;
    if (o2) {
      factors++;
      if (o2 >= 95) score += 25;
      else if (o2 >= 90) score += 15;
      else score += 5;
    }

    // Calculate percentage
    if (factors === 0) return 0;
    return Math.round((score / (factors * 25)) * 100);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="animate-spin text-5xl text-teal-500 mx-auto mb-4" />
          <p className="text-gray-600">Loading your health metrics...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-cyan-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-lg p-8 text-center max-w-md">
          <div className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaHeartbeat className="text-4xl text-teal-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Login Required</h2>
          <p className="text-gray-500 mb-6">Please sign in to view your health metrics.</p>
          <Link
            to="/signin"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-500 to-cyan-600 text-white rounded-xl hover:from-teal-600 hover:to-cyan-700 transition font-medium"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  const healthScore = calculateHealthScore();
  const bmiStatus = getBMIStatus(metrics?.vitals?.bmi);
  const bpStatus = getBloodPressureStatus(
    metrics?.vitals?.bloodPressure?.systolic,
    metrics?.vitals?.bloodPressure?.diastolic
  );
  const hrStatus = getHeartRateStatus(metrics?.vitals?.heartRate?.value);
  const o2Status = getOxygenStatus(metrics?.vitals?.oxygenSaturation?.value);

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-cyan-50">
      {/* Decorative backgrounds */}
      <div className="fixed top-0 right-0 w-96 h-96 bg-gradient-to-br from-teal-200/30 to-cyan-200/30 rounded-full blur-3xl -z-10" />
      <div className="fixed bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-blue-200/30 to-teal-200/30 rounded-full blur-3xl -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success Message */}
        <AnimatePresence>
          {successMessage && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-2 z-50"
            >
              <FaCheckCircle />
              {successMessage}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <Link to="/patient/dashboard" className="hover:text-teal-600 transition">
              Dashboard
            </Link>
            <FaChevronRight className="text-xs" />
            <span className="text-gray-900">Health Metrics</span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-teal-500 via-cyan-500 to-blue-500 rounded-3xl flex items-center justify-center text-white shadow-xl shadow-teal-500/25">
                  <FaHeartbeat className="text-3xl" />
                </div>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-xl flex items-center justify-center shadow-lg">
                  <TbActivityHeartbeat className="text-white text-lg" />
                </div>
              </div>

              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                  Health Metrics
                  <HiSparkles className="text-yellow-500" />
                </h1>
                <p className="text-gray-600 mt-1">
                  Track and monitor your vital health indicators
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={fetchHealthMetrics}
                className="flex items-center gap-2 px-4 py-2.5 bg-white text-gray-700 rounded-xl hover:bg-gray-50 transition font-medium border border-gray-200"
              >
                <FaSyncAlt />
                Refresh
              </button>
              <button
                onClick={() => setShowAddVitalsModal(true)}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-500 to-cyan-600 text-white rounded-xl hover:from-teal-600 hover:to-cyan-700 transition font-medium shadow-lg shadow-teal-500/25"
              >
                <FaPlus />
                Record Vitals
              </button>
            </div>
          </div>
        </motion.div>

        {/* Health Score & Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {/* Health Score Card */}
          <div className="md:col-span-1 bg-gradient-to-br from-teal-500 via-cyan-500 to-blue-500 rounded-3xl p-6 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
            <div className="relative">
              <div className="flex items-center gap-2 mb-2">
                <MdHealthAndSafety className="text-xl" />
                <p className="text-teal-100 text-sm">Health Score</p>
              </div>
              <div className="text-5xl font-bold mb-2">{healthScore}%</div>
              <div className="w-full bg-white/20 rounded-full h-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${healthScore}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="bg-white rounded-full h-2"
                />
              </div>
              <p className="text-teal-100 text-sm mt-3">
                {healthScore >= 80 ? "Excellent" : healthScore >= 60 ? "Good" : healthScore >= 40 ? "Fair" : "Needs Attention"}
              </p>
            </div>
          </div>

          {/* BMI Card */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-lg transition">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 bg-${bmiStatus.color}-100 rounded-xl flex items-center justify-center`}>
                  <BiBody className={`text-2xl text-${bmiStatus.color}-500`} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">BMI</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {metrics?.vitals?.bmi || "N/A"}
                  </p>
                </div>
              </div>
              <span className={`px-2 py-1 bg-${bmiStatus.color}-100 text-${bmiStatus.color}-700 rounded-lg text-xs font-medium`}>
                {bmiStatus.status}
              </span>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span>Height: {metrics?.vitals?.height || "N/A"} cm</span>
              <span>Weight: {metrics?.vitals?.weight || "N/A"} kg</span>
            </div>
          </div>

          {/* Blood Pressure Card */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-lg transition">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 bg-${bpStatus.color}-100 rounded-xl flex items-center justify-center`}>
                  <MdMonitorHeart className={`text-2xl text-${bpStatus.color}-500`} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Blood Pressure</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {metrics?.vitals?.bloodPressure?.systolic && metrics?.vitals?.bloodPressure?.diastolic
                      ? `${metrics.vitals.bloodPressure.systolic}/${metrics.vitals.bloodPressure.diastolic}`
                      : "N/A"}
                  </p>
                </div>
              </div>
              <span className={`px-2 py-1 bg-${bpStatus.color}-100 text-${bpStatus.color}-700 rounded-lg text-xs font-medium`}>
                {bpStatus.status}
              </span>
            </div>
            <p className="text-sm text-gray-500">mmHg</p>
          </div>

          {/* Heart Rate Card */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-lg transition">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 bg-${hrStatus.color}-100 rounded-xl flex items-center justify-center`}>
                  <RiHeartPulseLine className={`text-2xl text-${hrStatus.color}-500`} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Heart Rate</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {metrics?.vitals?.heartRate?.value || "N/A"}
                  </p>
                </div>
              </div>
              <span className={`px-2 py-1 bg-${hrStatus.color}-100 text-${hrStatus.color}-700 rounded-lg text-xs font-medium`}>
                {hrStatus.status}
              </span>
            </div>
            <p className="text-sm text-gray-500">bpm (beats per minute)</p>
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex gap-2 mb-6 overflow-x-auto pb-2"
        >
          {[
            { id: "overview", label: "Overview", icon: MdHealthAndSafety },
            { id: "vitals", label: "All Vitals", icon: FaHeartbeat },
            { id: "trends", label: "Trends", icon: FaChartLine },
            { id: "wellness", label: "Wellness", icon: HiSparkles },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-gradient-to-r from-teal-500 to-cyan-600 text-white shadow-lg shadow-teal-500/25"
                  : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
              }`}
            >
              <tab.icon />
              {tab.label}
            </button>
          ))}
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Vitals Grid */}
              <div className="lg:col-span-2 grid grid-cols-2 md:grid-cols-3 gap-4">
                {/* Oxygen Saturation */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-lg transition">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-10 h-10 bg-${o2Status.color}-100 rounded-xl flex items-center justify-center`}>
                      <FaLungs className={`text-xl text-${o2Status.color}-500`} />
                    </div>
                    <p className="text-sm text-gray-500">O2 Saturation</p>
                  </div>
                  <p className="text-3xl font-bold text-gray-900">
                    {metrics?.vitals?.oxygenSaturation?.value || "N/A"}
                    <span className="text-lg font-normal text-gray-500">%</span>
                  </p>
                  <span className={`text-xs px-2 py-0.5 bg-${o2Status.color}-100 text-${o2Status.color}-700 rounded-full`}>
                    {o2Status.status}
                  </span>
                </div>

                {/* Temperature */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-lg transition">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                      <FaThermometerHalf className="text-xl text-orange-500" />
                    </div>
                    <p className="text-sm text-gray-500">Temperature</p>
                  </div>
                  <p className="text-3xl font-bold text-gray-900">
                    {metrics?.vitals?.temperature?.value || "N/A"}
                    <span className="text-lg font-normal text-gray-500">°{metrics?.vitals?.temperature?.unit || "F"}</span>
                  </p>
                </div>

                {/* Respiratory Rate */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-lg transition">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                      <GiLungs className="text-xl text-indigo-500" />
                    </div>
                    <p className="text-sm text-gray-500">Respiratory Rate</p>
                  </div>
                  <p className="text-3xl font-bold text-gray-900">
                    {metrics?.vitals?.respiratoryRate?.value || "N/A"}
                    <span className="text-lg font-normal text-gray-500"> /min</span>
                  </p>
                </div>

                {/* Blood Glucose */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-lg transition">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                      <FaTint className="text-xl text-purple-500" />
                    </div>
                    <p className="text-sm text-gray-500">Blood Glucose</p>
                  </div>
                  <p className="text-3xl font-bold text-gray-900">
                    {metrics?.vitals?.bloodGlucose?.value || "N/A"}
                    <span className="text-lg font-normal text-gray-500"> mg/dL</span>
                  </p>
                </div>

                {/* Blood Type */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-lg transition">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                      <MdBloodtype className="text-xl text-red-500" />
                    </div>
                    <p className="text-sm text-gray-500">Blood Type</p>
                  </div>
                  <p className="text-3xl font-bold text-gray-900">
                    {metrics?.bloodType || "Unknown"}
                  </p>
                </div>

                {/* Last Updated */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-lg transition">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                      <FaHistory className="text-xl text-gray-500" />
                    </div>
                    <p className="text-sm text-gray-500">Last Updated</p>
                  </div>
                  <p className="text-lg font-medium text-gray-900">
                    {metrics?.vitals?.lastUpdated
                      ? new Date(metrics.vitals.lastUpdated).toLocaleDateString()
                      : "Not recorded"}
                  </p>
                </div>
              </div>

              {/* Sidebar - Health Tips & Quick Actions */}
              <div className="space-y-6">
                {/* Quick Actions */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <HiLightningBolt className="text-yellow-500" />
                    Quick Actions
                  </h3>
                  <div className="space-y-3">
                    <button
                      onClick={() => setShowAddVitalsModal(true)}
                      className="w-full flex items-center gap-3 p-3 bg-teal-50 text-teal-700 rounded-xl hover:bg-teal-100 transition"
                    >
                      <FaPlus />
                      Record New Vitals
                    </button>
                    <Link
                      to="/patient/profile"
                      className="w-full flex items-center gap-3 p-3 bg-blue-50 text-blue-700 rounded-xl hover:bg-blue-100 transition"
                    >
                      <FaEdit />
                      Update Profile
                    </Link>
                    <Link
                      to="/ai/symptom-checker"
                      className="w-full flex items-center gap-3 p-3 bg-purple-50 text-purple-700 rounded-xl hover:bg-purple-100 transition"
                    >
                      <HiSparkles />
                      AI Symptom Checker
                    </Link>
                  </div>
                </div>

                {/* Health Tips */}
                <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-2xl border border-teal-100 p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <HiSparkles className="text-yellow-500" />
                    Health Tips
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 p-3 bg-white/80 rounded-xl">
                      <FaWater className="text-blue-500 mt-1" />
                      <div>
                        <p className="font-medium text-gray-900">Stay Hydrated</p>
                        <p className="text-sm text-gray-500">Drink 8 glasses of water daily</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-white/80 rounded-xl">
                      <FaRunning className="text-green-500 mt-1" />
                      <div>
                        <p className="font-medium text-gray-900">Stay Active</p>
                        <p className="text-sm text-gray-500">30 mins of exercise daily</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-white/80 rounded-xl">
                      <FaBed className="text-purple-500 mt-1" />
                      <div>
                        <p className="font-medium text-gray-900">Quality Sleep</p>
                        <p className="text-sm text-gray-500">Aim for 7-9 hours nightly</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* All Vitals Tab */}
          {activeTab === "vitals" && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <FaHeartbeat className="text-teal-500" />
                Complete Vitals Record
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Height */}
                <div className="p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3 mb-2">
                    <FaRulerVertical className="text-blue-500" />
                    <span className="text-sm text-gray-500">Height</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{metrics?.vitals?.height || "N/A"} cm</p>
                </div>

                {/* Weight */}
                <div className="p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3 mb-2">
                    <FaWeight className="text-green-500" />
                    <span className="text-sm text-gray-500">Weight</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{metrics?.vitals?.weight || "N/A"} kg</p>
                </div>

                {/* BMI */}
                <div className="p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3 mb-2">
                    <BiBody className="text-purple-500" />
                    <span className="text-sm text-gray-500">BMI</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{metrics?.vitals?.bmi || "N/A"}</p>
                  <span className={`text-xs px-2 py-0.5 bg-${bmiStatus.color}-100 text-${bmiStatus.color}-700 rounded-full`}>
                    {bmiStatus.status}
                  </span>
                </div>

                {/* Blood Pressure */}
                <div className="p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3 mb-2">
                    <MdMonitorHeart className="text-red-500" />
                    <span className="text-sm text-gray-500">Blood Pressure</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">
                    {metrics?.vitals?.bloodPressure?.systolic && metrics?.vitals?.bloodPressure?.diastolic
                      ? `${metrics.vitals.bloodPressure.systolic}/${metrics.vitals.bloodPressure.diastolic}`
                      : "N/A"} mmHg
                  </p>
                  <span className={`text-xs px-2 py-0.5 bg-${bpStatus.color}-100 text-${bpStatus.color}-700 rounded-full`}>
                    {bpStatus.status}
                  </span>
                </div>

                {/* Heart Rate */}
                <div className="p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3 mb-2">
                    <RiHeartPulseLine className="text-pink-500" />
                    <span className="text-sm text-gray-500">Heart Rate</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{metrics?.vitals?.heartRate?.value || "N/A"} bpm</p>
                  <span className={`text-xs px-2 py-0.5 bg-${hrStatus.color}-100 text-${hrStatus.color}-700 rounded-full`}>
                    {hrStatus.status}
                  </span>
                </div>

                {/* Oxygen Saturation */}
                <div className="p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3 mb-2">
                    <FaLungs className="text-cyan-500" />
                    <span className="text-sm text-gray-500">Oxygen Saturation</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{metrics?.vitals?.oxygenSaturation?.value || "N/A"}%</p>
                  <span className={`text-xs px-2 py-0.5 bg-${o2Status.color}-100 text-${o2Status.color}-700 rounded-full`}>
                    {o2Status.status}
                  </span>
                </div>

                {/* Temperature */}
                <div className="p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3 mb-2">
                    <FaThermometerHalf className="text-orange-500" />
                    <span className="text-sm text-gray-500">Temperature</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">
                    {metrics?.vitals?.temperature?.value || "N/A"}°{metrics?.vitals?.temperature?.unit || "F"}
                  </p>
                </div>

                {/* Respiratory Rate */}
                <div className="p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3 mb-2">
                    <GiLungs className="text-indigo-500" />
                    <span className="text-sm text-gray-500">Respiratory Rate</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{metrics?.vitals?.respiratoryRate?.value || "N/A"} /min</p>
                </div>

                {/* Blood Glucose */}
                <div className="p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3 mb-2">
                    <FaTint className="text-purple-500" />
                    <span className="text-sm text-gray-500">Blood Glucose</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{metrics?.vitals?.bloodGlucose?.value || "N/A"} mg/dL</p>
                </div>
              </div>
            </div>
          )}

          {/* Trends Tab */}
          {activeTab === "trends" && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <FaChartLine className="text-teal-500" />
                Health Trends
              </h3>
              <div className="text-center py-12">
                <FaChartLine className="text-6xl text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">Trend analysis coming soon</p>
                <p className="text-gray-400 text-sm mt-2">
                  Record your vitals regularly to see trends over time
                </p>
              </div>
            </div>
          )}

          {/* Wellness Tab */}
          {activeTab === "wellness" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Daily Goals */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <IoFitness className="text-green-500" />
                  Daily Wellness Goals
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <FaWater className="text-2xl text-blue-500" />
                      <div>
                        <p className="font-medium text-gray-900">Water Intake</p>
                        <p className="text-sm text-gray-500">Goal: 8 glasses</p>
                      </div>
                    </div>
                    <span className="text-xl font-bold text-blue-600">0/8</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <FaRunning className="text-2xl text-green-500" />
                      <div>
                        <p className="font-medium text-gray-900">Steps</p>
                        <p className="text-sm text-gray-500">Goal: 10,000 steps</p>
                      </div>
                    </div>
                    <span className="text-xl font-bold text-green-600">0</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-purple-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <FaBed className="text-2xl text-purple-500" />
                      <div>
                        <p className="font-medium text-gray-900">Sleep</p>
                        <p className="text-sm text-gray-500">Goal: 8 hours</p>
                      </div>
                    </div>
                    <span className="text-xl font-bold text-purple-600">0h</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-orange-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <FaFire className="text-2xl text-orange-500" />
                      <div>
                        <p className="font-medium text-gray-900">Calories Burned</p>
                        <p className="text-sm text-gray-500">Goal: 500 cal</p>
                      </div>
                    </div>
                    <span className="text-xl font-bold text-orange-600">0</span>
                  </div>
                </div>
              </div>

              {/* Wellness Resources */}
              <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-2xl border border-teal-100 p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <HiSparkles className="text-yellow-500" />
                  Wellness Resources
                </h3>
                <div className="space-y-4">
                  <Link
                    to="/ai/wellness"
                    className="block p-4 bg-white rounded-xl hover:shadow-md transition"
                  >
                    <div className="flex items-center gap-3">
                      <FaAppleAlt className="text-2xl text-green-500" />
                      <div>
                        <p className="font-medium text-gray-900">Nutrition Tips</p>
                        <p className="text-sm text-gray-500">Personalized diet recommendations</p>
                      </div>
                    </div>
                  </Link>
                  <Link
                    to="/ai/predictions"
                    className="block p-4 bg-white rounded-xl hover:shadow-md transition"
                  >
                    <div className="flex items-center gap-3">
                      <FaBrain className="text-2xl text-purple-500" />
                      <div>
                        <p className="font-medium text-gray-900">Health Predictions</p>
                        <p className="text-sm text-gray-500">AI-powered health insights</p>
                      </div>
                    </div>
                  </Link>
                  <Link
                    to="/ai/alerts"
                    className="block p-4 bg-white rounded-xl hover:shadow-md transition"
                  >
                    <div className="flex items-center gap-3">
                      <RiMentalHealthLine className="text-2xl text-teal-500" />
                      <div>
                        <p className="font-medium text-gray-900">Health Alerts</p>
                        <p className="text-sm text-gray-500">Stay informed about your health</p>
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Add Vitals Modal */}
      <AnimatePresence>
        {showAddVitalsModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowAddVitalsModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-teal-500 to-cyan-600 p-6 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                      <FaHeartbeat className="text-xl" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold">Record Vitals</h2>
                      <p className="text-teal-100 text-sm">Enter your current measurements</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowAddVitalsModal(false)}
                    className="p-2 hover:bg-white/20 rounded-xl transition"
                  >
                    <FaTimes className="text-xl" />
                  </button>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleAddVitals} className="p-6 overflow-y-auto max-h-[60vh]">
                <div className="grid grid-cols-2 gap-4">
                  {/* Height */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Height (cm)
                    </label>
                    <input
                      type="number"
                      value={newVitals.height}
                      onChange={(e) => setNewVitals((prev) => ({ ...prev, height: e.target.value }))}
                      placeholder="170"
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                  </div>

                  {/* Weight */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Weight (kg)
                    </label>
                    <input
                      type="number"
                      value={newVitals.weight}
                      onChange={(e) => setNewVitals((prev) => ({ ...prev, weight: e.target.value }))}
                      placeholder="70"
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                  </div>

                  {/* Blood Pressure */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Blood Pressure (Systolic)
                    </label>
                    <input
                      type="number"
                      value={newVitals.bloodPressureSystolic}
                      onChange={(e) => setNewVitals((prev) => ({ ...prev, bloodPressureSystolic: e.target.value }))}
                      placeholder="120"
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Blood Pressure (Diastolic)
                    </label>
                    <input
                      type="number"
                      value={newVitals.bloodPressureDiastolic}
                      onChange={(e) => setNewVitals((prev) => ({ ...prev, bloodPressureDiastolic: e.target.value }))}
                      placeholder="80"
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                  </div>

                  {/* Heart Rate */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Heart Rate (bpm)
                    </label>
                    <input
                      type="number"
                      value={newVitals.heartRate}
                      onChange={(e) => setNewVitals((prev) => ({ ...prev, heartRate: e.target.value }))}
                      placeholder="72"
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                  </div>

                  {/* Temperature */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Temperature (°F)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={newVitals.temperature}
                      onChange={(e) => setNewVitals((prev) => ({ ...prev, temperature: e.target.value }))}
                      placeholder="98.6"
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                  </div>

                  {/* Oxygen Saturation */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Oxygen Saturation (%)
                    </label>
                    <input
                      type="number"
                      value={newVitals.oxygenSaturation}
                      onChange={(e) => setNewVitals((prev) => ({ ...prev, oxygenSaturation: e.target.value }))}
                      placeholder="98"
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                  </div>

                  {/* Respiratory Rate */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Respiratory Rate (/min)
                    </label>
                    <input
                      type="number"
                      value={newVitals.respiratoryRate}
                      onChange={(e) => setNewVitals((prev) => ({ ...prev, respiratoryRate: e.target.value }))}
                      placeholder="16"
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                  </div>

                  {/* Blood Glucose */}
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Blood Glucose (mg/dL)
                    </label>
                    <input
                      type="number"
                      value={newVitals.bloodGlucose}
                      onChange={(e) => setNewVitals((prev) => ({ ...prev, bloodGlucose: e.target.value }))}
                      placeholder="100"
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                  </div>

                  {/* Notes */}
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Notes (Optional)
                    </label>
                    <textarea
                      value={newVitals.notes}
                      onChange={(e) => setNewVitals((prev) => ({ ...prev, notes: e.target.value }))}
                      placeholder="Any additional notes..."
                      rows={2}
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
                    />
                  </div>
                </div>
              </form>

              {/* Footer */}
              <div className="bg-gray-50 border-t border-gray-100 p-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddVitalsModal(false)}
                  className="px-5 py-2.5 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddVitals}
                  disabled={saving}
                  className="px-5 py-2.5 bg-gradient-to-r from-teal-500 to-cyan-600 text-white rounded-xl hover:from-teal-600 hover:to-cyan-700 transition font-medium disabled:opacity-50 flex items-center gap-2"
                >
                  {saving ? (
                    <>
                      <FaSpinner className="animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <FaSave />
                      Save Vitals
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HealthMetrics;
