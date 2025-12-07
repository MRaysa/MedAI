import { useState, useEffect, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AuthContext } from "../../contexts/AuthContext";
import { Link } from "react-router";
import {
  FaChartLine,
  FaHeartbeat,
  FaAppleAlt,
  FaRunning,
  FaBed,
  FaBrain,
  FaShieldAlt,
  FaExclamationTriangle,
  FaCheckCircle,
  FaInfoCircle,
  FaArrowRight,
  FaArrowUp,
  FaArrowDown,
  FaMinus,
  FaHistory,
  FaSyncAlt,
  FaUserMd,
  FaClipboardList,
  FaPercentage,
  FaLightbulb,
  FaSpinner,
  FaChevronDown,
  FaChevronUp,
  FaPills,
  FaWeight,
  FaTint,
  FaUtensils,
  FaBan,
  FaLeaf,
  FaDumbbell,
  FaCalendarAlt,
  FaStopwatch,
  FaBullseye,
  FaWalking,
  FaHeart,
} from "react-icons/fa";
import { HiSparkles } from "react-icons/hi";
import { MdHealthAndSafety, MdTrendingUp, MdTimer, MdFitnessCenter, MdRestaurant } from "react-icons/md";
import { GiMedicines, GiStethoscope, GiNightSleep, GiMeditation } from "react-icons/gi";
import { BiBody } from "react-icons/bi";

const HealthPredictions = () => {
  const { apiCall, user, dbUser, loading: authLoading } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [predictions, setPredictions] = useState(null);
  const [history, setHistory] = useState([]);
  const [showForm, setShowForm] = useState(true);
  const [error, setError] = useState(null);

  // Form state
  const [healthData, setHealthData] = useState({
    height: "",
    weight: "",
    bloodPressureSystolic: "",
    bloodPressureDiastolic: "",
    bloodSugar: "",
    cholesterol: "",
    heartRate: ""
  });

  const [lifestyle, setLifestyle] = useState({
    smokingStatus: "never",
    alcoholConsumption: "none",
    exerciseFrequency: "moderate",
    dietQuality: "balanced",
    sleepHours: "7-8",
    stressLevel: "moderate"
  });

  const [familyHistory, setFamilyHistory] = useState("");
  const [currentConditions, setCurrentConditions] = useState("");

  useEffect(() => {
    if (user && dbUser) {
      fetchHistory();
    }
  }, [user, dbUser]);

  const fetchHistory = async () => {
    try {
      const response = await apiCall("/ai/predictions/history");
      if (response.success) {
        setHistory(response.data);
        // Show latest prediction if available
        if (response.data.length > 0 && !predictions) {
          setPredictions(response.data[0].result);
          setShowForm(false);
        }
      }
    } catch (error) {
      console.error("Error fetching history:", error);
    }
  };

  const handleHealthDataChange = (field, value) => {
    setHealthData(prev => ({ ...prev, [field]: value }));
  };

  const handleLifestyleChange = (field, value) => {
    setLifestyle(prev => ({ ...prev, [field]: value }));
  };

  const handleGeneratePredictions = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiCall("/ai/predictions", {
        method: "POST",
        body: JSON.stringify({
          healthData,
          lifestyle,
          familyHistory,
          currentConditions
        })
      });

      if (response.success) {
        setPredictions(response.data);
        setShowForm(false);
        fetchHistory();
      } else {
        setError(response.message || "Failed to generate predictions");
      }
    } catch (err) {
      setError(err.message || "Failed to generate predictions. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (level) => {
    const colors = {
      high: { bg: "bg-red-100", text: "text-red-700", border: "border-red-200" },
      moderate: { bg: "bg-amber-100", text: "text-amber-700", border: "border-amber-200" },
      low: { bg: "bg-green-100", text: "text-green-700", border: "border-green-200" }
    };
    return colors[level] || colors.moderate;
  };

  const getScoreColor = (score) => {
    if (score >= 80) return "text-green-500";
    if (score >= 60) return "text-amber-500";
    return "text-red-500";
  };

  const getScoreBg = (score) => {
    if (score >= 80) return "from-green-500 to-emerald-600";
    if (score >= 60) return "from-amber-500 to-orange-600";
    return "from-red-500 to-rose-600";
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full border-4 border-teal-100 border-t-teal-500 animate-spin mx-auto" />
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-lg p-8 text-center max-w-md">
          <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaChartLine className="text-4xl text-purple-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Login Required</h2>
          <p className="text-gray-500 mb-6">Please sign in to access Health Predictions.</p>
          <Link
            to="/signin"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-xl hover:from-purple-600 hover:to-indigo-700 transition font-medium"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50/30 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                <FaChartLine className="text-3xl text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                  Health Predictions
                  <HiSparkles className="text-amber-500" />
                </h1>
                <p className="text-gray-600">
                  AI-powered health risk assessment and recommendations
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              {predictions && (
                <button
                  onClick={() => setShowForm(!showForm)}
                  className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition"
                >
                  {showForm ? <FaChevronUp /> : <FaChevronDown />}
                  {showForm ? "Hide Form" : "Update Data"}
                </button>
              )}
              <button
                onClick={() => { setPredictions(null); setShowForm(true); }}
                className="flex items-center gap-2 px-4 py-2.5 bg-purple-100 text-purple-700 rounded-xl hover:bg-purple-200 transition"
              >
                <FaSyncAlt />
                New Assessment
              </button>
            </div>
          </div>
        </motion.div>

        {/* Input Form */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-8 space-y-6"
            >
              {/* Health Metrics */}
              <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <FaHeartbeat className="text-red-500" />
                  Health Metrics
                </h2>
                <div className="grid md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Height (cm)</label>
                    <input
                      type="number"
                      value={healthData.height}
                      onChange={(e) => handleHealthDataChange("height", e.target.value)}
                      placeholder="170"
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Weight (kg)</label>
                    <input
                      type="number"
                      value={healthData.weight}
                      onChange={(e) => handleHealthDataChange("weight", e.target.value)}
                      placeholder="70"
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Blood Pressure</label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        value={healthData.bloodPressureSystolic}
                        onChange={(e) => handleHealthDataChange("bloodPressureSystolic", e.target.value)}
                        placeholder="120"
                        className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500"
                      />
                      <span className="flex items-center text-gray-400">/</span>
                      <input
                        type="number"
                        value={healthData.bloodPressureDiastolic}
                        onChange={(e) => handleHealthDataChange("bloodPressureDiastolic", e.target.value)}
                        placeholder="80"
                        className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Heart Rate (bpm)</label>
                    <input
                      type="number"
                      value={healthData.heartRate}
                      onChange={(e) => handleHealthDataChange("heartRate", e.target.value)}
                      placeholder="72"
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Blood Sugar (mg/dL)</label>
                    <input
                      type="number"
                      value={healthData.bloodSugar}
                      onChange={(e) => handleHealthDataChange("bloodSugar", e.target.value)}
                      placeholder="100"
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Cholesterol (mg/dL)</label>
                    <input
                      type="number"
                      value={healthData.cholesterol}
                      onChange={(e) => handleHealthDataChange("cholesterol", e.target.value)}
                      placeholder="200"
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>
              </div>

              {/* Lifestyle Factors */}
              <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <FaRunning className="text-green-500" />
                  Lifestyle Factors
                </h2>
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Smoking Status</label>
                    <select
                      value={lifestyle.smokingStatus}
                      onChange={(e) => handleLifestyleChange("smokingStatus", e.target.value)}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="never">Never Smoked</option>
                      <option value="former">Former Smoker</option>
                      <option value="current">Current Smoker</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Alcohol Consumption</label>
                    <select
                      value={lifestyle.alcoholConsumption}
                      onChange={(e) => handleLifestyleChange("alcoholConsumption", e.target.value)}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="none">None</option>
                      <option value="occasional">Occasional</option>
                      <option value="moderate">Moderate</option>
                      <option value="heavy">Heavy</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Exercise Frequency</label>
                    <select
                      value={lifestyle.exerciseFrequency}
                      onChange={(e) => handleLifestyleChange("exerciseFrequency", e.target.value)}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="sedentary">Sedentary</option>
                      <option value="light">Light (1-2 days/week)</option>
                      <option value="moderate">Moderate (3-4 days/week)</option>
                      <option value="active">Active (5+ days/week)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Diet Quality</label>
                    <select
                      value={lifestyle.dietQuality}
                      onChange={(e) => handleLifestyleChange("dietQuality", e.target.value)}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="poor">Poor</option>
                      <option value="average">Average</option>
                      <option value="balanced">Balanced</option>
                      <option value="excellent">Excellent</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Sleep Hours</label>
                    <select
                      value={lifestyle.sleepHours}
                      onChange={(e) => handleLifestyleChange("sleepHours", e.target.value)}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="less-5">Less than 5 hours</option>
                      <option value="5-6">5-6 hours</option>
                      <option value="7-8">7-8 hours</option>
                      <option value="more-8">More than 8 hours</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Stress Level</label>
                    <select
                      value={lifestyle.stressLevel}
                      onChange={(e) => handleLifestyleChange("stressLevel", e.target.value)}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="low">Low</option>
                      <option value="moderate">Moderate</option>
                      <option value="high">High</option>
                      <option value="very-high">Very High</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Medical History */}
              <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <GiMedicines className="text-blue-500" />
                  Medical History
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Family Medical History</label>
                    <textarea
                      value={familyHistory}
                      onChange={(e) => setFamilyHistory(e.target.value)}
                      placeholder="E.g., Heart disease, diabetes, cancer in family..."
                      rows={3}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Current Health Conditions</label>
                    <textarea
                      value={currentConditions}
                      onChange={(e) => setCurrentConditions(e.target.value)}
                      placeholder="E.g., Hypertension, allergies, chronic conditions..."
                      rows={3}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-2xl">
                  <p className="text-red-700 flex items-center gap-2">
                    <FaExclamationTriangle />
                    {error}
                  </p>
                </div>
              )}

              {/* Generate Button */}
              <button
                onClick={handleGeneratePredictions}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-2xl hover:from-purple-600 hover:to-indigo-700 transition font-medium disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    Analyzing Health Data...
                  </>
                ) : (
                  <>
                    <MdTrendingUp className="text-xl" />
                    Generate Health Predictions
                  </>
                )}
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Predictions Results */}
        {predictions && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Health Score Card */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
              <div className={`bg-gradient-to-r ${getScoreBg(predictions.overallHealthScore)} p-8 text-white`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/80 text-sm mb-1">Overall Health Score</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-6xl font-bold">{predictions.overallHealthScore || 75}</span>
                      <span className="text-2xl">/100</span>
                    </div>
                    <p className="text-white/80 mt-2">
                      {predictions.overallHealthScore >= 80 ? "Excellent health status" :
                       predictions.overallHealthScore >= 60 ? "Good with room for improvement" :
                       "Needs attention"}
                    </p>
                    {predictions.healthScoreExplanation && (
                      <p className="text-white/70 text-sm mt-2">{predictions.healthScoreExplanation}</p>
                    )}
                  </div>
                  <div className="w-32 h-32 rounded-full bg-white/20 flex items-center justify-center">
                    <MdHealthAndSafety className="text-6xl" />
                  </div>
                </div>
              </div>
              {/* Health Score Breakdown */}
              {predictions.healthScoreBreakdown && (
                <div className="p-6 grid grid-cols-5 gap-4">
                  {Object.entries(predictions.healthScoreBreakdown).map(([key, value]) => (
                    <div key={key} className="text-center">
                      <div className={`text-2xl font-bold ${getScoreColor(value)}`}>{value}</div>
                      <div className="text-xs text-gray-500 capitalize">{key}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* BMI & Vital Signs Analysis */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* BMI Analysis */}
              {predictions.bmiAnalysis && (
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <FaWeight className="text-blue-500" />
                    BMI Analysis
                  </h3>
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`text-4xl font-bold ${
                      predictions.bmiAnalysis.category === 'Normal' ? 'text-green-500' :
                      predictions.bmiAnalysis.category === 'Overweight' ? 'text-amber-500' : 'text-red-500'
                    }`}>
                      {predictions.bmiAnalysis.value}
                    </div>
                    <div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        predictions.bmiAnalysis.category === 'Normal' ? 'bg-green-100 text-green-700' :
                        predictions.bmiAnalysis.category === 'Overweight' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {predictions.bmiAnalysis.category}
                      </span>
                      <p className="text-xs text-gray-500 mt-1">Ideal: {predictions.bmiAnalysis.idealRange}</p>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm">{predictions.bmiAnalysis.interpretation}</p>
                </div>
              )}

              {/* Vital Signs */}
              {predictions.vitalSignsAnalysis && (
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <FaHeartbeat className="text-red-500" />
                    Vital Signs Analysis
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {Object.entries(predictions.vitalSignsAnalysis).map(([key, data]) => (
                      <div key={key} className="p-3 bg-gray-50 rounded-xl">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-gray-500 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            data.status === 'Normal' ? 'bg-green-100 text-green-700' :
                            data.status === 'High' || data.status === 'Elevated' ? 'bg-red-100 text-red-700' :
                            'bg-amber-100 text-amber-700'
                          }`}>
                            {data.status}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600">{data.recommendation}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Risk Assessments */}
            {predictions.riskAssessments && predictions.riskAssessments.length > 0 && (
              <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <FaExclamationTriangle className="text-amber-500" />
                  Risk Assessments
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {predictions.riskAssessments.map((risk, index) => (
                    <div
                      key={index}
                      className={`p-4 rounded-2xl border ${getRiskColor(risk.riskLevel).border} ${getRiskColor(risk.riskLevel).bg}`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className={`font-semibold ${getRiskColor(risk.riskLevel).text}`}>
                          {risk.condition}
                        </h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(risk.riskLevel).text} bg-white`}>
                          {risk.riskPercentage}% risk
                        </span>
                      </div>
                      {risk.factors && (
                        <div className="mb-2">
                          <p className="text-sm text-gray-600 mb-1">Risk factors:</p>
                          <div className="flex flex-wrap gap-1">
                            {risk.factors.map((factor, i) => (
                              <span key={i} className="px-2 py-0.5 bg-white/80 text-gray-600 rounded text-xs">
                                {factor}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      {risk.preventiveMeasures && (
                        <div className="mt-2 pt-2 border-t border-white/50">
                          <p className="text-sm text-gray-600">Prevention:</p>
                          <ul className="text-sm text-gray-700">
                            {risk.preventiveMeasures.slice(0, 2).map((measure, i) => (
                              <li key={i} className="flex items-start gap-1">
                                <FaCheckCircle className="text-green-500 mt-0.5 flex-shrink-0 text-xs" />
                                {measure}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Positive Factors & Areas for Improvement */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Positive Factors */}
              {predictions.positiveFactors && predictions.positiveFactors.length > 0 && (
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <FaCheckCircle className="text-green-500" />
                    Positive Factors
                  </h3>
                  <ul className="space-y-2">
                    {predictions.positiveFactors.map((factor, index) => (
                      <li key={index} className="flex items-start gap-2 p-3 bg-green-50 rounded-xl">
                        <FaArrowUp className="text-green-500 mt-1 flex-shrink-0" />
                        <div>
                          <span className="text-gray-900 font-medium">
                            {typeof factor === 'object' ? factor.factor : factor}
                          </span>
                          {typeof factor === 'object' && factor.benefit && (
                            <p className="text-sm text-gray-600">{factor.benefit}</p>
                          )}
                          {typeof factor === 'object' && factor.maintainTip && (
                            <p className="text-xs text-green-600 mt-1">Tip: {factor.maintainTip}</p>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Areas for Improvement */}
              {predictions.areasForImprovement && predictions.areasForImprovement.length > 0 && (
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <FaLightbulb className="text-amber-500" />
                    Areas for Improvement
                  </h3>
                  <div className="space-y-3">
                    {predictions.areasForImprovement.map((area, index) => (
                      <div key={index} className="p-4 bg-amber-50 rounded-xl">
                        <div className="flex items-start justify-between mb-2">
                          <p className="font-medium text-gray-900">{area.area}</p>
                          {area.priority && (
                            <span className={`text-xs px-2 py-0.5 rounded-full ${
                              area.priority === 'high' ? 'bg-red-100 text-red-700' :
                              area.priority === 'medium' ? 'bg-amber-100 text-amber-700' :
                              'bg-green-100 text-green-700'
                            }`}>
                              {area.priority}
                            </span>
                          )}
                        </div>
                        {area.currentStatus && (
                          <p className="text-sm text-gray-600">Current: {area.currentStatus}</p>
                        )}
                        {area.targetGoal && (
                          <p className="text-sm text-amber-700">Goal: {area.targetGoal}</p>
                        )}
                        {area.actionPlan && area.actionPlan.length > 0 && (
                          <ul className="mt-2 space-y-1">
                            {area.actionPlan.map((step, i) => (
                              <li key={i} className="text-xs text-gray-600 flex items-start gap-2">
                                <FaArrowRight className="text-amber-500 mt-0.5 flex-shrink-0" />
                                {step}
                              </li>
                            ))}
                          </ul>
                        )}
                        {area.expectedBenefit && (
                          <p className="text-xs text-green-600 mt-2">Benefit: {area.expectedBenefit}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Lifestyle Recommendations */}
            {predictions.lifestyleRecommendations && (
              <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <FaHeartbeat className="text-pink-500" />
                  Lifestyle Recommendations
                </h3>
                <div className="grid md:grid-cols-4 gap-4">
                  {/* Diet */}
                  <div className="p-4 bg-green-50 rounded-2xl">
                    <div className="flex items-center gap-2 mb-3">
                      <FaAppleAlt className="text-green-500" />
                      <span className="font-semibold text-gray-900">Diet</span>
                    </div>
                    <ul className="space-y-1">
                      {(predictions.lifestyleRecommendations.diet || []).map((tip, i) => (
                        <li key={i} className="text-sm text-gray-600 flex items-start gap-1">
                          <FaCheckCircle className="text-green-400 mt-0.5 flex-shrink-0 text-xs" />
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Exercise */}
                  <div className="p-4 bg-blue-50 rounded-2xl">
                    <div className="flex items-center gap-2 mb-3">
                      <FaRunning className="text-blue-500" />
                      <span className="font-semibold text-gray-900">Exercise</span>
                    </div>
                    <ul className="space-y-1">
                      {(predictions.lifestyleRecommendations.exercise || []).map((tip, i) => (
                        <li key={i} className="text-sm text-gray-600 flex items-start gap-1">
                          <FaCheckCircle className="text-blue-400 mt-0.5 flex-shrink-0 text-xs" />
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Sleep */}
                  <div className="p-4 bg-purple-50 rounded-2xl">
                    <div className="flex items-center gap-2 mb-3">
                      <FaBed className="text-purple-500" />
                      <span className="font-semibold text-gray-900">Sleep</span>
                    </div>
                    <ul className="space-y-1">
                      {(predictions.lifestyleRecommendations.sleep || []).map((tip, i) => (
                        <li key={i} className="text-sm text-gray-600 flex items-start gap-1">
                          <FaCheckCircle className="text-purple-400 mt-0.5 flex-shrink-0 text-xs" />
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Stress */}
                  <div className="p-4 bg-pink-50 rounded-2xl">
                    <div className="flex items-center gap-2 mb-3">
                      <FaBrain className="text-pink-500" />
                      <span className="font-semibold text-gray-900">Stress</span>
                    </div>
                    <ul className="space-y-1">
                      {(predictions.lifestyleRecommendations.stress || []).map((tip, i) => (
                        <li key={i} className="text-sm text-gray-600 flex items-start gap-1">
                          <FaCheckCircle className="text-pink-400 mt-0.5 flex-shrink-0 text-xs" />
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Suggested Supplements */}
            {predictions.suggestedSupplements && predictions.suggestedSupplements.length > 0 && (
              <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <FaPills className="text-purple-500" />
                  Suggested Supplements
                </h3>
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4">
                  <p className="text-amber-800 text-sm flex items-start gap-2">
                    <FaExclamationTriangle className="mt-0.5 flex-shrink-0" />
                    Consult a healthcare provider before starting any supplements, especially if taking medications.
                  </p>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  {predictions.suggestedSupplements.map((supp, index) => (
                    <div key={index} className="p-4 bg-purple-50 rounded-2xl border border-purple-100">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold text-gray-900">{supp.name}</h4>
                        <span className="text-xs bg-purple-200 text-purple-800 px-2 py-1 rounded-full">{supp.dosage}</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{supp.purpose}</p>
                      {supp.naturalSources && supp.naturalSources.length > 0 && (
                        <div className="mt-2">
                          <p className="text-xs text-gray-500">Natural sources:</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {supp.naturalSources.map((src, i) => (
                              <span key={i} className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">{src}</span>
                            ))}
                          </div>
                        </div>
                      )}
                      {supp.warnings && (
                        <p className="text-xs text-red-600 mt-2 flex items-start gap-1">
                          <FaBan className="mt-0.5 flex-shrink-0" />
                          {supp.warnings}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Diet Plan */}
            {predictions.dietPlan && (
              <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <FaUtensils className="text-green-500" />
                  Personalized Diet Plan
                </h3>
                <p className="text-gray-600 mb-4">{predictions.dietPlan.overview}</p>

                <div className="grid md:grid-cols-3 gap-4 mb-6">
                  <div className="p-4 bg-blue-50 rounded-2xl text-center">
                    <p className="text-sm text-gray-500">Daily Calories</p>
                    <p className="text-xl font-bold text-blue-600">{predictions.dietPlan.dailyCalories}</p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-2xl text-center">
                    <p className="text-sm text-gray-500">Hydration</p>
                    <p className="text-xl font-bold text-green-600">{predictions.dietPlan.hydration}</p>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-2xl text-center">
                    <p className="text-sm text-gray-500">Meal Timing</p>
                    <p className="text-sm font-medium text-purple-600">{predictions.dietPlan.mealTiming}</p>
                  </div>
                </div>

                {predictions.dietPlan.macroBreakdown && (
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Macro Breakdown</h4>
                    <div className="flex gap-4">
                      {Object.entries(predictions.dietPlan.macroBreakdown).map(([macro, value]) => (
                        <div key={macro} className="flex-1 p-3 bg-gray-50 rounded-xl text-center">
                          <p className="text-lg font-bold text-gray-900">{value}</p>
                          <p className="text-xs text-gray-500 capitalize">{macro}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Foods to Eat */}
                  {predictions.dietPlan.foodsToEat && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <FaLeaf className="text-green-500" />
                        Foods to Include
                      </h4>
                      <div className="space-y-2">
                        {predictions.dietPlan.foodsToEat.map((item, i) => (
                          <div key={i} className="p-3 bg-green-50 rounded-xl">
                            <div className="flex items-center justify-between">
                              <span className="font-medium text-gray-900">{item.food}</span>
                              <span className="text-xs text-green-600">{item.servings}</span>
                            </div>
                            <p className="text-xs text-gray-600">{item.benefit}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Foods to Avoid */}
                  {predictions.dietPlan.foodsToAvoid && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <FaBan className="text-red-500" />
                        Foods to Limit
                      </h4>
                      <div className="space-y-2">
                        {predictions.dietPlan.foodsToAvoid.map((item, i) => (
                          <div key={i} className="p-3 bg-red-50 rounded-xl">
                            <div className="flex items-center justify-between">
                              <span className="font-medium text-gray-900">{item.food}</span>
                              <span className="text-xs text-green-600">Try: {item.alternative}</span>
                            </div>
                            <p className="text-xs text-gray-600">{item.reason}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Exercise Plan */}
            {predictions.exercisePlan && (
              <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <FaDumbbell className="text-orange-500" />
                  Exercise Plan
                </h3>
                <p className="text-gray-600 mb-4">{predictions.exercisePlan.overview}</p>

                <div className="p-4 bg-orange-50 rounded-2xl mb-6 text-center">
                  <p className="text-sm text-gray-500">Weekly Goal</p>
                  <p className="text-2xl font-bold text-orange-600">{predictions.exercisePlan.weeklyGoal}</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Cardio */}
                  {predictions.exercisePlan.cardioRecommendations && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <FaWalking className="text-blue-500" />
                        Cardio Exercises
                      </h4>
                      <div className="space-y-2">
                        {predictions.exercisePlan.cardioRecommendations.map((ex, i) => (
                          <div key={i} className="p-3 bg-blue-50 rounded-xl">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-medium text-gray-900">{ex.activity}</span>
                              <span className={`text-xs px-2 py-0.5 rounded-full ${
                                ex.intensity === 'Vigorous' ? 'bg-red-100 text-red-700' :
                                ex.intensity === 'Moderate' ? 'bg-amber-100 text-amber-700' :
                                'bg-green-100 text-green-700'
                              }`}>
                                {ex.intensity}
                              </span>
                            </div>
                            <p className="text-xs text-gray-600">{ex.duration} • {ex.frequency}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Strength */}
                  {predictions.exercisePlan.strengthRecommendations && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <MdFitnessCenter className="text-purple-500" />
                        Strength Training
                      </h4>
                      <div className="space-y-2">
                        {predictions.exercisePlan.strengthRecommendations.map((ex, i) => (
                          <div key={i} className="p-3 bg-purple-50 rounded-xl">
                            <span className="font-medium text-gray-900">{ex.activity}</span>
                            <p className="text-xs text-gray-600">{ex.duration} • {ex.frequency}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {predictions.exercisePlan.warningsAndLimitations && predictions.exercisePlan.warningsAndLimitations.length > 0 && (
                  <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-xl">
                    <p className="text-sm font-medium text-amber-800 mb-2">Important Notes:</p>
                    <ul className="space-y-1">
                      {predictions.exercisePlan.warningsAndLimitations.map((warning, i) => (
                        <li key={i} className="text-xs text-amber-700 flex items-start gap-2">
                          <FaExclamationTriangle className="mt-0.5 flex-shrink-0" />
                          {warning}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Sleep & Stress Management */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Sleep Recommendations */}
              {predictions.sleepRecommendations && (
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <GiNightSleep className="text-indigo-500" />
                    Sleep Recommendations
                  </h3>
                  <div className="p-4 bg-indigo-50 rounded-2xl mb-4 text-center">
                    <p className="text-sm text-gray-500">Optimal Sleep</p>
                    <p className="text-2xl font-bold text-indigo-600">{predictions.sleepRecommendations.optimalHours}</p>
                  </div>
                  {predictions.sleepRecommendations.sleepHygieneTips && (
                    <div className="space-y-2">
                      {predictions.sleepRecommendations.sleepHygieneTips.map((tip, i) => (
                        <div key={i} className="flex items-start gap-2 text-sm text-gray-600">
                          <FaCheckCircle className="text-indigo-500 mt-0.5 flex-shrink-0" />
                          {tip}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Stress Management */}
              {predictions.stressManagement && (
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <GiMeditation className="text-pink-500" />
                    Stress Management
                  </h3>
                  {predictions.stressManagement.techniques && (
                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">Techniques:</p>
                      <div className="flex flex-wrap gap-2">
                        {predictions.stressManagement.techniques.map((tech, i) => (
                          <span key={i} className="px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-sm">{tech}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  {predictions.stressManagement.dailyPractices && (
                    <div className="space-y-2">
                      {predictions.stressManagement.dailyPractices.map((practice, i) => (
                        <div key={i} className="flex items-start gap-2 text-sm text-gray-600">
                          <FaCheckCircle className="text-pink-500 mt-0.5 flex-shrink-0" />
                          {practice}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Health Goals */}
            {predictions.healthGoals && (
              <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <FaBullseye className="text-teal-500" />
                  Health Goals
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Short-term Goals */}
                  {predictions.healthGoals.shortTerm && predictions.healthGoals.shortTerm.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <FaStopwatch className="text-amber-500" />
                        30-Day Goals
                      </h4>
                      <div className="space-y-3">
                        {predictions.healthGoals.shortTerm.map((goal, i) => (
                          <div key={i} className="p-4 bg-amber-50 rounded-xl">
                            <p className="font-medium text-gray-900 mb-2">{goal.goal}</p>
                            {goal.actionSteps && (
                              <ul className="space-y-1">
                                {goal.actionSteps.map((step, j) => (
                                  <li key={j} className="text-xs text-gray-600 flex items-start gap-2">
                                    <FaArrowRight className="text-amber-500 mt-0.5 flex-shrink-0" />
                                    {step}
                                  </li>
                                ))}
                              </ul>
                            )}
                            {goal.measurableTarget && (
                              <p className="text-xs text-amber-600 mt-2">Target: {goal.measurableTarget}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Long-term Goals */}
                  {predictions.healthGoals.longTerm && predictions.healthGoals.longTerm.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <FaCalendarAlt className="text-teal-500" />
                        6-12 Month Goals
                      </h4>
                      <div className="space-y-3">
                        {predictions.healthGoals.longTerm.map((goal, i) => (
                          <div key={i} className="p-4 bg-teal-50 rounded-xl">
                            <p className="font-medium text-gray-900 mb-2">{goal.goal}</p>
                            {goal.actionSteps && (
                              <ul className="space-y-1">
                                {goal.actionSteps.map((step, j) => (
                                  <li key={j} className="text-xs text-gray-600 flex items-start gap-2">
                                    <FaArrowRight className="text-teal-500 mt-0.5 flex-shrink-0" />
                                    {step}
                                  </li>
                                ))}
                              </ul>
                            )}
                            {goal.expectedOutcome && (
                              <p className="text-xs text-teal-600 mt-2">Expected: {goal.expectedOutcome}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Recommended Screenings */}
            {predictions.recommendedScreenings && predictions.recommendedScreenings.length > 0 && (
              <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <GiStethoscope className="text-teal-500" />
                  Recommended Screenings
                </h3>
                <div className="grid md:grid-cols-3 gap-4">
                  {predictions.recommendedScreenings.map((screening, index) => (
                    <div key={index} className="p-4 bg-teal-50 rounded-2xl">
                      <div className="flex items-start justify-between mb-1">
                        <h4 className="font-semibold text-gray-900">{screening.name}</h4>
                        {screening.priority && (
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            screening.priority === 'high' ? 'bg-red-100 text-red-700' :
                            screening.priority === 'medium' ? 'bg-amber-100 text-amber-700' :
                            'bg-green-100 text-green-700'
                          }`}>
                            {screening.priority}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-teal-600">{screening.frequency}</p>
                      <p className="text-sm text-gray-600 mt-1">{screening.reason}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Next Steps */}
            {predictions.nextSteps && predictions.nextSteps.length > 0 && (
              <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-3xl p-6 text-white">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <FaArrowRight />
                  Recommended Next Steps
                </h3>
                <div className="grid md:grid-cols-2 gap-3">
                  {predictions.nextSteps.map((step, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-white/20 rounded-xl">
                      <span className="w-6 h-6 rounded-full bg-white text-purple-600 flex items-center justify-center font-bold text-sm flex-shrink-0">
                        {index + 1}
                      </span>
                      <div>
                        <span className="font-medium">
                          {typeof step === 'object' ? step.action : step}
                        </span>
                        {typeof step === 'object' && step.timeline && (
                          <p className="text-white/70 text-xs mt-1">{step.timeline}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex gap-3">
                  <Link
                    to="/doctors"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-white text-purple-600 rounded-xl hover:bg-gray-100 transition font-medium"
                  >
                    <FaUserMd />
                    Find a Doctor
                  </Link>
                  <Link
                    to="/ai/symptom-checker"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 rounded-xl hover:bg-white/30 transition font-medium"
                  >
                    <FaClipboardList />
                    Check Symptoms
                  </Link>
                </div>
              </div>
            )}

            {/* Disclaimer */}
            {predictions.disclaimer && (
              <div className="p-4 bg-gray-100 rounded-2xl">
                <p className="text-gray-600 text-sm flex items-start gap-2">
                  <FaShieldAlt className="text-gray-400 mt-0.5 flex-shrink-0" />
                  {predictions.disclaimer}
                </p>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default HealthPredictions;
