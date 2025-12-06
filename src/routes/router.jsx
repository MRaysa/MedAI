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
