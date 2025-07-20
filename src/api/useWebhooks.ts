import { useState } from "react";
import axios from "axios";
import { Repo } from "../utils/type";

const useWebhooks = () => {
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("userToken");

  const createWebhook = async (repo: Repo) => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/webhooks/create-webhook`,
        { repo }, // Pass repo name and owner
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

  const deleteWebhook = async (repo: Repo) => {
    setLoading(true);
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/webhooks/delete-webhook`,
        {
          headers: {
            Authorization: "Bearer " + token,
          },
          withCredentials: true,
          data: { repo }, // Pass repo data in request body for DELETE
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
      console.error("Error deleting webhook:", err);
      return { message: "Error deleting webhook" };
    }
  };

  return { loading, createWebhook, deleteWebhook };
};

export default useWebhooks;
