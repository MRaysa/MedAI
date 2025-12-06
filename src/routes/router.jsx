import { createBrowserRouter } from "react-router";
import Root from "../pages/Root";
import ErrorPage from "../pages/ErrorPage";
import HomePage from "../pages/HomePage";
import SignIn from "../components/SignIn";
import SignUp from "../components/SignUp";

// Dashboard imports
import AdminDashboard from "../pages/admin/AdminDashboard";
import PatientDashboard from "../pages/patient/PatientDashboard";
import PatientProfile from "../pages/patient/PatientProfile";
import DoctorDashboard from "../pages/doctor/DoctorDashboard";
import DoctorProfile from "../pages/doctor/DoctorProfile";

// Admin pages
import VerifyDoctors from "../pages/admin/VerifyDoctors";
import AdminUsers from "../pages/admin/AdminUsers";

// Public pages
import FindDoctors from "../pages/doctors/FindDoctors";
import DoctorPublicProfile from "../pages/doctors/DoctorPublicProfile";
import MyDoctors from "../pages/doctors/MyDoctors";
import DoctorsBySpecialization from "../pages/doctors/DoctorsBySpecialization";

// Appointment pages
import BookAppointment from "../pages/appointments/BookAppointment";
import AppointmentHistory from "../pages/appointments/AppointmentHistory";
import Teleconsult from "../pages/appointments/Teleconsult";
import DoctorAppointments from "../pages/doctor/DoctorAppointments";
import PatientAppointments from "../pages/patient/PatientAppointments";
import DoctorSchedule from "../pages/doctor/DoctorSchedule";
import DoctorPatients from "../pages/doctor/DoctorPatients";

const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        Component: HomePage,
      },
      {
        path: "/signin",
        Component: SignIn,
      },
      {
        path: "/signup",
        Component: SignUp,
      },
      // Public routes
      {
        path: "/doctors",
        Component: FindDoctors,
      },
      {
        path: "/doctors/my-doctors",
        Component: MyDoctors,
      },
      {
        path: "/doctors/specializations",
        Component: DoctorsBySpecialization,
      },
      {
        path: "/doctors/:id",
        Component: DoctorPublicProfile,
      },
      // Admin routes
      {
        path: "/admin/dashboard",
        Component: AdminDashboard,
      },
      {
        path: "/admin/verify-doctors",
        Component: VerifyDoctors,
      },
      {
        path: "/admin/users",
        Component: AdminUsers,
      },
      // Patient routes
      {
        path: "/patient/dashboard",
        Component: PatientDashboard,
      },
      {
        path: "/patient/profile",
        Component: PatientProfile,
      },
      {
        path: "/patient/:id",
        Component: PatientProfile,
      },
      {
        path: "/patient/appointments",
        Component: PatientAppointments,
      },
      // Doctor routes
      {
        path: "/doctor/dashboard",
        Component: DoctorDashboard,
      },
      {
        path: "/doctor/profile",
        Component: DoctorProfile,
      },
      {
        path: "/doctor/appointments",
        Component: DoctorAppointments,
      },
      {
        path: "/doctor/schedule",
        Component: DoctorSchedule,
      },
      {
        path: "/doctor/patients",
        Component: DoctorPatients,
      },
      // Appointment routes
      {
        path: "/appointments/book",
        Component: BookAppointment,
      },
      {
        path: "/appointments/history",
        Component: AppointmentHistory,
      },
      {
        path: "/appointments/teleconsult",
        Component: Teleconsult,
      },
    ],
  },
]);

export default router;
