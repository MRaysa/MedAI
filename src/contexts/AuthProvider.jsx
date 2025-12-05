import React, { useEffect, useState, useCallback, useRef } from "react";
import { AuthContext } from "./AuthContext";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  sendEmailVerification,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth } from "../firebase/firebase.init";

const googleProvider = new GoogleAuthProvider();

// API base URL
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

// Role constants (matching backend)
export const ROLES = {
  ADMIN: "admin",
  DOCTOR: "doctor",
  PATIENT: "patient",
};

// Account status constants
export const ACCOUNT_STATUS = {
  ACTIVE: "active",
  INACTIVE: "inactive",
  SUSPENDED: "suspended",
  PENDING_VERIFICATION: "pending_verification",
};

// Doctor verification status
export const DOCTOR_VERIFICATION_STATUS = {
  PENDING: "pending",
  UNDER_REVIEW: "under_review",
  APPROVED: "approved",
  REJECTED: "rejected",
  SUSPENDED: "suspended",
};

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Firebase user
  const [dbUser, setDbUser] = useState(null); // Database user with role info
  const [userProfile, setUserProfile] = useState(null); // Role-specific profile (Patient/Doctor)
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);
  const isRegisteringRef = useRef(false); // Ref to prevent race condition during registration

  // Helper function to get auth token
  const getAuthToken = useCallback(async () => {
    if (!auth.currentUser) return null;
    try {
      return await auth.currentUser.getIdToken();
    } catch (error) {
      console.error("Error getting auth token:", error);
      return null;
    }
  }, []);

  // Helper function for API calls with auth
  const apiCall = useCallback(
    async (endpoint, options = {}) => {
      const token = await getAuthToken();
      const headers = {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      };

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "API request failed");
      }

      return data;
    },
    [getAuthToken]
  );

  // Check if user is registered in database
  const checkRegistration = useCallback(
    async (firebaseUid) => {
      try {
        const data = await apiCall(`/auth/check-registration/${firebaseUid}`, {
          method: "GET",
        });
        return data;
      } catch (error) {
        console.error("Check registration error:", error);
        return { isRegistered: false };
      }
    },
    [apiCall]
  );

  // Register new user in database
  const registerUser = useCallback(
    async (userData) => {
      try {
        const data = await apiCall("/auth/register", {
          method: "POST",
          body: JSON.stringify(userData),
        });
        return data;
      } catch (error) {
        console.error("Register user error:", error);
        throw error;
      }
    },
    [apiCall]
  );

  // Login and sync with database
  const loginToDatabase = useCallback(async () => {
    try {
      const data = await apiCall("/auth/login", {
        method: "POST",
      });
      setDbUser(data.user);
      setUserProfile(data.profile);
      return data;
    } catch (error) {
      console.error("Database login error:", error);
      // If user not found in database, they need to register
      if (error.message.includes("not found")) {
        setDbUser(null);
        setUserProfile(null);
      }
      throw error;
    }
  }, [apiCall]);

  // Get current user info from database
  const fetchCurrentUser = useCallback(async () => {
    try {
      const data = await apiCall("/auth/me", {
        method: "GET",
      });
      setDbUser(data.user);
      setUserProfile(data.profile);
      return data;
    } catch (error) {
      console.error("Fetch current user error:", error);
      setDbUser(null);
      setUserProfile(null);
      throw error;
    }
  }, [apiCall]);

  // Create user with email and password
  const createUser = async (email, password, role = ROLES.PATIENT, additionalData = {}) => {
    setLoading(true);
    setAuthError(null);
    isRegisteringRef.current = true; // Prevent onAuthStateChanged from fetching user before registration
    try {
      console.log("Creating Firebase user with email:", email);
      console.log("Auth object:", auth);
      console.log("Auth app config:", auth.app?.options);

      // Create Firebase user
      const result = await createUserWithEmailAndPassword(auth, email, password);
      console.log("Firebase user created successfully:", result.user.uid);

      // Update profile with name if provided
      if (additionalData.firstName || additionalData.lastName) {
        await updateProfile(result.user, {
          displayName: `${additionalData.firstName || ""} ${additionalData.lastName || ""}`.trim(),
        });
      }

      // Register in database
      const dbData = await registerUser({
        firebaseUid: result.user.uid,
        email: result.user.email,
        firstName: additionalData.firstName || "",
        lastName: additionalData.lastName || "",
        displayName: result.user.displayName,
        photoURL: result.user.photoURL,
        phone: additionalData.phone || null,
        role: role,
        authProvider: "email",
      });

      setDbUser(dbData.user);

      // Send email verification
      await sendEmailVerification(result.user);

      return { firebaseUser: result.user, dbUser: dbData.user };
    } catch (error) {
      console.error("Firebase createUser error:", error);
      console.error("Error code:", error.code);
      console.error("Error message:", error.message);
      setAuthError(error.message);
      throw error;
    } finally {
      isRegisteringRef.current = false;
      setLoading(false);
    }
  };

  // Sign in with email and password
  const signInUser = async (email, password) => {
    setLoading(true);
    setAuthError(null);
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);

      // Sync with database
      const dbData = await loginToDatabase();

      return { firebaseUser: result.user, dbUser: dbData.user, profile: dbData.profile };
    } catch (error) {
      setAuthError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Google Sign In
  const googleSignIn = async (role = ROLES.PATIENT) => {
    setLoading(true);
    setAuthError(null);
    try {
      const result = await signInWithPopup(auth, googleProvider);

      // Check if user exists in database
      const checkResult = await checkRegistration(result.user.uid);

      if (!checkResult.isRegistered) {
        // Register new user
        const nameParts = (result.user.displayName || "").split(" ");
        const firstName = nameParts[0] || "";
        const lastName = nameParts.slice(1).join(" ") || "";

        const dbData = await registerUser({
          firebaseUid: result.user.uid,
          email: result.user.email,
          firstName,
          lastName,
          displayName: result.user.displayName,
          photoURL: result.user.photoURL,
          role: role,
          authProvider: "google",
        });

        setDbUser(dbData.user);
        return { firebaseUser: result.user, dbUser: dbData.user, isNewUser: true };
      } else {
        // Existing user - login
        const dbData = await loginToDatabase();
        return { firebaseUser: result.user, dbUser: dbData.user, profile: dbData.profile, isNewUser: false };
      }
    } catch (error) {
      setAuthError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Sign out
  const signOutUser = async () => {
    setLoading(true);
    try {
      await signOut(auth);
      setUser(null);
      setDbUser(null);
      setUserProfile(null);
      setAuthError(null);
    } catch (error) {
      setAuthError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Update Firebase user profile
  const updateUser = async (updatedData) => {
    try {
      await updateProfile(auth.currentUser, updatedData);

      // Also update in database
      if (dbUser) {
        await apiCall("/auth/me", {
          method: "PUT",
          body: JSON.stringify(updatedData),
        });
        await fetchCurrentUser();
      }
    } catch (error) {
      setAuthError(error.message);
      throw error;
    }
  };

  // Send password reset email
  const resetPassword = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      setAuthError(error.message);
      throw error;
    }
  };

  // Resend email verification
  const resendEmailVerification = async () => {
    if (auth.currentUser) {
      try {
        await sendEmailVerification(auth.currentUser);
      } catch (error) {
        setAuthError(error.message);
        throw error;
      }
    }
  };

  // Complete patient profile
  const completePatientProfile = async (profileData) => {
    try {
      const data = await apiCall("/auth/complete-patient-profile", {
        method: "POST",
        body: JSON.stringify(profileData),
      });
      await fetchCurrentUser();
      return data;
    } catch (error) {
      setAuthError(error.message);
      throw error;
    }
  };

  // Complete doctor profile
  const completeDoctorProfile = async (profileData) => {
    try {
      const data = await apiCall("/auth/complete-doctor-profile", {
        method: "POST",
        body: JSON.stringify(profileData),
      });
      await fetchCurrentUser();
      return data;
    } catch (error) {
      setAuthError(error.message);
      throw error;
    }
  };

  // Get doctor verification status
  const getDoctorVerificationStatus = async () => {
    try {
      const data = await apiCall("/auth/doctor-verification-status", {
        method: "GET",
      });
      return data;
    } catch (error) {
      console.error("Get verification status error:", error);
      throw error;
    }
  };

  // Role checking helpers
  const isAdmin = dbUser?.role === ROLES.ADMIN;
  const isDoctor = dbUser?.role === ROLES.DOCTOR;
  const isPatient = dbUser?.role === ROLES.PATIENT;
  const isVerifiedDoctor =
    isDoctor && userProfile?.verificationStatus === DOCTOR_VERIFICATION_STATUS.APPROVED;

  // Get redirect path based on role
  const getRedirectPath = () => {
    if (!dbUser) return "/";

    switch (dbUser.role) {
      case ROLES.ADMIN:
        return "/admin/dashboard";
      case ROLES.DOCTOR:
        if (userProfile?.verificationStatus === DOCTOR_VERIFICATION_STATUS.APPROVED) {
          return "/doctor/dashboard";
        }
        return "/doctor/verification-pending";
      case ROLES.PATIENT:
        return "/patient/dashboard";
      default:
        return "/";
    }
  };

  // Listen for auth state changes
  useEffect(() => {
    const unSubscribe = onAuthStateChanged(auth, async (currentUser) => {
      console.log("onAuthStateChanged fired, isRegistering:", isRegisteringRef.current);
      setUser(currentUser);

      if (currentUser) {
        // Skip fetching if we're in the middle of registration
        // The createUser function will set dbUser directly
        if (!isRegisteringRef.current) {
          try {
            // Try to fetch user from database
            await fetchCurrentUser();
          } catch (error) {
            // User might not be registered yet - this is expected during registration
            console.log("User not in database yet:", error.message);
          }
        } else {
          console.log("Skipping fetchCurrentUser - registration in progress");
        }
      } else {
        setDbUser(null);
        setUserProfile(null);
      }

      setLoading(false);
    });

    return () => {
      unSubscribe();
    };
  }, [fetchCurrentUser]);

  // Clear auth error after 5 seconds
  useEffect(() => {
    if (authError) {
      const timer = setTimeout(() => setAuthError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [authError]);

  const userInfo = {
    // Firebase user
    user,
    // Database user with role info
    dbUser,
    // Role-specific profile
    userProfile,
    // Loading state
    loading,
    // Auth error
    authError,
    setAuthError,

    // Auth functions
    createUser,
    signInUser,
    googleSignIn,
    signOutUser,
    updateUser,
    resetPassword,
    resendEmailVerification,

    // Database sync functions
    checkRegistration,
    registerUser,
    loginToDatabase,
    fetchCurrentUser,

    // Profile completion
    completePatientProfile,
    completeDoctorProfile,
    getDoctorVerificationStatus,

    // Role helpers
    isAdmin,
    isDoctor,
    isPatient,
    isVerifiedDoctor,
    getRedirectPath,

    // API helper
    apiCall,
    getAuthToken,

    // Constants
    ROLES,
    ACCOUNT_STATUS,
    DOCTOR_VERIFICATION_STATUS,
  };

  return <AuthContext.Provider value={userInfo}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
