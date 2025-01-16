import { useState } from "react";
import axios from "axios";

const useWebhooks = () => {
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("userToken");

  const createWebhook = async (repoName: string) => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/webhooks/create-webhook`,
        { repo: repoName }, // Pass repo name and owner
        {
          headers: {
            Authorization: "Bearer " + token,
          },
          withCredentials: true, // Include credentials to allow session cookies
        }
      );
      if (response.status !== 200) {
        throw new Error(
          response.data.error || "Some error occurred, please try again"
        );
      }
      setLoading(false);
      return response.data;
    } catch (err) {
      setLoading(false);
      console.error("Error creating webhook:", err);
      return { message: "Error creating webhook" };
    }
  };

  return { loading, createWebhook };
};

export default useWebhooks;
