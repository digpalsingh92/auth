import { create } from "zustand";
import axios from "axios";

const API_URL = "http://localhost:4000/api/auth";

axios.defaults.withCredentials = true; // make sure to send cookies when making requests

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  error: null,
  isLoading: false,
  isCheckingAuth: true,
  message: null,

  signup: async (email, password, name) => {
    set({ isLoading: true, error: null }); // set the loading state to true and clear any previous error
    try {
      const response = await axios.post(`${API_URL}/signup`, {
        email,
        password,
        name,
      }); // make a post request to the signup endpoint
      set({
        user: response.data.user,
        isAuthenticated: true,
        isLoading: false,
      }); // set the user, isAuthenticated and loading state
    } catch (error) {
      set({
        error: error.response.data.message || "Error Signing up",
        isLoading: false,
      }); // set the error and loading state
      throw error; // throw the error
    }
  },
  login: async (email, password) => {
    set({ isLoading: true, error: null }); // set the loading state to true and clear any previous error
    try {
      const response = await axios.post(`${API_URL}/login`, {
        email,
        password,
      }); // make a post request to the login endpoint
      set({
        user: response.data.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      }); // set the user, isAuthenticated and loading state
    } catch (error) {
      set({
        error: error.response.data.message || "Error Logging in",
        isLoading: false,
      }); // set the error and loading state
      throw error; // throw the error
    }
  },
  logout: async () => {
    set({ isLoading: true, error: null });
    try {
      await axios.post(`${API_URL}/logout`);
      set({
        user: null,
        isAuthenticated: false,
        error: null,
        isLoading: false,
      });
    } catch (error) {
      set({ error: "Error logging out", isLoading: false });
      throw error;
    }
  },
  verifyEmail: async (code) => {
    set({ isLoading: true, error: null }); // set the loading state to true and clear any previous error
    try {
      const response = await axios.post(`${API_URL}/verify-email`, { code }); // make a post request to the verify-email endpoint
      console.log(code);
      set({
        user: response.data.user,
        isAuthenticated: true,
        isLoading: false,
      }); // set the user, isAuthenticated and loading state
      return response.data; // return the user
    } catch (error) {
      set({
        error: error.response.data.message || "Error Verifying Email",
        isLoading: false,
      }); // set the error and loading state
      throw error; // throw the error
    }
  },
  checkAuth: async () => {
    // await new Promise((resolve) => setTimeout(resolve, 2000)); // wait for 1 second
    set({ isCheckingAuth: true, error: null }); // set the isCheckingAuth state to true
    try {
      const response = await axios.get(`${API_URL}/check-auth`); // make a get request to the check-auth endpoint to check if the user is authenticated
      set({
        user: response.data.user,
        isAuthenticated: true,
        isCheckingAuth: false,
      }); // set the user, isAuthenticated and isCheckingAuth state to true
    } catch (error) {
      set({ error: null, isCheckingAuth: false, isAuthenticated: false }); // set the error and isCheckingAuth state to false
    }
  },
  forgotPassword: async (email) => {
    set({ isLoading: true, error: null }); // set the loading state to true and clear any previous error
    try {
      const response = await axios.post(`${API_URL}/forgot-password`, {
        email,
      }); // make a post request to the forgot-password endpoint
      set({ message: response.data.message, isLoading: false }); // set the loading state to false
    } catch (error) {
      set({
        error:
          error.response.data.message || "Error Sending Reset Password Email",
        isLoading: false,
      }); // set the error and loading state
      throw error; // throw the error
    }
  },
  resetPassword: async ({token}, password) => {
    set({ isLoading: true, error: null }); // set the loading state to true and clear any previous error
    try {
      console.log(token)
      const response = await axios.post(`${API_URL}/reset-password/${token}`, {
        password,
      }); // make a post request to the reset-password endpoint
      set({ message: response.data.message, isLoading: false }); // set the message and loading state
    } catch (error) {
      set({
        error: error.response.data.message || "Error Resetting Password",
        isLoading: false,
      }); // set the error and loading state
      throw error; // throw the error
    }
  },
}));
