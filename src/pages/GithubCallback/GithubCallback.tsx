import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { errorToast } from "../../lib/toast";

const GitHubCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const fetchToken = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get("code");

      try {
        const response = await axios.get(
          `${
            import.meta.env.VITE_BACKEND_URL
          }/auth/github/callback?code=${code}`
        );

        if (response.status !== 200) {
          errorToast("Authentication failed");
          return;
        }

        navigate("/dashboard");
      } catch (error) {
        console.error("Error during GitHub authentication", error);
      }
    };

    fetchToken();
  }, [navigate]);

  return <div>Authenticating...</div>;
};

export default GitHubCallback;
