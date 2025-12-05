import React, { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { Navigate, useLocation } from "react-router";
import { FaSpinner, FaExclamationTriangle, FaLock } from "react-icons/fa";
import { ROLES, DOCTOR_VERIFICATION_STATUS } from "../contexts/AuthProvider";

/**
 * RoleBasedRoute - Protects routes based on user role
 * @param {Array} allowedRoles - Array of roles allowed to access this route
 * @param {boolean} requireVerifiedDoctor - If true, requires doctor to be verified
 * @param {React.ReactNode} children - Child components to render if authorized
 */
const RoleBasedRoute = ({
  children,
  allowedRoles = [],
  requireVerifiedDoctor = false
}) => {
  const {
    user,
    dbUser,
    userProfile,
    loading
  } = useContext(AuthContext);
  const location = useLocation();

  // Show loading spinner while checking auth state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 to-cyan-50">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-teal-600 mx-auto mb-4" />
          <p className="text-gray-600">Verifying access...</p>
        </div>
      </div>
    );
  }

  // Redirect to sign in if not authenticated
  if (!user || !user.email) {
    return <Navigate to="/signin" state={{ from: location.pathname }} replace />;
  }

  // Check if user is registered in database
  if (!dbUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 to-cyan-50 p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <FaExclamationTriangle className="text-5xl text-amber-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Profile Setup Required
          </h2>
          <p className="text-gray-600 mb-6">
            Please complete your registration to access this page.
          </p>
          <Navigate to="/signup" state={{ from: location.pathname }} replace />
        </div>
      </div>
    );
  }

  // Check if user has required role
  if (allowedRoles.length > 0 && !allowedRoles.includes(dbUser.role)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 to-cyan-50 p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <FaLock className="text-5xl text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Access Denied
          </h2>
          <p className="text-gray-600 mb-4">
            You don't have permission to access this page.
          </p>
          <p className="text-sm text-gray-500 mb-6">
            Required role: {allowedRoles.join(" or ")}
            <br />
            Your role: {dbUser.role}
          </p>
          <button
            onClick={() => window.history.back()}
            className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Check doctor verification if required
  if (requireVerifiedDoctor && dbUser.role === ROLES.DOCTOR) {
    if (!userProfile || userProfile.verificationStatus !== DOCTOR_VERIFICATION_STATUS.APPROVED) {
      return <Navigate to="/doctor/verification-pending" replace />;
    }
  }

  return children;
};

/**
 * AdminRoute - Shorthand for admin-only routes
 */
export const AdminRoute = ({ children }) => (
  <RoleBasedRoute allowedRoles={[ROLES.ADMIN]}>
    {children}
  </RoleBasedRoute>
);

/**
 * DoctorRoute - Shorthand for doctor-only routes
 * @param {boolean} requireVerified - Whether to require verified doctor status
 */
export const DoctorRoute = ({ children, requireVerified = false }) => (
  <RoleBasedRoute
    allowedRoles={[ROLES.DOCTOR]}
    requireVerifiedDoctor={requireVerified}
  >
    {children}
  </RoleBasedRoute>
);

/**
 * PatientRoute - Shorthand for patient-only routes
 */
export const PatientRoute = ({ children }) => (
  <RoleBasedRoute allowedRoles={[ROLES.PATIENT]}>
    {children}
  </RoleBasedRoute>
);

/**
 * DoctorOrAdminRoute - For routes accessible by doctors and admins
 */
export const DoctorOrAdminRoute = ({ children }) => (
  <RoleBasedRoute allowedRoles={[ROLES.DOCTOR, ROLES.ADMIN]}>
    {children}
  </RoleBasedRoute>
);

/**
 * PatientOrDoctorRoute - For routes accessible by patients and doctors
 */
export const PatientOrDoctorRoute = ({ children }) => (
  <RoleBasedRoute allowedRoles={[ROLES.PATIENT, ROLES.DOCTOR]}>
    {children}
  </RoleBasedRoute>
);

export default RoleBasedRoute;
