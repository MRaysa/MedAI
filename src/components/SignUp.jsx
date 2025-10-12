import React, { useState, useContext } from "react";
import { motion } from "framer-motion";
import {
  FaGoogle,
  FaUser,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaImage,
  FaPhone,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { useNavigate, Link } from "react-router";
import { AuthContext } from "../contexts/AuthContext";
import Swal from "sweetalert2";

const SignUp = () => {
  const { createUser, googleSignIn, updateUser, loading } =
    useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    photoURL: "",
    phone: "",
    address: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState(null);
  const [useImageUrl, setUseImageUrl] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z]).{6,}$/;
    const phoneRegex = /^[0-9]{10,15}$/;

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.includes("@"))
      newErrors.email = "Valid email is required";
    if (!passwordRegex.test(formData.password)) {
      newErrors.password =
        "Password must be at least 6 characters with uppercase and lowercase";
    }
    if (formData.phone && !phoneRegex.test(formData.phone)) {
      newErrors.phone = "Please enter a valid phone number";
    }
    if (formData.photoURL && !isValidUrl(formData.photoURL)) {
      newErrors.photoURL = "Please enter a valid image URL";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleImageUrlChange = (e) => {
    const url = e.target.value;
    setFormData((prev) => ({ ...prev, photoURL: url }));

    if (isValidUrl(url)) {
      setImagePreview(url);
    } else {
      setImagePreview(null);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData((prev) => ({ ...prev, photoURL: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const saveUserToDatabase = async (userProfile) => {
    try {
      const response = await fetch("http://localhost:3000/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userProfile),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error saving user to database:", error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      // Create user with email and password
      const userCredential = await createUser(
        formData.email,
        formData.password
      );
      const user = userCredential.user;

      // Prepare user profile for database
      const userProfile = {
        uid: user.uid,
        displayName: formData.name,
        email: formData.email,
        photoURL: formData.photoURL || "",
        phoneNumber: formData.phone || "",
        address: formData.address || "",
        createdAt: new Date().toISOString(),
      };

      // Update Firebase user profile
      await updateUser({
        displayName: formData.name,
        photoURL: formData.photoURL || "",
      });

      // Save to MongoDB
      const dbResponse = await saveUserToDatabase(userProfile);

      if (dbResponse.insertedId) {
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Your account has been created successfully!",
          showConfirmButton: false,
          timer: 1500,
        });
        navigate("/");
      }
    } catch (error) {
      console.error("Signup error:", error);
      setErrors({ firebase: error.message });
    }
  };

  const handleGoogleRegister = async () => {
    try {
      const result = await googleSignIn();
      const user = result.user;

      // Prepare user profile from Google auth
      const userProfile = {
        uid: user.uid,
        displayName: user.displayName || "",
        email: user.email || "",
        photoURL: user.photoURL || "",
        phoneNumber: "",
        address: "",
        createdAt: new Date().toISOString(),
      };

      // Save to MongoDB
      await saveUserToDatabase(userProfile);

      navigate("/");
    } catch (error) {
      setErrors({ firebase: error.message });
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white rounded-xl shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-center">
          <h1 className="text-3xl font-bold text-white">Create Account</h1>
          <p className="text-indigo-100 mt-2">Join us today!</p>
        </div>

        {/* Error Message */}
        {errors.firebase && (
          <div className="px-8 pt-6">
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
              <p>{errors.firebase}</p>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-4">
          {/* Profile Picture Section */}
          <div className="flex flex-col items-center space-y-2">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border-2 border-indigo-100">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Profile preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <FaImage className="text-gray-400 text-3xl" />
                )}
              </div>
            </div>

            <div className="w-full">
              <div className="flex items-center mb-2">
                <input
                  type="radio"
                  id="upload-option"
                  name="image-option"
                  checked={!useImageUrl}
                  onChange={() => setUseImageUrl(false)}
                  className="mr-2"
                />
                <label
                  htmlFor="upload-option"
                  className="text-sm text-gray-700"
                >
                  Upload Image
                </label>
              </div>

              {!useImageUrl && (
                <label className="block w-full">
                  <span className="sr-only">Choose profile photo</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="block w-full text-sm text-gray-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-md file:border-0
                      file:text-sm file:font-semibold
                      file:bg-indigo-50 file:text-indigo-700
                      hover:file:bg-indigo-100"
                  />
                </label>
              )}

              <div className="flex items-center mt-2">
                <input
                  type="radio"
                  id="url-option"
                  name="image-option"
                  checked={useImageUrl}
                  onChange={() => setUseImageUrl(true)}
                  className="mr-2"
                />
                <label htmlFor="url-option" className="text-sm text-gray-700">
                  Use Image URL
                </label>
              </div>

              {useImageUrl && (
                <div className="mt-1">
                  <input
                    type="text"
                    name="photoURL"
                    value={formData.photoURL}
                    onChange={handleImageUrlChange}
                    placeholder="https://example.com/image.jpg"
                    className={`w-full px-3 py-2 border ${
                      errors.photoURL ? "border-red-500" : "border-gray-300"
                    } rounded-md text-sm shadow-sm`}
                  />
                  {errors.photoURL && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.photoURL}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Name Field */}
          <div className="space-y-1">
            <label
              htmlFor="name"
              className="flex items-center text-sm font-medium text-gray-700"
            >
              <FaUser className="mr-2 text-indigo-500" />
              Full Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-4 py-2 border ${
                errors.name ? "border-red-500" : "border-gray-300"
              } rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition`}
              placeholder="John Doe"
              required
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name}</p>
            )}
          </div>

          {/* Email Field */}
          <div className="space-y-1">
            <label
              htmlFor="email"
              className="flex items-center text-sm font-medium text-gray-700"
            >
              <FaEnvelope className="mr-2 text-indigo-500" />
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-4 py-2 border ${
                errors.email ? "border-red-500" : "border-gray-300"
              } rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition`}
              placeholder="your@email.com"
              required
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          {/* Password Field */}
          <div className="space-y-1">
            <label
              htmlFor="password"
              className="flex items-center text-sm font-medium text-gray-700"
            >
              <FaLock className="mr-2 text-indigo-500" />
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-4 py-2 border ${
                  errors.password ? "border-red-500" : "border-gray-300"
                } rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition`}
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <FaEyeSlash className="text-gray-500" />
                ) : (
                  <FaEye className="text-gray-500" />
                )}
              </button>
            </div>
            {errors.password ? (
              <p className="text-red-500 text-xs mt-1">{errors.password}</p>
            ) : (
              <p className="text-gray-500 text-xs mt-1">
                Must be at least 6 characters with uppercase and lowercase
              </p>
            )}
          </div>

          {/* Phone Number Field */}
          <div className="space-y-1">
            <label
              htmlFor="phone"
              className="flex items-center text-sm font-medium text-gray-700"
            >
              <FaPhone className="mr-2 text-indigo-500" />
              Phone Number
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              className={`w-full px-4 py-2 border ${
                errors.phone ? "border-red-500" : "border-gray-300"
              } rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition`}
              placeholder="1234567890"
            />
            {errors.phone && (
              <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
            )}
          </div>

          {/* Address Field */}
          <div className="space-y-1">
            <label
              htmlFor="address"
              className="flex items-center text-sm font-medium text-gray-700"
            >
              <FaMapMarkerAlt className="mr-2 text-indigo-500" />
              Address
            </label>
            <textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              placeholder="123 Main St, City, Country"
              rows="2"
            />
          </div>

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className={`w-full py-3 px-4 mt-4 rounded-lg text-white font-semibold ${
              loading ? "bg-indigo-400" : "bg-indigo-600 hover:bg-indigo-700"
            } transition-colors shadow-md`}
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </motion.button>

          {/* Divider */}
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">
                Or sign up with
              </span>
            </div>
          </div>

          {/* Social Login Buttons */}
          <div className="flex justify-center">
            <motion.button
              whileHover={{ y: -2 }}
              type="button"
              onClick={handleGoogleRegister}
              className="flex items-center justify-center py-2 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            >
              <FaGoogle className="text-red-500 mr-2" />
              <span>Google</span>
            </motion.button>
          </div>
        </form>

        {/* Footer */}
        <div className="bg-gray-50 px-8 py-4 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              to="/signin"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default SignUp;
