import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import Input from "../components/Input";
import { Lock } from "lucide-react";
import toast from 'react-hot-toast';

import { useAuthStore } from "../store/authStore";

export default function ResetPasswordPage() {
  const [passsword, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { isLoading, error, message, resetPassword } = useAuthStore();

  const token = useParams();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if(passsword !== confirmPassword){
     alert("Passwords do not match");
     return;
    }
    
   try {
    await resetPassword(token, passsword);

    toast.success("Password reset successfully, redirecting to login page"); // can add timing to redirect like 3 2 1 go
    setTimeout(() => {
        navigate("/login");
    }, 2000);
   } catch (error) {
        toast.error(error.message || "Error resetting password");
   }
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-md w-full bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden"
    >
      <div className="p-8">
        <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text">
          Reset Password
        </h2>
        {error && (
          <div className="bg-red-500 text-white p-3 mb-4 rounded-md text-center">
            {error}
          </div>
        )}
        {message && (
          <div className="bg-green-500 text-white p-3 mb-4 rounded-md text-center">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <Input
            icon={Lock}
            type="password"
            placeholder="Enter new Password"
            value={passsword}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Input
            icon={Lock}
            type="password"
            placeholder="Confirm new Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "Reseting......" : "Set New Password"}
          </motion.button>
        </form>
      </div>
    </motion.div>
  );
}
