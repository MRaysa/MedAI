import { createBrowserRouter } from "react-router";
import Root from "../pages/Root";
import ErrorPage from "../pages/ErrorPage";
import HomePage from "../pages/HomePage";
import SignIn from "../components/SignIn";
import SignUp from "../components/SignUp";

// Dashboard imports
import AdminDashboard from "../pages/admin/AdminDashboard";
import PatientDashboard from "../pages/patient/PatientDashboard";
import DoctorDashboard from "../pages/doctor/DoctorDashboard";
import DoctorProfile from "../pages/doctor/DoctorProfile";

// Admin pages
import VerifyDoctors from "../pages/admin/VerifyDoctors";

// Public pages
import FindDoctors from "../pages/doctors/FindDoctors";

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
      // Admin routes
      {
        path: "/admin/dashboard",
        Component: AdminDashboard,
      },
      {
        path: "/admin/verify-doctors",
        Component: VerifyDoctors,
      },
      // Patient routes
      {
        path: "/patient/dashboard",
        Component: PatientDashboard,
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
    ],
  },
]);

export default router;
