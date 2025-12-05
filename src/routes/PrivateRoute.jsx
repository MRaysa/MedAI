import React, { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { Navigate, useLocation } from "react-router";
import { FaSpinner } from "react-icons/fa";

/**
 * PrivateRoute - Protects routes that require authentication
 * Redirects to sign in if user is not authenticated
 */
const PrivateRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();

  // Show loading spinner while checking auth state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 to-cyan-50">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-teal-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to sign in if not authenticated
  if (!user || !user.email) {
    return <Navigate to="/signin" state={{ from: location.pathname }} replace />;
  }

  return children;
};

export default PrivateRoute;
