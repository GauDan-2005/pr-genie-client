// instance

import { useState } from "react";

const useOAuth = () => {
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

  return {
    loading,
    handleGitHubLogin,
  };
};

export default useOAuth;
