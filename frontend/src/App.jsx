import { useEffect } from "react";
import PropTypes from "prop-types";
import FloatingShape from "./components/FloatingShape";
import { Toaster } from "react-hot-toast";
import { Routes, Route, Navigate } from "react-router-dom";

import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import EmailVerificationPage from "./pages/EmailVerificationPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import DashboardPage from "./pages/DashboardPage";
import LoadingSpinner from "./components/LoadingSpinner";

import { useAuthStore } from "./store/authStore";

// protected route that requires authentication
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore(); // get the isAuthenticated and user from the auth store

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!user.isVerified) {
    return <Navigate to="/verify-email" replace />;
  }

  return children;
}; // if the user is not authenticated redirect them to the login page, if the user is not verified redirect them to the verify-email page

const RedirectAuthenticatedUser = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();
  if (isAuthenticated && user.isVerified) {
    return <Navigate to="/" replace />;
  }

  return children;
}; // if the user is authenticated and verified redirect them to the home page

export default function App() {
  const { isCheckingAuth, checkAuth } = useAuthStore(); // get the checkAuth function, isCheckingAuth, isAuthenticated and user from the auth store

  useEffect(() => {
    checkAuth();
  }, [checkAuth]); // call the checkAuth function when the component mounts

  if (isCheckingAuth) return <LoadingSpinner />; // if the auth is still being checked
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-600 via-green-900 to-emerald-900 flex items-center justify-center relative overflow-hidden">
      <FloatingShape
        color="bg-green-500"
        size="w-64 h-64"
        top="-5%"
        left="10%"
        delay={0}
      />
      <FloatingShape
        color="bg-emerald-500"
        size="w-48 h-48"
        top="70%"
        left="80%"
        delay={5}
      />
      <FloatingShape
        color="bg-lime-500"
        size="w-32 h-32"
        top="40%"
        left="10%"
        delay={2}
      />

      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <RedirectAuthenticatedUser>
              <SignUpPage />
            </RedirectAuthenticatedUser>
          }
        />
        <Route
          path="/login"
          element={
            <RedirectAuthenticatedUser>
              <LoginPage />
            </RedirectAuthenticatedUser>
          }
        />
        <Route path="/verify-email" element={<EmailVerificationPage />} />
        <Route
          path="/forgot-password"
          element={
            <RedirectAuthenticatedUser>
              <ForgotPasswordPage />
            </RedirectAuthenticatedUser>
          }
        />
        <Route
          path="/reset-password/:token"
          element={
            <RedirectAuthenticatedUser>
              <ResetPasswordPage />
            </RedirectAuthenticatedUser>
          }
        />
      </Routes>
      <Toaster />
    </div>
  );
}
RedirectAuthenticatedUser.propTypes = {
  children: PropTypes.node.isRequired, //this is the prop type for the children and node is the type of the children
}
ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired, //this is the prop type for the children and node is the type of the children
};