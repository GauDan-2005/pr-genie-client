import { useState } from "react";
import axios from "axios";

const useUser = () => {
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("userToken");

  const getUserRepos = async (
    cb: (data: [] | null, err: Error | unknown) => void
  ) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/repositories`,
        {
          headers: {
            Authorization: "Bearer " + token,
          },
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

  // Fixed getOpenPRs function
  const getOpenPRs = async (
    username: string,
    repoName: string,
    userToken: string,
    cb: (data: any[] | null, err: Error | unknown) => void
  ) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `https://api.github.com/repos/${username}/${repoName}/pulls`,
        {
          headers: {
            Authorization: `token ${userToken}`,
            "X-GitHub-Api-Version": "2022-11-28",
            Accept: "application/vnd.github+json",
          },
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

  const getUser = async (
    cb: (data: any | null, err: Error | unknown) => void
  ) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/user/`,
        {
          headers: {
            Authorization: "Bearer " + token,
          },
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
      localStorage.removeItem("userToken");

      window.location.href = "/";
    } catch (err) {
      console.error("Logout failed", err);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    getUser,
    getUserRepos,
    getOpenPRs,
    logoutUser,
  };
};

export default useUser;
