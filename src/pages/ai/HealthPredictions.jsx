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
} from "react-icons/fa";
import { HiSparkles } from "react-icons/hi";
import { MdHealthAndSafety, MdTrendingUp } from "react-icons/md";
import { GiMedicines, GiStethoscope } from "react-icons/gi";

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
                  </div>
                  <div className="w-32 h-32 rounded-full bg-white/20 flex items-center justify-center">
                    <MdHealthAndSafety className="text-6xl" />
                  </div>
                </div>
              </div>
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
                      <li key={index} className="flex items-start gap-2 p-2 bg-green-50 rounded-xl">
                        <FaArrowUp className="text-green-500 mt-1 flex-shrink-0" />
                        <span className="text-gray-700">{factor}</span>
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
                      <div key={index} className="p-3 bg-amber-50 rounded-xl">
                        <p className="font-medium text-gray-900">{area.area}</p>
                        <p className="text-sm text-gray-600">{area.recommendation}</p>
                        {area.impact && (
                          <p className="text-xs text-amber-600 mt-1">Impact: {area.impact}</p>
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
                      <h4 className="font-semibold text-gray-900">{screening.name}</h4>
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
                      <span>{step}</span>
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
