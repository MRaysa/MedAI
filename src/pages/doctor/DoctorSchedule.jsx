import { useState, useEffect, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AuthContext } from "../../contexts/AuthContext";
import {
  FaCalendarAlt,
  FaClock,
  FaPlus,
  FaTrash,
  FaSave,
  FaUmbrellaBeach,
  FaExclamationTriangle,
  FaCheck,
  FaTimes,
  FaChevronLeft,
  FaChevronRight,
  FaUserMd,
  FaCalendarCheck,
  FaCalendarTimes,
  FaEdit,
  FaRegClock,
} from "react-icons/fa";
import { MdSchedule, MdEventBusy, MdToday } from "react-icons/md";
import { BsCalendar3, BsClockHistory } from "react-icons/bs";

const DoctorSchedule = () => {
  const { apiCall, dbUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [schedule, setSchedule] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [consultationSettings, setConsultationSettings] = useState(null);
  const [activeTab, setActiveTab] = useState("weekly");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showVacationModal, setShowVacationModal] = useState(false);
  const [showExceptionModal, setShowExceptionModal] = useState(false);

  // Days of the week
  const daysOfWeek = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
  const dayLabels = {
    monday: "Monday",
    tuesday: "Tuesday",
    wednesday: "Wednesday",
    thursday: "Thursday",
    friday: "Friday",
    saturday: "Saturday",
    sunday: "Sunday",
  };

  useEffect(() => {
    fetchSchedule();
  }, []);

  const fetchSchedule = async () => {
    setLoading(true);
    try {
      const response = await apiCall("/doctors/me/schedule");
      if (response.success) {
        setSchedule(response.data.availability?.schedule || getDefaultSchedule());
        setAppointments(response.data.appointments || []);
        setConsultationSettings(response.data.consultationSettings || {});
      }
    } catch (error) {
      console.error("Error fetching schedule:", error);
    } finally {
      setLoading(false);
    }
  };

  const getDefaultSchedule = () => ({
    monday: { isAvailable: true, slots: [{ start: "09:00", end: "17:00" }] },
    tuesday: { isAvailable: true, slots: [{ start: "09:00", end: "17:00" }] },
    wednesday: { isAvailable: true, slots: [{ start: "09:00", end: "17:00" }] },
    thursday: { isAvailable: true, slots: [{ start: "09:00", end: "17:00" }] },
    friday: { isAvailable: true, slots: [{ start: "09:00", end: "17:00" }] },
    saturday: { isAvailable: false, slots: [] },
    sunday: { isAvailable: false, slots: [] },
  });

  const handleDayToggle = (day) => {
    setSchedule((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        isAvailable: !prev[day].isAvailable,
        slots: !prev[day].isAvailable ? [{ start: "09:00", end: "17:00" }] : [],
      },
    }));
  };

  const handleSlotChange = (day, slotIndex, field, value) => {
    setSchedule((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        slots: prev[day].slots.map((slot, idx) =>
          idx === slotIndex ? { ...slot, [field]: value } : slot
        ),
      },
    }));
  };

  const addSlot = (day) => {
    setSchedule((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        slots: [...prev[day].slots, { start: "09:00", end: "17:00" }],
      },
    }));
  };

  const removeSlot = (day, slotIndex) => {
    setSchedule((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        slots: prev[day].slots.filter((_, idx) => idx !== slotIndex),
      },
    }));
  };

  const saveSchedule = async () => {
    setSaving(true);
    try {
      const response = await apiCall("/doctors/me/availability", {
        method: "PUT",
        body: JSON.stringify({ schedule }),
      });
      if (response.success) {
        alert("Schedule saved successfully!");
      } else {
        alert(response.message || "Failed to save schedule");
      }
    } catch (error) {
      console.error("Error saving schedule:", error);
      alert("Failed to save schedule");
    } finally {
      setSaving(false);
    }
  };

  // Calendar navigation
  const getMonthDays = () => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days = [];

    // Add empty slots for days before the first day of the month
    for (let i = 0; i < firstDay.getDay(); i++) {
      days.push(null);
    }

    // Add all days of the month
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i));
    }

    return days;
  };

  const navigateMonth = (direction) => {
    setSelectedDate((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  const getAppointmentsForDate = (date) => {
    if (!date) return [];
    const dateStr = date.toISOString().split("T")[0];
    return appointments.filter((apt) => {
      const aptDate = new Date(apt.appointmentDate).toISOString().split("T")[0];
      return aptDate === dateStr;
    });
  };

  const formatTime = (time) => {
    if (!time) return "";
    const [hours, minutes] = time.split(":");
    const h = parseInt(hours);
    const ampm = h >= 12 ? "PM" : "AM";
    const hour12 = h % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  // Check if user is a doctor
  if (dbUser && dbUser.role !== "doctor") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-xl p-8 max-w-md text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaUserMd className="text-3xl text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">
            This page is only available for doctors. Please log in with a doctor account.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Schedule Management</h1>
          <p className="text-gray-600">Manage your availability and working hours</p>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-2 mb-6 inline-flex"
        >
          {[
            { id: "weekly", label: "Weekly Schedule", icon: MdSchedule },
            { id: "calendar", label: "Calendar View", icon: BsCalendar3 },
            { id: "vacation", label: "Time Off", icon: FaUmbrellaBeach },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition ${
                activeTab === tab.id
                  ? "bg-teal-500 text-white shadow-lg shadow-teal-500/25"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <tab.icon />
              {tab.label}
            </button>
          ))}
        </motion.div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full border-4 border-teal-100 border-t-teal-500 animate-spin mx-auto" />
              <p className="mt-4 text-gray-600">Loading schedule...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Weekly Schedule Tab */}
            {activeTab === "weekly" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                {/* Consultation Settings Summary */}
                {consultationSettings && (
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <BsClockHistory className="text-teal-500" />
                      Consultation Settings
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="p-4 bg-teal-50 rounded-xl">
                        <FaClock className="text-teal-500 mb-2" />
                        <div className="text-2xl font-bold text-gray-900">
                          {consultationSettings.defaultDuration || 30} min
                        </div>
                        <div className="text-sm text-gray-500">Session Duration</div>
                      </div>
                      <div className="p-4 bg-blue-50 rounded-xl">
                        <FaRegClock className="text-blue-500 mb-2" />
                        <div className="text-2xl font-bold text-gray-900">
                          {consultationSettings.bufferTime || 10} min
                        </div>
                        <div className="text-sm text-gray-500">Buffer Time</div>
                      </div>
                      <div className="p-4 bg-purple-50 rounded-xl">
                        <FaUserMd className="text-purple-500 mb-2" />
                        <div className="text-2xl font-bold text-gray-900">
                          {consultationSettings.maxPatientsPerDay || 20}
                        </div>
                        <div className="text-sm text-gray-500">Max Patients/Day</div>
                      </div>
                      <div className="p-4 bg-amber-50 rounded-xl">
                        <FaCalendarAlt className="text-amber-500 mb-2" />
                        <div className="text-2xl font-bold text-gray-900">
                          {consultationSettings.advanceBookingDays || 30} days
                        </div>
                        <div className="text-sm text-gray-500">Advance Booking</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Weekly Schedule */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      <MdSchedule className="text-teal-500" />
                      Weekly Working Hours
                    </h3>
                    <button
                      onClick={saveSchedule}
                      disabled={saving}
                      className="flex items-center gap-2 px-6 py-2.5 bg-teal-500 text-white rounded-xl hover:bg-teal-600 transition font-medium disabled:opacity-50"
                    >
                      {saving ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <FaSave />
                          Save Schedule
                        </>
                      )}
                    </button>
                  </div>

                  <div className="space-y-4">
                    {daysOfWeek.map((day) => (
                      <div
                        key={day}
                        className={`p-4 rounded-xl border-2 transition ${
                          schedule[day]?.isAvailable
                            ? "border-teal-200 bg-teal-50/50"
                            : "border-gray-200 bg-gray-50"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => handleDayToggle(day)}
                              className={`w-12 h-6 rounded-full transition relative ${
                                schedule[day]?.isAvailable ? "bg-teal-500" : "bg-gray-300"
                              }`}
                            >
                              <span
                                className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all ${
                                  schedule[day]?.isAvailable ? "left-7" : "left-1"
                                }`}
                              />
                            </button>
                            <span className="font-semibold text-gray-900">{dayLabels[day]}</span>
                          </div>
                          {schedule[day]?.isAvailable && (
                            <button
                              onClick={() => addSlot(day)}
                              className="flex items-center gap-1 px-3 py-1.5 text-teal-600 hover:bg-teal-100 rounded-lg text-sm font-medium transition"
                            >
                              <FaPlus className="text-xs" />
                              Add Slot
                            </button>
                          )}
                        </div>

                        {schedule[day]?.isAvailable ? (
                          <div className="space-y-2">
                            {schedule[day].slots.map((slot, slotIndex) => (
                              <div key={slotIndex} className="flex items-center gap-3">
                                <div className="flex items-center gap-2">
                                  <input
                                    type="time"
                                    value={slot.start}
                                    onChange={(e) =>
                                      handleSlotChange(day, slotIndex, "start", e.target.value)
                                    }
                                    className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                  />
                                  <span className="text-gray-500">to</span>
                                  <input
                                    type="time"
                                    value={slot.end}
                                    onChange={(e) =>
                                      handleSlotChange(day, slotIndex, "end", e.target.value)
                                    }
                                    className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                  />
                                </div>
                                <span className="text-sm text-gray-500">
                                  ({formatTime(slot.start)} - {formatTime(slot.end)})
                                </span>
                                {schedule[day].slots.length > 1 && (
                                  <button
                                    onClick={() => removeSlot(day, slotIndex)}
                                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                                  >
                                    <FaTrash className="text-sm" />
                                  </button>
                                )}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-gray-500 text-sm">Not available on this day</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Calendar View Tab */}
            {activeTab === "calendar" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  {/* Calendar Header */}
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-gray-900">
                      {selectedDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                    </h3>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => navigateMonth(-1)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition"
                      >
                        <FaChevronLeft />
                      </button>
                      <button
                        onClick={() => setSelectedDate(new Date())}
                        className="px-4 py-2 bg-teal-50 text-teal-600 rounded-lg font-medium hover:bg-teal-100 transition"
                      >
                        Today
                      </button>
                      <button
                        onClick={() => navigateMonth(1)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition"
                      >
                        <FaChevronRight />
                      </button>
                    </div>
                  </div>

                  {/* Calendar Grid */}
                  <div className="grid grid-cols-7 gap-2">
                    {/* Day Headers */}
                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                      <div
                        key={day}
                        className="text-center py-2 text-sm font-semibold text-gray-500"
                      >
                        {day}
                      </div>
                    ))}

                    {/* Calendar Days */}
                    {getMonthDays().map((date, index) => {
                      const dayAppointments = getAppointmentsForDate(date);
                      const isToday =
                        date && date.toDateString() === new Date().toDateString();
                      const dayName = date
                        ? daysOfWeek[date.getDay() === 0 ? 6 : date.getDay() - 1]
                        : null;
                      const isWorkingDay = dayName && schedule[dayName]?.isAvailable;

                      return (
                        <div
                          key={index}
                          className={`min-h-[100px] p-2 rounded-xl border-2 transition ${
                            !date
                              ? "border-transparent"
                              : isToday
                              ? "border-teal-500 bg-teal-50"
                              : isWorkingDay
                              ? "border-gray-200 hover:border-teal-300"
                              : "border-gray-100 bg-gray-50"
                          }`}
                        >
                          {date && (
                            <>
                              <div
                                className={`text-sm font-semibold mb-1 ${
                                  isToday ? "text-teal-600" : "text-gray-900"
                                }`}
                              >
                                {date.getDate()}
                              </div>
                              {dayAppointments.length > 0 && (
                                <div className="space-y-1">
                                  {dayAppointments.slice(0, 2).map((apt, idx) => (
                                    <div
                                      key={idx}
                                      className={`text-xs px-2 py-1 rounded truncate ${
                                        apt.status === "confirmed"
                                          ? "bg-blue-100 text-blue-700"
                                          : apt.status === "pending"
                                          ? "bg-amber-100 text-amber-700"
                                          : "bg-gray-100 text-gray-700"
                                      }`}
                                    >
                                      {apt.appointmentTime} - {apt.patientName?.split(" ")[0]}
                                    </div>
                                  ))}
                                  {dayAppointments.length > 2 && (
                                    <div className="text-xs text-gray-500 pl-2">
                                      +{dayAppointments.length - 2} more
                                    </div>
                                  )}
                                </div>
                              )}
                              {!isWorkingDay && dayAppointments.length === 0 && (
                                <span className="text-xs text-gray-400">Off</span>
                              )}
                            </>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Time Off Tab */}
            {activeTab === "vacation" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                {/* Vacation Section */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      <FaUmbrellaBeach className="text-amber-500" />
                      Vacation / Leave
                    </h3>
                    <button
                      onClick={() => setShowVacationModal(true)}
                      className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-xl hover:bg-amber-600 transition font-medium"
                    >
                      <FaPlus />
                      Add Vacation
                    </button>
                  </div>

                  <div className="text-center py-8 text-gray-500">
                    <FaUmbrellaBeach className="text-4xl text-gray-300 mx-auto mb-3" />
                    <p>No vacations scheduled</p>
                    <p className="text-sm">Add time off to block appointments during your vacation</p>
                  </div>
                </div>

                {/* Exceptions Section */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      <FaExclamationTriangle className="text-purple-500" />
                      Schedule Exceptions
                    </h3>
                    <button
                      onClick={() => setShowExceptionModal(true)}
                      className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-xl hover:bg-purple-600 transition font-medium"
                    >
                      <FaPlus />
                      Add Exception
                    </button>
                  </div>

                  <p className="text-gray-500 text-sm mb-4">
                    Add exceptions for specific dates when your schedule differs from the regular weekly schedule.
                  </p>

                  <div className="text-center py-8 text-gray-500">
                    <MdEventBusy className="text-4xl text-gray-300 mx-auto mb-3" />
                    <p>No exceptions added</p>
                    <p className="text-sm">Add special availability or unavailability for specific dates</p>
                  </div>
                </div>
              </motion.div>
            )}
          </>
        )}

        {/* Vacation Modal */}
        <AnimatePresence>
          {showVacationModal && (
            <VacationModal
              onClose={() => setShowVacationModal(false)}
              onSave={async (data) => {
                try {
                  const response = await apiCall("/doctors/me/vacation", {
                    method: "POST",
                    body: JSON.stringify(data),
                  });
                  if (response.success) {
                    setShowVacationModal(false);
                    fetchSchedule();
                  } else {
                    alert(response.message || "Failed to add vacation");
                  }
                } catch (error) {
                  console.error("Error adding vacation:", error);
                  alert("Failed to add vacation");
                }
              }}
            />
          )}
        </AnimatePresence>

        {/* Exception Modal */}
        <AnimatePresence>
          {showExceptionModal && (
            <ExceptionModal
              onClose={() => setShowExceptionModal(false)}
              onSave={async (data) => {
                try {
                  const response = await apiCall("/doctors/me/exception", {
                    method: "POST",
                    body: JSON.stringify(data),
                  });
                  if (response.success) {
                    setShowExceptionModal(false);
                    fetchSchedule();
                  } else {
                    alert(response.message || "Failed to add exception");
                  }
                } catch (error) {
                  console.error("Error adding exception:", error);
                  alert("Failed to add exception");
                }
              }}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// Vacation Modal Component
const VacationModal = ({ onClose, onSave }) => {
  const [formData, setFormData] = useState({
    startDate: "",
    endDate: "",
    reason: "",
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.startDate || !formData.endDate) {
      alert("Please select start and end dates");
      return;
    }
    setSaving(true);
    await onSave(formData);
    setSaving(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <FaUmbrellaBeach className="text-amber-500" />
            Add Vacation
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Date
            </label>
            <input
              type="date"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              min={new Date().toISOString().split("T")[0]}
              className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Date
            </label>
            <input
              type="date"
              value={formData.endDate}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              min={formData.startDate || new Date().toISOString().split("T")[0]}
              className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Reason (Optional)
            </label>
            <input
              type="text"
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              placeholder="e.g., Family vacation, Conference"
              className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 px-4 py-2.5 bg-amber-500 text-white rounded-xl hover:bg-amber-600 transition font-medium disabled:opacity-50"
            >
              {saving ? "Saving..." : "Add Vacation"}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

// Exception Modal Component
const ExceptionModal = ({ onClose, onSave }) => {
  const [formData, setFormData] = useState({
    date: "",
    isAvailable: true,
    reason: "",
    slots: [{ start: "09:00", end: "17:00" }],
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.date) {
      alert("Please select a date");
      return;
    }
    setSaving(true);
    await onSave(formData);
    setSaving(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <FaExclamationTriangle className="text-purple-500" />
            Add Exception
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              min={new Date().toISOString().split("T")[0]}
              className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Availability
            </label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, isAvailable: true })}
                className={`flex-1 py-2.5 rounded-xl font-medium transition flex items-center justify-center gap-2 ${
                  formData.isAvailable
                    ? "bg-green-500 text-white"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                <FaCalendarCheck />
                Available
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, isAvailable: false })}
                className={`flex-1 py-2.5 rounded-xl font-medium transition flex items-center justify-center gap-2 ${
                  !formData.isAvailable
                    ? "bg-red-500 text-white"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                <FaCalendarTimes />
                Unavailable
              </button>
            </div>
          </div>

          {formData.isAvailable && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Working Hours
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="time"
                  value={formData.slots[0].start}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      slots: [{ ...formData.slots[0], start: e.target.value }],
                    })
                  }
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500"
                />
                <span className="text-gray-500">to</span>
                <input
                  type="time"
                  value={formData.slots[0].end}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      slots: [{ ...formData.slots[0], end: e.target.value }],
                    })
                  }
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Reason (Optional)
            </label>
            <input
              type="text"
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              placeholder="e.g., Working extra hours, Hospital duty"
              className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 px-4 py-2.5 bg-purple-500 text-white rounded-xl hover:bg-purple-600 transition font-medium disabled:opacity-50"
            >
              {saving ? "Saving..." : "Add Exception"}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default DoctorSchedule;
