import { useState, useEffect, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AuthContext } from "../../contexts/AuthContext";
import { Link } from "react-router";
import {
  FaHeartbeat,
  FaAppleAlt,
  FaRunning,
  FaBed,
  FaBrain,
  FaWater,
  FaSun,
  FaMoon,
  FaLeaf,
  FaSmile,
  FaQuoteLeft,
  FaSyncAlt,
  FaCheckCircle,
  FaLightbulb,
  FaCalendarCheck,
  FaChevronRight,
  FaSpinner,
  FaInfoCircle,
  FaBookmark,
  FaShare,
  FaClock,
} from "react-icons/fa";
import { HiSparkles } from "react-icons/hi";
import { MdHealthAndSafety, MdSelfImprovement, MdFitnessCenter } from "react-icons/md";
import { GiMeditation, GiFruitBowl, GiNightSleep } from "react-icons/gi";

const categoryIcons = {
  nutrition: FaAppleAlt,
  exercise: FaRunning,
  mentalHealth: FaBrain,
  sleep: FaBed
};

const categoryColors = {
  nutrition: { bg: "bg-green-100", text: "text-green-600", gradient: "from-green-500 to-emerald-600" },
  exercise: { bg: "bg-blue-100", text: "text-blue-600", gradient: "from-blue-500 to-cyan-600" },
  mentalHealth: { bg: "bg-purple-100", text: "text-purple-600", gradient: "from-purple-500 to-pink-600" },
  sleep: { bg: "bg-indigo-100", text: "text-indigo-600", gradient: "from-indigo-500 to-violet-600" }
};

const WellnessTips = () => {
  const { apiCall, user, dbUser, loading: authLoading } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [wellness, setWellness] = useState(null);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [savedTips, setSavedTips] = useState([]);

  useEffect(() => {
    if (user) {
      fetchWellness();
      // Load saved tips from localStorage
      const saved = localStorage.getItem("savedWellnessTips");
      if (saved) {
        setSavedTips(JSON.parse(saved));
      }
    }
  }, [user]);

  const fetchWellness = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiCall("/ai/wellness");
      if (response.success) {
        setWellness(response.data);
      } else {
        setError(response.message || "Failed to get wellness tips");
      }
    } catch (err) {
      setError(err.message || "Failed to load wellness recommendations");
    } finally {
      setLoading(false);
    }
  };

  const saveTip = (tip, category) => {
    const newTip = {
      id: Date.now(),
      tip,
      category,
      savedAt: new Date().toISOString()
    };
    const updated = [...savedTips, newTip];
    setSavedTips(updated);
    localStorage.setItem("savedWellnessTips", JSON.stringify(updated));
  };

  const removeSavedTip = (id) => {
    const updated = savedTips.filter(t => t.id !== id);
    setSavedTips(updated);
    localStorage.setItem("savedWellnessTips", JSON.stringify(updated));
  };

  const isTipSaved = (tip) => {
    return savedTips.some(t => t.tip === tip);
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full border-4 border-teal-100 border-t-teal-500 animate-spin mx-auto" />
          <p className="mt-4 text-gray-600">Loading wellness tips...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-lg p-8 text-center max-w-md">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaLeaf className="text-4xl text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Login Required</h2>
          <p className="text-gray-500 mb-6">Please sign in to access personalized wellness tips.</p>
          <Link
            to="/signin"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 transition font-medium"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50/30 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                <FaLeaf className="text-3xl text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                  Wellness Tips
                  <HiSparkles className="text-amber-500" />
                </h1>
                <p className="text-gray-600">
                  Personalized daily wellness recommendations
                </p>
              </div>
            </div>
            <button
              onClick={fetchWellness}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2.5 bg-green-100 text-green-700 rounded-xl hover:bg-green-200 transition"
            >
              <FaSyncAlt className={loading ? "animate-spin" : ""} />
              Refresh Tips
            </button>
          </div>
        </motion.div>

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl"
          >
            <p className="text-red-700">{error}</p>
          </motion.div>
        )}

        {wellness && (
          <div className="space-y-8">
            {/* Daily Tip Banner */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-3xl p-8 text-white overflow-hidden relative"
            >
              <div className="absolute right-0 top-0 opacity-10">
                <FaSun className="text-[200px] -mt-10 -mr-10" />
              </div>
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4">
                  <FaLightbulb className="text-amber-300 text-xl" />
                  <span className="text-white/80 font-medium">Tip of the Day</span>
                </div>
                <p className="text-2xl md:text-3xl font-medium leading-relaxed max-w-3xl">
                  {wellness.dailyTip}
                </p>
                <div className="mt-6 flex items-center gap-4">
                  <button
                    onClick={() => saveTip(wellness.dailyTip, 'daily')}
                    disabled={isTipSaved(wellness.dailyTip)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl transition ${
                      isTipSaved(wellness.dailyTip)
                        ? "bg-white/30 cursor-not-allowed"
                        : "bg-white/20 hover:bg-white/30"
                    }`}
                  >
                    <FaBookmark />
                    {isTipSaved(wellness.dailyTip) ? "Saved" : "Save Tip"}
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Category Cards */}
            {wellness.categories && (
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {Object.entries(wellness.categories).map(([key, category], index) => {
                  const IconComponent = categoryIcons[key] || FaHeartbeat;
                  const colors = categoryColors[key] || categoryColors.nutrition;

                  return (
                    <motion.div
                      key={key}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden cursor-pointer hover:shadow-md transition ${
                        selectedCategory === key ? "ring-2 ring-green-500" : ""
                      }`}
                      onClick={() => setSelectedCategory(selectedCategory === key ? null : key)}
                    >
                      <div className={`bg-gradient-to-r ${colors.gradient} p-4`}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                              <IconComponent className="text-xl text-white" />
                            </div>
                            <h3 className="font-bold text-white">{category.title}</h3>
                          </div>
                          <FaChevronRight className={`text-white transition-transform ${selectedCategory === key ? "rotate-90" : ""}`} />
                        </div>
                      </div>

                      <div className="p-4">
                        <ul className="space-y-2">
                          {(category.tips || []).slice(0, 2).map((tip, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                              <FaCheckCircle className="text-green-500 mt-0.5 flex-shrink-0" />
                              <span className="line-clamp-2">{tip}</span>
                            </li>
                          ))}
                        </ul>

                        {category.tips && category.tips.length > 2 && (
                          <p className="text-xs text-gray-400 mt-2">
                            +{category.tips.length - 2} more tips
                          </p>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}

            {/* Expanded Category */}
            <AnimatePresence>
              {selectedCategory && wellness.categories && wellness.categories[selectedCategory] && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 overflow-hidden"
                >
                  {(() => {
                    const category = wellness.categories[selectedCategory];
                    const colors = categoryColors[selectedCategory];
                    const IconComponent = categoryIcons[selectedCategory];

                    return (
                      <>
                        <div className="flex items-center gap-3 mb-6">
                          <div className={`w-12 h-12 rounded-xl ${colors.bg} flex items-center justify-center`}>
                            <IconComponent className={`text-2xl ${colors.text}`} />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-gray-900">{category.title}</h3>
                            <p className="text-gray-500 text-sm">All tips and recommendations</p>
                          </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                          {/* Tips */}
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-3">Tips</h4>
                            <ul className="space-y-2">
                              {(category.tips || []).map((tip, i) => (
                                <li key={i} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl group">
                                  <FaCheckCircle className={`${colors.text} mt-0.5 flex-shrink-0`} />
                                  <span className="text-gray-700 flex-1">{tip}</span>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      saveTip(tip, selectedCategory);
                                    }}
                                    disabled={isTipSaved(tip)}
                                    className={`opacity-0 group-hover:opacity-100 transition ${
                                      isTipSaved(tip) ? "text-green-500" : "text-gray-400 hover:text-green-500"
                                    }`}
                                  >
                                    <FaBookmark />
                                  </button>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Additional Info */}
                          <div className="space-y-4">
                            {selectedCategory === "nutrition" && category.mealSuggestion && (
                              <div className={`p-4 ${colors.bg} rounded-2xl`}>
                                <div className="flex items-center gap-2 mb-2">
                                  <GiFruitBowl className={colors.text} />
                                  <span className="font-medium text-gray-900">Meal Suggestion</span>
                                </div>
                                <p className="text-gray-700">{category.mealSuggestion}</p>
                              </div>
                            )}

                            {selectedCategory === "nutrition" && category.hydrationReminder && (
                              <div className="p-4 bg-blue-50 rounded-2xl">
                                <div className="flex items-center gap-2 mb-2">
                                  <FaWater className="text-blue-500" />
                                  <span className="font-medium text-gray-900">Hydration</span>
                                </div>
                                <p className="text-gray-700">{category.hydrationReminder}</p>
                              </div>
                            )}

                            {selectedCategory === "exercise" && category.workoutSuggestion && (
                              <div className={`p-4 ${colors.bg} rounded-2xl`}>
                                <div className="flex items-center gap-2 mb-2">
                                  <MdFitnessCenter className={colors.text} />
                                  <span className="font-medium text-gray-900">Today's Workout</span>
                                </div>
                                <p className="text-gray-700">{category.workoutSuggestion}</p>
                                {category.duration && (
                                  <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                                    <FaClock /> {category.duration}
                                  </p>
                                )}
                              </div>
                            )}

                            {selectedCategory === "mentalHealth" && (
                              <>
                                {category.mindfulnessExercise && (
                                  <div className={`p-4 ${colors.bg} rounded-2xl`}>
                                    <div className="flex items-center gap-2 mb-2">
                                      <GiMeditation className={colors.text} />
                                      <span className="font-medium text-gray-900">Mindfulness</span>
                                    </div>
                                    <p className="text-gray-700">{category.mindfulnessExercise}</p>
                                  </div>
                                )}
                                {category.affirmation && (
                                  <div className="p-4 bg-pink-50 rounded-2xl">
                                    <div className="flex items-center gap-2 mb-2">
                                      <FaSmile className="text-pink-500" />
                                      <span className="font-medium text-gray-900">Daily Affirmation</span>
                                    </div>
                                    <p className="text-gray-700 italic">"{category.affirmation}"</p>
                                  </div>
                                )}
                              </>
                            )}

                            {selectedCategory === "sleep" && category.bedtimeRoutine && (
                              <div className={`p-4 ${colors.bg} rounded-2xl`}>
                                <div className="flex items-center gap-2 mb-2">
                                  <GiNightSleep className={colors.text} />
                                  <span className="font-medium text-gray-900">Bedtime Routine</span>
                                </div>
                                <p className="text-gray-700">{category.bedtimeRoutine}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </>
                    );
                  })()}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Weekly Goals */}
            {wellness.weeklyGoals && wellness.weeklyGoals.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6"
              >
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <FaCalendarCheck className="text-teal-500" />
                  Weekly Goals
                </h3>
                <div className="grid md:grid-cols-3 gap-4">
                  {wellness.weeklyGoals.map((goal, index) => (
                    <div key={index} className="p-4 bg-teal-50 rounded-2xl">
                      <h4 className="font-semibold text-gray-900 mb-2">{goal.goal}</h4>
                      {goal.steps && (
                        <ul className="space-y-1 mb-2">
                          {goal.steps.map((step, i) => (
                            <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                              <span className="w-5 h-5 rounded-full bg-teal-200 text-teal-700 flex items-center justify-center text-xs font-medium flex-shrink-0">
                                {i + 1}
                              </span>
                              {step}
                            </li>
                          ))}
                        </ul>
                      )}
                      {goal.benefit && (
                        <p className="text-xs text-teal-600 mt-2 flex items-start gap-1">
                          <FaInfoCircle className="mt-0.5 flex-shrink-0" />
                          {goal.benefit}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Motivational Quote & Health Fact */}
            <div className="grid md:grid-cols-2 gap-6">
              {wellness.motivationalQuote && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-gradient-to-br from-amber-100 to-orange-100 rounded-3xl p-6"
                >
                  <FaQuoteLeft className="text-amber-400 text-3xl mb-4" />
                  <p className="text-xl font-medium text-gray-800 italic mb-4">
                    "{wellness.motivationalQuote}"
                  </p>
                  <p className="text-amber-600 text-sm">Daily Motivation</p>
                </motion.div>
              )}

              {wellness.healthFact && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-gradient-to-br from-blue-100 to-cyan-100 rounded-3xl p-6"
                >
                  <div className="w-12 h-12 rounded-xl bg-blue-200 flex items-center justify-center mb-4">
                    <FaLightbulb className="text-blue-600 text-xl" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Did You Know?</h4>
                  <p className="text-gray-700">{wellness.healthFact}</p>
                </motion.div>
              )}
            </div>

            {/* Saved Tips */}
            {savedTips.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6"
              >
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <FaBookmark className="text-green-500" />
                  Saved Tips ({savedTips.length})
                </h3>
                <div className="grid md:grid-cols-2 gap-3">
                  {savedTips.map((saved) => (
                    <div key={saved.id} className="flex items-start gap-3 p-3 bg-green-50 rounded-xl group">
                      <FaCheckCircle className="text-green-500 mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-gray-700 text-sm">{saved.tip}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          Saved {new Date(saved.savedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <button
                        onClick={() => removeSavedTip(saved.id)}
                        className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-500 transition"
                      >
                        <FaBookmark />
                      </button>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Quick Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-3xl p-6 text-white"
            >
              <h3 className="text-lg font-bold mb-4">Explore More Health Tools</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <Link
                  to="/ai/symptom-checker"
                  className="flex items-center gap-3 p-4 bg-white/20 rounded-xl hover:bg-white/30 transition"
                >
                  <MdHealthAndSafety className="text-2xl" />
                  <div>
                    <p className="font-medium">Symptom Checker</p>
                    <p className="text-white/70 text-sm">AI health analysis</p>
                  </div>
                </Link>
                <Link
                  to="/ai/predictions"
                  className="flex items-center gap-3 p-4 bg-white/20 rounded-xl hover:bg-white/30 transition"
                >
                  <FaHeartbeat className="text-2xl" />
                  <div>
                    <p className="font-medium">Health Predictions</p>
                    <p className="text-white/70 text-sm">Risk assessment</p>
                  </div>
                </Link>
                <Link
                  to="/ai/alerts"
                  className="flex items-center gap-3 p-4 bg-white/20 rounded-xl hover:bg-white/30 transition"
                >
                  <FaInfoCircle className="text-2xl" />
                  <div>
                    <p className="font-medium">Health Alerts</p>
                    <p className="text-white/70 text-sm">Important reminders</p>
                  </div>
                </Link>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WellnessTips;
