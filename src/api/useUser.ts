import { useState } from "react";
import axios from "axios";

const useUser = () => {
  const [loading, setLoading] = useState(false);

  const handleGitHubLogin = () => {
    try {
      setLoading(true);
      window.location.href = `${import.meta.env.VITE_BACKEND_URL}/auth/github`;
      setLoading(false);
    } catch (err) {
      console.error("Github Login Failed", err);
    } finally {
      setLoading(false);
    }
  };

  const handleGitHubCallback = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/auth/github/callback`
      );
      const userData = response.data;

      localStorage.setItem("user", JSON.stringify(userData.user));
    } catch (error) {
      console.error("Authentication failed", error);
    } finally {
      setLoading(false);
    }
  };

  const getUserRepos = async (
    cb: (data: [] | null, err: Error | unknown) => void
  ) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/user`,
        {
          withCredentials: true,
        }
      );

      if (response.status !== 200) {
        throw new Error(
          response.data.error || "Some error occurred, please try again"
        );
      }

      if (cb && typeof cb === "function") {
        cb(response.data, null);
      }
    } catch (err) {
      console.error(err);

      if (cb && typeof cb === "function") {
        cb(null, err);
      }
    } finally {
      setLoading(false);
    }
  };

  const logoutUser = async () => {
    try {
      setLoading(true);
      // Send logout request to the backend
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/auth/logout`,
        {
          withCredentials: true,
        }
      );

      if (response.status !== 200) {
        throw new Error(
          response.data.error || "Logout unsuccessful, Try again"
        );
      }

      localStorage.removeItem("user");

      window.location.href = "/";
    } catch (err) {
      console.error("Logout failed", err);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    getUserRepos,
    handleGitHubLogin,
    handleGitHubCallback,
    logoutUser,
  };
};

export default useUser;
