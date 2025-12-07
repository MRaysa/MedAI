import { useState, useEffect, useContext } from "react";
import { useSearchParams, useNavigate, Link } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { AuthContext } from "../../contexts/AuthContext";
import {
  FaUserMd,
  FaCalendarAlt,
  FaClock,
  FaVideo,
  FaPhone,
  FaComments,
  FaMoneyBillWave,
  FaArrowLeft,
  FaArrowRight,
  FaCheck,
  FaChevronLeft,
  FaChevronRight,
  FaNotesMedical,
  FaStethoscope,
  FaCheckCircle,
  FaTimesCircle,
  FaInfoCircle,
  FaSpinner,
  FaMapMarkerAlt,
  FaStar,
  FaExclamationTriangle,
  FaTimes,
} from "react-icons/fa";
import { MdLocalHospital, MdVerified, MdAccessTime } from "react-icons/md";
import { BsPatchCheckFill, BsCalendar3, BsClockHistory } from "react-icons/bs";
import { RiStethoscopeLine } from "react-icons/ri";
import { HiSparkles } from "react-icons/hi";

// Professional Alert Modal Component
const AlertModal = ({ isOpen, onClose, type = "info", title, message, actionText = "OK", onAction }) => {
  if (!isOpen) return null;

  const typeConfig = {
    success: {
      icon: FaCheckCircle,
      bgColor: "bg-emerald-100",
      iconColor: "text-emerald-500",
      buttonColor: "from-emerald-500 to-teal-500",
    },
    error: {
      icon: FaTimesCircle,
      bgColor: "bg-red-100",
      iconColor: "text-red-500",
      buttonColor: "from-red-500 to-rose-500",
    },
    warning: {
      icon: FaExclamationTriangle,
      bgColor: "bg-amber-100",
      iconColor: "text-amber-500",
      buttonColor: "from-amber-500 to-orange-500",
    },
    info: {
      icon: FaInfoCircle,
      bgColor: "bg-blue-100",
      iconColor: "text-blue-500",
      buttonColor: "from-blue-500 to-cyan-500",
    },
  };

  const config = typeConfig[type] || typeConfig.info;
  const Icon = config.icon;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header with close button */}
          <div className="relative px-6 pt-6">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition"
            >
              <FaTimes />
            </button>
          </div>

          {/* Content */}
          <div className="px-6 pb-6 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.1 }}
              className={`w-20 h-20 ${config.bgColor} rounded-full flex items-center justify-center mx-auto mb-5`}
            >
              <Icon className={`text-4xl ${config.iconColor}`} />
            </motion.div>

            <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
            <p className="text-gray-600 mb-6 leading-relaxed">{message}</p>

            <div className="flex gap-3 justify-center">
              {type === "warning" && (
                <button
                  onClick={onClose}
                  className="px-6 py-3 border-2 border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
              )}
              <button
                onClick={() => {
                  if (onAction) onAction();
                  onClose();
                }}
                className={`px-8 py-3 bg-gradient-to-r ${config.buttonColor} text-white font-medium rounded-xl hover:shadow-lg transition-all`}
              >
                {actionText}
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const BookAppointment = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { apiCall, user, isPatient } = useContext(AuthContext);

  const doctorId = searchParams.get("doctor");

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [doctor, setDoctor] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [bookedSlots, setBookedSlots] = useState([]);

  // Alert modal state
  const [alertModal, setAlertModal] = useState({
    isOpen: false,
    type: "info",
    title: "",
    message: "",
    actionText: "OK",
    onAction: null,
  });

  const showAlert = (type, title, message, actionText = "OK", onAction = null) => {
    setAlertModal({
      isOpen: true,
      type,
      title,
      message,
      actionText,
      onAction,
    });
  };

  const closeAlert = () => {
    setAlertModal((prev) => ({ ...prev, isOpen: false }));
  };

  // Form state
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [consultationType, setConsultationType] = useState("in_person");
  const [formData, setFormData] = useState({
    symptoms: "",
    reasonForVisit: "",
    notes: "",
  });

  // Calendar state
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const consultationTypes = [
    { id: "in_person", label: "In-Person", icon: MdLocalHospital, color: "emerald" },
    { id: "video", label: "Video Call", icon: FaVideo, color: "blue" },
    { id: "phone", label: "Phone", icon: FaPhone, color: "violet" },
    { id: "chat", label: "Chat", icon: FaComments, color: "pink" },
  ];

  const days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];

  useEffect(() => {
    if (!doctorId) {
      setLoading(false);
      return;
    }
    fetchDoctor();
  }, [doctorId]);

  useEffect(() => {
    if (selectedDate && doctor) {
      fetchBookedSlots();
    }
  }, [selectedDate]);

  const fetchDoctor = async () => {
    setLoading(true);
    try {
      const response = await apiCall(`/doctors/${doctorId}`);
      if (response.success) {
        setDoctor(response.data);
        // Set default consultation type based on doctor's offerings
        if (response.data.consultationSettings?.types?.length > 0) {
          setConsultationType(response.data.consultationSettings.types[0]);
        }
      } else {
        setError("Doctor not found");
      }
    } catch (err) {
      console.error("Error fetching doctor:", err);
      setError("Failed to load doctor information");
    } finally {
      setLoading(false);
    }
  };

  const fetchBookedSlots = async () => {
    try {
      const dateStr = selectedDate.toISOString().split("T")[0];
      const response = await apiCall(`/appointments/booked-slots/${doctorId}?date=${dateStr}`);
      if (response.success) {
        setBookedSlots(response.data || []);
      }
    } catch (err) {
      console.error("Error fetching booked slots:", err);
    }
  };

  const generateTimeSlots = () => {
    if (!doctor || !selectedDate) return [];

    const dayOfWeek = days[selectedDate.getDay() === 0 ? 6 : selectedDate.getDay() - 1];
    const schedule = doctor.availability?.schedule?.[dayOfWeek];

    if (!schedule?.isAvailable || !schedule?.slots?.length) {
      return [];
    }

    const slots = [];
    const duration = doctor.consultationSettings?.defaultDuration || 30;
    const bufferTime = doctor.consultationSettings?.bufferTime || 10;

    schedule.slots.forEach((slot) => {
      const [startHour, startMin] = slot.start.split(":").map(Number);
      const [endHour, endMin] = slot.end.split(":").map(Number);

      let currentTime = new Date(2000, 0, 1, startHour, startMin);
      const endTime = new Date(2000, 0, 1, endHour, endMin);

      while (currentTime < endTime) {
        const timeStr = `${String(currentTime.getHours()).padStart(2, "0")}:${String(currentTime.getMinutes()).padStart(2, "0")}`;

        // Check if slot is booked
        const isBooked = bookedSlots.some((s) => s.time === timeStr);

        // Check if slot is in the past (for today)
        const now = new Date();
        const isToday = selectedDate.toDateString() === now.toDateString();
        const isPast = isToday && (currentTime.getHours() < now.getHours() ||
          (currentTime.getHours() === now.getHours() && currentTime.getMinutes() <= now.getMinutes()));

        slots.push({
          time: timeStr,
          available: !isBooked && !isPast,
        });

        // Add duration + buffer for next slot
        currentTime = new Date(currentTime.getTime() + (duration + bufferTime) * 60000);
      }
    });

    return slots;
  };

  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDay = firstDay.getDay();

    const days = [];

    // Previous month days
    for (let i = 0; i < startDay; i++) {
      const date = new Date(year, month, -startDay + i + 1);
      days.push({ date, isCurrentMonth: false });
    }

    // Current month days
    for (let i = 1; i <= lastDay.getDate(); i++) {
      const date = new Date(year, month, i);
      days.push({ date, isCurrentMonth: true });
    }

    // Next month days
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      const date = new Date(year, month + 1, i);
      days.push({ date, isCurrentMonth: false });
    }

    return days;
  };

  const isDateAvailable = (date) => {
    if (!doctor) return false;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Can't book past dates
    if (date < today) return false;

    // Check doctor's availability
    const dayOfWeek = days[date.getDay() === 0 ? 6 : date.getDay() - 1];
    const schedule = doctor.availability?.schedule?.[dayOfWeek];

    return schedule?.isAvailable;
  };

  const getFee = () => {
    if (!doctor?.fees) return 0;
    switch (consultationType) {
      case "in_person":
        return doctor.fees.inPersonConsultation || 0;
      case "video":
        return doctor.fees.videoConsultation || 0;
      case "phone":
        return doctor.fees.phoneConsultation || 0;
      default:
        return 0;
    }
  };

  const formatCurrency = (amount, currency = "USD") => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleSubmit = async () => {
    if (!selectedDate || !selectedTime) {
      showAlert(
        "warning",
        "Missing Information",
        "Please select both a date and time for your appointment before proceeding.",
        "Select Time"
      );
      return;
    }

    if (!formData.reasonForVisit.trim()) {
      showAlert(
        "warning",
        "Reason Required",
        "Please provide a reason for your visit so the doctor can prepare for your appointment.",
        "Add Reason"
      );
      return;
    }

    setSubmitting(true);
    try {
      const appointmentData = {
        doctorId,
        appointmentDate: selectedDate.toISOString(),
        appointmentTime: selectedTime,
        consultationType,
        symptoms: formData.symptoms,
        reasonForVisit: formData.reasonForVisit,
        notes: formData.notes,
      };

      console.log("Booking appointment with data:", appointmentData);

      const response = await apiCall("/appointments", {
        method: "POST",
        body: JSON.stringify(appointmentData),
      });

      console.log("Appointment response:", response);

      if (response.success) {
        setSuccess(true);
        setCurrentStep(4);
      } else {
        // Map error codes to user-friendly messages
        const errorMessages = {
          SLOT_UNAVAILABLE: {
            title: "Time Slot Unavailable",
            message: "This time slot has already been booked. Please select a different time or date for your appointment.",
          },
          DOCTOR_NOT_FOUND: {
            title: "Doctor Not Found",
            message: "The selected doctor is no longer available. Please go back and choose a different doctor.",
          },
          MISSING_FIELDS: {
            title: "Missing Information",
            message: "Please fill in all required fields before booking your appointment.",
          },
          INVALID_DOCTOR_ID: {
            title: "Invalid Selection",
            message: "There was an issue with the doctor selection. Please go back and try again.",
          },
        };

        const errorInfo = errorMessages[response.code] || {
          title: "Booking Failed",
          message: response.message || "We couldn't book your appointment. Please try again later.",
        };

        showAlert("error", errorInfo.title, errorInfo.message, "Try Again");
      }
    } catch (err) {
      console.error("Error booking appointment:", err);
      showAlert(
        "error",
        "Connection Error",
        "Unable to connect to the server. Please check your internet connection and try again.",
        "Retry"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const nextStep = () => {
    if (currentStep === 1 && !selectedDate) {
      showAlert(
        "info",
        "Select a Date",
        "Please choose a date from the calendar to continue with your booking.",
        "Got it"
      );
      return;
    }
    if (currentStep === 2 && !selectedTime) {
      showAlert(
        "info",
        "Select a Time",
        "Please choose an available time slot to continue with your booking.",
        "Got it"
      );
      return;
    }
    setCurrentStep((prev) => Math.min(prev + 1, 3));
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-teal-50/40 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl shadow-xl p-8 text-center max-w-md w-full"
        >
          <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaInfoCircle className="text-3xl text-amber-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Sign In Required</h2>
          <p className="text-gray-500 mb-6">Please sign in to book an appointment</p>
          <Link
            to="/signin"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-xl hover:from-teal-600 hover:to-teal-700 transition font-medium shadow-lg shadow-teal-500/25"
          >
            Sign In
          </Link>
        </motion.div>
      </div>
    );
  }

  if (!isPatient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-teal-50/40 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl shadow-xl p-8 text-center max-w-md w-full"
        >
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaTimesCircle className="text-3xl text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Patients Only</h2>
          <p className="text-gray-500 mb-6">Only patients can book appointments</p>
          <Link
            to="/doctors"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-xl hover:from-teal-600 hover:to-teal-700 transition font-medium"
          >
            <FaArrowLeft />
            Back to Doctors
          </Link>
        </motion.div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-teal-50/40 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 rounded-full border-4 border-teal-100 border-t-teal-500 animate-spin mx-auto" />
            <RiStethoscopeLine className="absolute inset-0 m-auto text-2xl text-teal-500" />
          </div>
          <p className="mt-6 text-gray-600 font-medium">Loading booking page...</p>
        </div>
      </div>
    );
  }

  // No doctor selected - show doctor selection UI
  if (!doctorId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-teal-50/40 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <div className="w-20 h-20 bg-gradient-to-br from-teal-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <FaCalendarAlt className="text-3xl text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Book an Appointment</h1>
            <p className="text-gray-600 max-w-md mx-auto">
              Find and select a doctor to schedule your appointment
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-3xl shadow-xl p-8"
          >
            <div className="grid sm:grid-cols-2 gap-4 mb-8">
              <Link
                to="/doctors"
                className="flex items-center gap-4 p-6 bg-gradient-to-br from-teal-50 to-blue-50 rounded-2xl border-2 border-teal-100 hover:border-teal-300 transition group"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-teal-400 to-teal-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition">
                  <FaUserMd className="text-2xl text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Find Doctors</h3>
                  <p className="text-sm text-gray-500">Browse all available doctors</p>
                </div>
              </Link>

              <Link
                to="/doctors/my-doctors"
                className="flex items-center gap-4 p-6 bg-gradient-to-br from-violet-50 to-purple-50 rounded-2xl border-2 border-violet-100 hover:border-violet-300 transition group"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-violet-400 to-violet-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition">
                  <FaStethoscope className="text-2xl text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">My Doctors</h3>
                  <p className="text-sm text-gray-500">Doctors you've visited before</p>
                </div>
              </Link>
            </div>

            <div className="text-center">
              <p className="text-gray-500 mb-4">Or search by specialty:</p>
              <div className="flex flex-wrap justify-center gap-2">
                {[
                  "Cardiology",
                  "Dermatology",
                  "Neurology",
                  "Orthopedics",
                  "Pediatrics",
                  "General Medicine",
                ].map((specialty) => (
                  <Link
                    key={specialty}
                    to={`/doctors/specializations?spec=${encodeURIComponent(specialty)}`}
                    className="px-4 py-2 bg-gray-100 hover:bg-teal-100 text-gray-700 hover:text-teal-700 rounded-full text-sm font-medium transition"
                  >
                    {specialty}
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Recent Appointments Quick Access */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-6 text-center"
          >
            <Link
              to="/appointments/history"
              className="inline-flex items-center gap-2 text-teal-600 hover:text-teal-700 font-medium"
            >
              <BsClockHistory />
              View Appointment History
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  if (error || !doctor) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-teal-50/40 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl shadow-xl p-8 text-center max-w-md w-full"
        >
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaTimesCircle className="text-3xl text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Doctor Not Found</h2>
          <p className="text-gray-500 mb-6">{error || "The requested doctor could not be found"}</p>
          <Link
            to="/doctors"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-xl hover:from-teal-600 hover:to-teal-700 transition font-medium"
          >
            <FaArrowLeft />
            Find Doctors
          </Link>
        </motion.div>
      </div>
    );
  }

  // Success state
  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-teal-50/40 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl shadow-xl p-8 text-center max-w-md w-full"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="w-24 h-24 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-500/30"
          >
            <FaCheckCircle className="text-5xl text-white" />
          </motion.div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Appointment Booked!</h2>
          <p className="text-gray-500 mb-6">
            Your appointment with Dr. {doctor.user?.firstName} {doctor.user?.lastName} has been successfully scheduled.
          </p>
          <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left">
            <div className="flex items-center gap-3 mb-3">
              <FaCalendarAlt className="text-teal-500" />
              <span className="font-medium">{selectedDate?.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</span>
            </div>
            <div className="flex items-center gap-3">
              <FaClock className="text-teal-500" />
              <span className="font-medium">{selectedTime}</span>
            </div>
          </div>
          <div className="flex gap-3">
            <Link
              to="/patient/dashboard"
              className="flex-1 px-6 py-3 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-xl hover:from-teal-600 hover:to-teal-700 transition font-medium"
            >
              View My Appointments
            </Link>
            <Link
              to="/doctors"
              className="flex-1 px-6 py-3 border-2 border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition font-medium"
            >
              Find More Doctors
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  const timeSlots = generateTimeSlots();
  const calendarDays = generateCalendarDays();

  return (
    <>
      {/* Professional Alert Modal */}
      <AlertModal
        isOpen={alertModal.isOpen}
        onClose={closeAlert}
        type={alertModal.type}
        title={alertModal.title}
        message={alertModal.message}
        actionText={alertModal.actionText}
        onAction={alertModal.onAction}
      />

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-teal-50/40 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <Link
            to={`/doctors/${doctorId}`}
          className="inline-flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-teal-600 hover:bg-white rounded-xl transition-all font-medium mb-6"
        >
          <FaArrowLeft />
          Back to Doctor Profile
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Progress Steps */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-6"
            >
              <div className="flex items-center justify-between">
                {[
                  { step: 1, label: "Select Date", icon: FaCalendarAlt },
                  { step: 2, label: "Select Time", icon: FaClock },
                  { step: 3, label: "Confirm Details", icon: FaCheck },
                ].map((item, index) => (
                  <div key={item.step} className="flex items-center">
                    <div
                      className={`flex items-center gap-3 ${
                        currentStep >= item.step ? "text-teal-600" : "text-gray-400"
                      }`}
                    >
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                          currentStep > item.step
                            ? "bg-teal-500 text-white"
                            : currentStep === item.step
                            ? "bg-teal-100 text-teal-600 ring-2 ring-teal-500"
                            : "bg-gray-100 text-gray-400"
                        }`}
                      >
                        {currentStep > item.step ? <FaCheck /> : item.step}
                      </div>
                      <span className="hidden sm:block font-medium">{item.label}</span>
                    </div>
                    {index < 2 && (
                      <div
                        className={`w-16 sm:w-24 h-1 mx-2 rounded ${
                          currentStep > item.step ? "bg-teal-500" : "bg-gray-200"
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Step 1: Select Date */}
            <AnimatePresence mode="wait">
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
                >
                  <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <FaCalendarAlt className="text-teal-500" />
                    Select Appointment Date
                  </h2>

                  {/* Calendar Header */}
                  <div className="flex items-center justify-between mb-4">
                    <button
                      onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                      className="p-2 hover:bg-gray-100 rounded-lg transition"
                    >
                      <FaChevronLeft />
                    </button>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {currentMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                    </h3>
                    <button
                      onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                      className="p-2 hover:bg-gray-100 rounded-lg transition"
                    >
                      <FaChevronRight />
                    </button>
                  </div>

                  {/* Calendar Grid */}
                  <div className="grid grid-cols-7 gap-1 mb-4">
                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                      <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                        {day}
                      </div>
                    ))}
                    {calendarDays.map((day, index) => {
                      const isAvailable = isDateAvailable(day.date);
                      const isSelected = selectedDate?.toDateString() === day.date.toDateString();
                      const isToday = day.date.toDateString() === new Date().toDateString();

                      return (
                        <button
                          key={index}
                          onClick={() => isAvailable && day.isCurrentMonth && setSelectedDate(day.date)}
                          disabled={!isAvailable || !day.isCurrentMonth}
                          className={`
                            p-3 rounded-xl text-sm font-medium transition-all
                            ${!day.isCurrentMonth ? "text-gray-300" : ""}
                            ${isSelected ? "bg-teal-500 text-white shadow-lg shadow-teal-500/30" : ""}
                            ${isAvailable && day.isCurrentMonth && !isSelected ? "hover:bg-teal-50 text-gray-700" : ""}
                            ${!isAvailable && day.isCurrentMonth ? "text-gray-300 cursor-not-allowed" : ""}
                            ${isToday && !isSelected ? "ring-2 ring-teal-500" : ""}
                          `}
                        >
                          {day.date.getDate()}
                        </button>
                      );
                    })}
                  </div>

                  {/* Legend */}
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-teal-500 rounded" />
                      <span>Selected</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-gray-100 rounded" />
                      <span>Available</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-gray-50 rounded border border-dashed border-gray-300" />
                      <span>Unavailable</span>
                    </div>
                  </div>

                  {selectedDate && (
                    <div className="mt-4 p-4 bg-teal-50 rounded-xl border border-teal-200">
                      <p className="text-teal-700 font-medium">
                        Selected: {selectedDate.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
                      </p>
                    </div>
                  )}
                </motion.div>
              )}

              {/* Step 2: Select Time */}
              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
                >
                  <h2 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                    <FaClock className="text-teal-500" />
                    Select Time Slot
                  </h2>
                  <p className="text-gray-500 mb-6">
                    {selectedDate?.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
                  </p>

                  {/* Consultation Type */}
                  <div className="mb-6">
                    <h3 className="font-semibold text-gray-900 mb-3">Consultation Type</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {consultationTypes
                        .filter((type) => doctor.consultationSettings?.types?.includes(type.id))
                        .map((type) => (
                          <button
                            key={type.id}
                            onClick={() => setConsultationType(type.id)}
                            className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                              consultationType === type.id
                                ? `border-${type.color}-500 bg-${type.color}-50`
                                : "border-gray-200 hover:border-gray-300"
                            }`}
                          >
                            <type.icon className={`text-2xl ${consultationType === type.id ? `text-${type.color}-500` : "text-gray-400"}`} />
                            <span className={`font-medium text-sm ${consultationType === type.id ? `text-${type.color}-700` : "text-gray-600"}`}>
                              {type.label}
                            </span>
                          </button>
                        ))}
                    </div>
                  </div>

                  {/* Time Slots */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Available Time Slots</h3>
                    {timeSlots.length === 0 ? (
                      <div className="text-center py-8 bg-gray-50 rounded-xl">
                        <FaClock className="text-4xl text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500">No available slots for this date</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                        {timeSlots.map((slot) => (
                          <button
                            key={slot.time}
                            onClick={() => slot.available && setSelectedTime(slot.time)}
                            disabled={!slot.available}
                            className={`
                              p-3 rounded-xl text-sm font-medium transition-all
                              ${selectedTime === slot.time ? "bg-teal-500 text-white shadow-lg" : ""}
                              ${slot.available && selectedTime !== slot.time ? "bg-gray-50 hover:bg-teal-50 text-gray-700" : ""}
                              ${!slot.available ? "bg-gray-100 text-gray-300 cursor-not-allowed line-through" : ""}
                            `}
                          >
                            {slot.time}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {selectedTime && (
                    <div className="mt-4 p-4 bg-teal-50 rounded-xl border border-teal-200">
                      <p className="text-teal-700 font-medium">
                        Selected: {selectedTime} - Duration: {doctor.consultationSettings?.defaultDuration || 30} minutes
                      </p>
                    </div>
                  )}
                </motion.div>
              )}

              {/* Step 3: Confirm Details */}
              {currentStep === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
                >
                  <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <FaNotesMedical className="text-teal-500" />
                    Confirm Appointment Details
                  </h2>

                  {/* Appointment Summary */}
                  <div className="bg-gradient-to-r from-teal-50 to-blue-50 rounded-xl p-4 mb-6 border border-teal-100">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-3">
                        <FaCalendarAlt className="text-teal-500" />
                        <div>
                          <p className="text-xs text-gray-500">Date</p>
                          <p className="font-semibold text-gray-900">
                            {selectedDate?.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <FaClock className="text-teal-500" />
                        <div>
                          <p className="text-xs text-gray-500">Time</p>
                          <p className="font-semibold text-gray-900">{selectedTime}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <MdLocalHospital className="text-teal-500" />
                        <div>
                          <p className="text-xs text-gray-500">Type</p>
                          <p className="font-semibold text-gray-900 capitalize">{consultationType.replace("_", " ")}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <FaMoneyBillWave className="text-teal-500" />
                        <div>
                          <p className="text-xs text-gray-500">Fee</p>
                          <p className="font-semibold text-gray-900">{formatCurrency(getFee(), doctor.fees?.currency)}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Additional Info Form */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Reason for Visit *
                      </label>
                      <input
                        type="text"
                        value={formData.reasonForVisit}
                        onChange={(e) => setFormData({ ...formData, reasonForVisit: e.target.value })}
                        placeholder="e.g., Annual checkup, Follow-up visit"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Symptoms (if any)
                      </label>
                      <textarea
                        value={formData.symptoms}
                        onChange={(e) => setFormData({ ...formData, symptoms: e.target.value })}
                        placeholder="Describe your symptoms..."
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition resize-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Additional Notes
                      </label>
                      <textarea
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        placeholder="Any additional information for the doctor..."
                        rows={2}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition resize-none"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-6">
              {currentStep > 1 && (
                <button
                  onClick={prevStep}
                  className="flex items-center gap-2 px-6 py-3 border-2 border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition font-medium"
                >
                  <FaArrowLeft />
                  Previous
                </button>
              )}
              {currentStep < 3 ? (
                <button
                  onClick={nextStep}
                  className="ml-auto flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-xl hover:from-teal-600 hover:to-teal-700 transition font-medium shadow-lg shadow-teal-500/25"
                >
                  Next
                  <FaArrowRight />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="ml-auto flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl hover:from-emerald-600 hover:to-teal-700 transition font-bold shadow-lg shadow-teal-500/25 disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <FaSpinner className="animate-spin" />
                      Booking...
                    </>
                  ) : (
                    <>
                      <FaCheckCircle />
                      Confirm Booking
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Sidebar - Doctor Info */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
            >
              <div className="flex items-center gap-4 mb-4">
                {doctor.user?.photoURL ? (
                  <img
                    src={doctor.user.photoURL}
                    alt={doctor.user.displayName}
                    className="w-16 h-16 rounded-xl object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-teal-400 to-blue-500 flex items-center justify-center">
                    <FaUserMd className="text-2xl text-white" />
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-gray-900">
                      Dr. {doctor.user?.firstName} {doctor.user?.lastName}
                    </h3>
                    <BsPatchCheckFill className="text-teal-500" />
                  </div>
                  <p className="text-teal-600 font-medium text-sm">{doctor.specialization}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <FaStar className="text-amber-400 text-sm" />
                    <span className="text-sm font-medium">{(doctor.ratings?.average || 0).toFixed(1)}</span>
                    <span className="text-gray-400 text-sm">({doctor.ratings?.count || 0})</span>
                  </div>
                </div>
              </div>

              {doctor.practiceInfo?.clinicName && (
                <div className="flex items-start gap-2 text-sm text-gray-600 mb-2">
                  <MdLocalHospital className="text-gray-400 mt-0.5" />
                  <span>{doctor.practiceInfo.clinicName}</span>
                </div>
              )}

              {doctor.practiceInfo?.clinicAddress?.city && (
                <div className="flex items-start gap-2 text-sm text-gray-600">
                  <FaMapMarkerAlt className="text-gray-400 mt-0.5" />
                  <span>
                    {doctor.practiceInfo.clinicAddress.city}, {doctor.practiceInfo.clinicAddress.state}
                  </span>
                </div>
              )}
            </motion.div>

            {/* Fee Summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
            >
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FaMoneyBillWave className="text-emerald-500" />
                Fee Summary
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Consultation Fee</span>
                  <span className="font-semibold">{formatCurrency(getFee(), doctor.fees?.currency)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Duration</span>
                  <span className="font-semibold">{doctor.consultationSettings?.defaultDuration || 30} mins</span>
                </div>
                {doctor.fees?.followUpDiscount > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span>Follow-up Discount</span>
                    <span className="font-semibold">{doctor.fees.followUpDiscount}% OFF</span>
                  </div>
                )}
                <div className="border-t border-gray-100 pt-3 mt-3">
                  <div className="flex justify-between">
                    <span className="font-bold text-gray-900">Total</span>
                    <span className="font-bold text-teal-600 text-lg">{formatCurrency(getFee(), doctor.fees?.currency)}</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Info Box */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-4 border border-amber-200"
            >
              <div className="flex items-start gap-3">
                <FaInfoCircle className="text-amber-500 mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <p className="font-semibold text-amber-800 mb-1">Appointment Policy</p>
                  <ul className="text-amber-700 space-y-1">
                    <li>• Please arrive 10 minutes early</li>
                    <li>• Cancellation requires 24h notice</li>
                    <li>• Bring valid ID and insurance card</li>
                  </ul>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      </div>
    </>
  );
};

export default BookAppointment;
