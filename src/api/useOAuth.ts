// instance
import axios from "axios";
// import { axios_instance, status_text } from "../lib/axios";

// toast
// import { errorToast, successToast } from "../lib/toast";

const useOAuth = () => {
  // const getRedirectUri = async (callback) => {
  //   try {
  //     const response = await axios.get(
  //       `${import.meta.env.VITE_BACKEND_URL}/auth/github/callback`
  //     );
  //     // handle failure
  //     if (!response?.ok) {
  //       errorToast("Failed to get redirect uri. Please try again.");
  //     }

  //     // check for callback
  //     if (callback && typeof callback === "function") {
  //       callback(response, null);
  //     }
  //   } catch (error) {
  //     callback(null, error);
  //   } finally {
  //     console.log(
  //       "Get redirect uri request completed. This message is displayed regardless of success or failure."
  //     );
  //   }
  // };

  // const getOAuthCode = async (options, callback) => {
  //   try {
  //     const response = await axios.request(options);

  //     // handle failure
  //     if (![200, 201].includes(response?.status || response?.data?.status)) {
  //       errorToast("Failed to get oauth code. Please try again.");
  //     }

  //     // check for callback
  //     if (callback && typeof callback === "function") {
  //       callback(response?.data, null);
  //     }
  //   } catch (error) {
  //     callback(null, error);
  //   } finally {
  //     console.log(
  //       "Get oauth code request completed. This message is displayed regardless of success or failure."
  //     );
  //   }
  // };

  // const verifyOAuthToken = async (payload, callback) => {
  //   console.log(INTEGERATION_TYPE);
  //   try {
  //     const response = await fetch(
  //       `${
  //         import.meta.env.VITE_BACKEND_URL
  //       }/v1/oauth/${INTEGERATION_TYPE}/verify`,
  //       {
  //         method: "POST",
  //         credentials: "include",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify(payload),
  //       }
  //     );
  //     // handle failure
  //     if (!response.ok) {
  //       errorToast("Failed to verify oauth token. Please try again.");
  //     }

  //     // check for callback
  //     if (callback && typeof callback === "function") {
  //       const data = await response.json();
  //       console.log(response, data);
  //       callback(data, null);
  //     }
  //   } catch (error) {
  //     callback(null, error);
  //   } finally {
  //     console.log(
  //       "Verify oauth token request completed. This message is displayed regardless of success or failure."
  //     );
  //   }
  // };

  const handleGitHubCallback = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/auth/github/callback`
      );
      const userData = response.data;

      // Store the user data (e.g., token) in local storage
      localStorage.setItem("user", JSON.stringify(userData.user));

      // Redirect or update UI as needed
    } catch (error) {
      console.error("Authentication failed", error);
    }
  };

  return {
    // getRedirectUri,
    // verifyOAuthToken,
    // getOAuthCode,
    handleGitHubCallback,
  };
};

export default useOAuth;
