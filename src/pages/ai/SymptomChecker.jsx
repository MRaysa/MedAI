import { useState, useEffect, useContext, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AuthContext } from "../../contexts/AuthContext";
import { Link } from "react-router";
import {
  FaStethoscope,
  FaSearch,
  FaPaperPlane,
  FaHistory,
  FaExclamationTriangle,
  FaCheckCircle,
  FaInfoCircle,
  FaTimes,
  FaPlus,
  FaTrash,
  FaChevronDown,
  FaChevronUp,
  FaUserMd,
  FaHeartbeat,
  FaNotesMedical,
  FaLightbulb,
  FaShieldAlt,
  FaClock,
  FaArrowRight,
  FaRobot,
  FaSpinner,
} from "react-icons/fa";
import { MdHealthAndSafety, MdLocalHospital } from "react-icons/md";
import { HiSparkles } from "react-icons/hi";

const commonSymptoms = [
  "Headache", "Fever", "Cough", "Fatigue", "Nausea",
  "Dizziness", "Chest pain", "Shortness of breath", "Back pain",
  "Sore throat", "Runny nose", "Body aches", "Chills",
  "Loss of appetite", "Insomnia", "Anxiety", "Joint pain",
  "Abdominal pain", "Diarrhea", "Vomiting"
];

const severityLevels = [
  { value: "mild", label: "Mild", color: "text-green-600", bg: "bg-green-100" },
  { value: "moderate", label: "Moderate", color: "text-amber-600", bg: "bg-amber-100" },
  { value: "severe", label: "Severe", color: "text-red-600", bg: "bg-red-100" }
];

const durationOptions = [
  "Less than 24 hours",
  "1-3 days",
  "4-7 days",
  "1-2 weeks",
  "More than 2 weeks"
];

const SymptomChecker = () => {
  const { apiCall, user, dbUser, loading: authLoading } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [symptoms, setSymptoms] = useState([]);
  const [customSymptom, setCustomSymptom] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [duration, setDuration] = useState("");
  const [severity, setSeverity] = useState("");
  const [medicalHistory, setMedicalHistory] = useState("");
  const [currentMedications, setCurrentMedications] = useState("");
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [error, setError] = useState(null);
  const resultRef = useRef(null);

  useEffect(() => {
    if (user && dbUser) {
      fetchHistory();
      // Pre-fill age and gender if available
      if (dbUser.dateOfBirth) {
        const birthDate = new Date(dbUser.dateOfBirth);
        const ageDiff = Date.now() - birthDate.getTime();
        const ageDate = new Date(ageDiff);
        setAge(Math.abs(ageDate.getUTCFullYear() - 1970).toString());
      }
      if (dbUser.gender) {
        setGender(dbUser.gender);
      }
    }
  }, [user, dbUser]);

  const fetchHistory = async () => {
    try {
      const response = await apiCall("/ai/symptom-checker/history?limit=5");
      if (response.success) {
        setHistory(response.data);
      }
    } catch (error) {
      console.error("Error fetching history:", error);
    }
  };

  const addSymptom = (symptom) => {
    if (!symptoms.includes(symptom)) {
      setSymptoms([...symptoms, symptom]);
    }
  };

  const removeSymptom = (symptom) => {
    setSymptoms(symptoms.filter(s => s !== symptom));
  };

  const addCustomSymptom = () => {
    if (customSymptom.trim() && !symptoms.includes(customSymptom.trim())) {
      setSymptoms([...symptoms, customSymptom.trim()]);
      setCustomSymptom("");
    }
  };

  const handleAnalyze = async () => {
    if (symptoms.length === 0) {
      setError("Please add at least one symptom");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await apiCall("/ai/symptom-checker", {
        method: "POST",
        body: JSON.stringify({
          symptoms,
          age: age || undefined,
          gender: gender || undefined,
          duration: duration || undefined,
          severity: severity || undefined,
          medicalHistory: medicalHistory || undefined,
          currentMedications: currentMedications || undefined
        })
      });

      if (response.success) {
        setResult(response.data);
        fetchHistory();
        // Scroll to results
        setTimeout(() => {
          resultRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);
      } else {
        setError(response.message || "Failed to analyze symptoms");
      }
    } catch (err) {
      setError(err.message || "Failed to analyze symptoms. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSymptoms([]);
    setCustomSymptom("");
    setDuration("");
    setSeverity("");
    setMedicalHistory("");
    setCurrentMedications("");
    setResult(null);
    setError(null);
  };

  const getUrgencyConfig = (level) => {
    const configs = {
      emergency: { bg: "bg-red-500", text: "text-white", label: "Emergency", icon: FaExclamationTriangle },
      urgent: { bg: "bg-orange-500", text: "text-white", label: "Urgent", icon: FaExclamationTriangle },
      moderate: { bg: "bg-amber-500", text: "text-white", label: "Moderate", icon: FaInfoCircle },
      low: { bg: "bg-green-500", text: "text-white", label: "Low", icon: FaCheckCircle }
    };
    return configs[level] || configs.moderate;
  };

  const getLikelihoodColor = (likelihood) => {
    const colors = {
      high: "text-red-600 bg-red-100",
      medium: "text-amber-600 bg-amber-100",
      low: "text-green-600 bg-green-100"
    };
    return colors[likelihood] || colors.medium;
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
          <div className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaStethoscope className="text-4xl text-teal-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Login Required</h2>
          <p className="text-gray-500 mb-6">Please sign in to use the AI Symptom Checker.</p>
          <Link
            to="/signin"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-500 to-emerald-600 text-white rounded-xl hover:from-teal-600 hover:to-emerald-700 transition font-medium"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-teal-50/30 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                <FaStethoscope className="text-3xl text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                  AI Symptom Checker
                  <HiSparkles className="text-amber-500" />
                </h1>
                <p className="text-gray-600">
                  Describe your symptoms for AI-powered health insights
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition"
            >
              <FaHistory className="text-gray-500" />
              <span className="text-gray-700">History</span>
            </button>
          </div>
        </motion.div>

        {/* Disclaimer Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-2xl"
        >
          <div className="flex items-start gap-3">
            <FaShieldAlt className="text-amber-500 text-xl flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-amber-800 font-medium">Important Disclaimer</p>
              <p className="text-amber-700 text-sm">
                This AI tool provides general health information only and is not a substitute for professional medical advice, diagnosis, or treatment. Always consult a qualified healthcare provider for medical concerns.
              </p>
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Symptom Selection */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6"
            >
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FaNotesMedical className="text-teal-500" />
                Select Your Symptoms
              </h2>

              {/* Selected Symptoms */}
              {symptoms.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm text-gray-500 mb-2">Selected symptoms:</p>
                  <div className="flex flex-wrap gap-2">
                    {symptoms.map((symptom, index) => (
                      <motion.span
                        key={index}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-teal-100 text-teal-700 rounded-full text-sm font-medium"
                      >
                        {symptom}
                        <button
                          onClick={() => removeSymptom(symptom)}
                          className="hover:bg-teal-200 rounded-full p-0.5"
                        >
                          <FaTimes className="text-xs" />
                        </button>
                      </motion.span>
                    ))}
                  </div>
                </div>
              )}

              {/* Common Symptoms Grid */}
              <p className="text-sm text-gray-500 mb-2">Common symptoms:</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {commonSymptoms.map((symptom) => (
                  <button
                    key={symptom}
                    onClick={() => addSymptom(symptom)}
                    disabled={symptoms.includes(symptom)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition ${
                      symptoms.includes(symptom)
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-gray-100 text-gray-700 hover:bg-teal-100 hover:text-teal-700"
                    }`}
                  >
                    {symptom}
                  </button>
                ))}
              </div>

              {/* Custom Symptom Input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customSymptom}
                  onChange={(e) => setCustomSymptom(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && addCustomSymptom()}
                  placeholder="Add other symptom..."
                  className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
                <button
                  onClick={addCustomSymptom}
                  className="px-4 py-2.5 bg-teal-500 text-white rounded-xl hover:bg-teal-600 transition"
                >
                  <FaPlus />
                </button>
              </div>
            </motion.div>

            {/* Basic Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6"
            >
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FaInfoCircle className="text-blue-500" />
                Basic Information
              </h2>

              <div className="grid md:grid-cols-2 gap-4">
                {/* Duration */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    How long have you had these symptoms?
                  </label>
                  <select
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  >
                    <option value="">Select duration</option>
                    {durationOptions.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>

                {/* Severity */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Severity level
                  </label>
                  <div className="flex gap-2">
                    {severityLevels.map((level) => (
                      <button
                        key={level.value}
                        onClick={() => setSeverity(level.value)}
                        className={`flex-1 px-3 py-2.5 rounded-xl font-medium text-sm transition ${
                          severity === level.value
                            ? `${level.bg} ${level.color}`
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        {level.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Age */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Age
                  </label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    placeholder="Enter your age"
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>

                {/* Gender */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gender
                  </label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              {/* Advanced Options Toggle */}
              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="mt-4 flex items-center gap-2 text-teal-600 hover:text-teal-700 text-sm font-medium"
              >
                {showAdvanced ? <FaChevronUp /> : <FaChevronDown />}
                {showAdvanced ? "Hide" : "Show"} advanced options
              </button>

              {/* Advanced Options */}
              <AnimatePresence>
                {showAdvanced && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="grid md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-100">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Medical History
                        </label>
                        <textarea
                          value={medicalHistory}
                          onChange={(e) => setMedicalHistory(e.target.value)}
                          placeholder="Any relevant medical conditions..."
                          rows={3}
                          className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Current Medications
                        </label>
                        <textarea
                          value={currentMedications}
                          onChange={(e) => setCurrentMedications(e.target.value)}
                          placeholder="List any medications you're taking..."
                          rows={3}
                          className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-red-50 border border-red-200 rounded-2xl"
              >
                <p className="text-red-700 flex items-center gap-2">
                  <FaExclamationTriangle />
                  {error}
                </p>
              </motion.div>
            )}

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex gap-4"
            >
              <button
                onClick={handleAnalyze}
                disabled={loading || symptoms.length === 0}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-teal-500 to-emerald-600 text-white rounded-2xl hover:from-teal-600 hover:to-emerald-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <FaRobot />
                    Analyze Symptoms
                  </>
                )}
              </button>
              <button
                onClick={resetForm}
                className="px-6 py-4 bg-gray-100 text-gray-700 rounded-2xl hover:bg-gray-200 transition font-medium"
              >
                Reset
              </button>
            </motion.div>

            {/* Results */}
            {result && (
              <motion.div
                ref={resultRef}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Urgency Banner */}
                {result.urgencyLevel && (
                  <div className={`${getUrgencyConfig(result.urgencyLevel).bg} rounded-2xl p-6`}>
                    <div className="flex items-start gap-4">
                      {(() => {
                        const UrgencyIcon = getUrgencyConfig(result.urgencyLevel).icon;
                        return <UrgencyIcon className="text-3xl text-white flex-shrink-0" />;
                      })()}
                      <div>
                        <h3 className="text-xl font-bold text-white">
                          Urgency: {getUrgencyConfig(result.urgencyLevel).label}
                        </h3>
                        <p className="text-white/90 mt-1">{result.urgencyExplanation}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Summary */}
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <FaLightbulb className="text-amber-500" />
                    Analysis Summary
                  </h3>
                  <p className="text-gray-700">{result.summary}</p>
                </div>

                {/* Possible Conditions */}
                {result.possibleConditions && result.possibleConditions.length > 0 && (
                  <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <MdHealthAndSafety className="text-blue-500" />
                      Possible Conditions
                    </h3>
                    <div className="space-y-4">
                      {result.possibleConditions.map((condition, index) => (
                        <div key={index} className="p-4 bg-gray-50 rounded-2xl">
                          <div className="flex items-start justify-between">
                            <h4 className="font-semibold text-gray-900">{condition.name}</h4>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLikelihoodColor(condition.likelihood)}`}>
                              {condition.likelihood} likelihood
                            </span>
                          </div>
                          <p className="text-gray-600 text-sm mt-2">{condition.description}</p>
                          {condition.commonSymptoms && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {condition.commonSymptoms.map((sym, i) => (
                                <span key={i} className="px-2 py-0.5 bg-gray-200 text-gray-600 rounded text-xs">
                                  {sym}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recommendations */}
                {result.recommendations && result.recommendations.length > 0 && (
                  <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <FaCheckCircle className="text-green-500" />
                      Recommendations
                    </h3>
                    <ul className="space-y-2">
                      {result.recommendations.map((rec, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <FaArrowRight className="text-teal-500 mt-1 flex-shrink-0" />
                          <span className="text-gray-700">{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Self-Care Tips */}
                {result.selfCareTips && result.selfCareTips.length > 0 && (
                  <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <FaHeartbeat className="text-pink-500" />
                      Self-Care Tips
                    </h3>
                    <ul className="grid md:grid-cols-2 gap-3">
                      {result.selfCareTips.map((tip, index) => (
                        <li key={index} className="flex items-start gap-2 p-3 bg-pink-50 rounded-xl">
                          <FaCheckCircle className="text-pink-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700 text-sm">{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* When to See Doctor */}
                {result.whenToSeeDoctor && (
                  <div className="bg-blue-50 rounded-3xl border border-blue-200 p-6">
                    <h3 className="text-lg font-bold text-blue-900 mb-3 flex items-center gap-2">
                      <FaUserMd className="text-blue-500" />
                      When to See a Doctor
                    </h3>
                    <p className="text-blue-800">{result.whenToSeeDoctor}</p>
                    <Link
                      to="/doctors"
                      className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition font-medium"
                    >
                      Find a Doctor
                      <FaArrowRight />
                    </Link>
                  </div>
                )}

                {/* Disclaimer */}
                {result.disclaimer && (
                  <div className="p-4 bg-gray-100 rounded-2xl">
                    <p className="text-gray-600 text-sm flex items-start gap-2">
                      <FaShieldAlt className="text-gray-400 mt-0.5 flex-shrink-0" />
                      {result.disclaimer}
                    </p>
                  </div>
                )}
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* How It Works */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6"
            >
              <h3 className="text-lg font-bold text-gray-900 mb-4">How It Works</h3>
              <div className="space-y-4">
                {[
                  { step: 1, title: "Select Symptoms", desc: "Choose or type your symptoms" },
                  { step: 2, title: "Add Details", desc: "Provide duration and severity" },
                  { step: 3, title: "Get Insights", desc: "AI analyzes and provides guidance" }
                ].map((item) => (
                  <div key={item.step} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center font-bold text-sm">
                      {item.step}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{item.title}</p>
                      <p className="text-sm text-gray-500">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* History Panel */}
            <AnimatePresence>
              {showHistory && history.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6"
                >
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <FaHistory className="text-gray-500" />
                    Recent Checks
                  </h3>
                  <div className="space-y-3">
                    {history.map((item, index) => (
                      <div
                        key={index}
                        className="p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition"
                        onClick={() => setResult(item.result)}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <FaClock className="text-gray-400 text-xs" />
                          <span className="text-xs text-gray-500">
                            {new Date(item.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {item.input.symptoms.slice(0, 3).map((sym, i) => (
                            <span key={i} className="px-2 py-0.5 bg-gray-200 text-gray-600 rounded text-xs">
                              {sym}
                            </span>
                          ))}
                          {item.input.symptoms.length > 3 && (
                            <span className="text-xs text-gray-500">
                              +{item.input.symptoms.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Quick Links */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gradient-to-br from-teal-500 to-emerald-600 rounded-3xl p-6 text-white"
            >
              <h3 className="text-lg font-bold mb-4">Need Help?</h3>
              <div className="space-y-3">
                <Link
                  to="/doctors"
                  className="flex items-center gap-3 p-3 bg-white/20 rounded-xl hover:bg-white/30 transition"
                >
                  <FaUserMd />
                  <span>Find a Doctor</span>
                </Link>
                <Link
                  to="/ai/wellness"
                  className="flex items-center gap-3 p-3 bg-white/20 rounded-xl hover:bg-white/30 transition"
                >
                  <FaHeartbeat />
                  <span>Wellness Tips</span>
                </Link>
                <Link
                  to="/ai/alerts"
                  className="flex items-center gap-3 p-3 bg-white/20 rounded-xl hover:bg-white/30 transition"
                >
                  <MdLocalHospital />
                  <span>Health Alerts</span>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SymptomChecker;
