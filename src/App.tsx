import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import Login from "./pages/Login/Login";
import Dashboard from "./pages/Dashboard/Dashboard";
import useUser from "./api/useUser";
import axios from "axios";
import GitHubCallback from "./pages/GithubCallback/GithubCallback";

function App() {
  const [userToken, setUserToken] = useState(null); // Store the user data
  const { handleGitHubLogin } = useUser();

  const checkLoginStatus = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/auth/user`,
        {
          withCredentials: true,
        }
      );

      if (response.data.user) {
        setUserToken(response.data.user); // Set user data if authenticated
        localStorage.setItem("user", JSON.stringify(response.data.accessToken));
      }
    } catch (error) {
      setUserToken(null); // Set user as null if not authenticated
      console.log(error);
    }
  };

  useEffect(() => {
    checkLoginStatus(); // Check authentication status on mount
  }, []);

  return (
    <div className="App">
      {userToken ? (
        <Routes>
          <Route
            path="/dashboard"
            element={<Dashboard userToken={userToken} />}
          />
          <Route path="/*" element={<Dashboard userToken={userToken} />} />
        </Routes>
      ) : (
        <Routes>
          <Route
            path="/login"
            element={<Login onLogin={handleGitHubLogin} />}
          />
          <Route path="/auth/github/callback" element={<GitHubCallback />} />

          <Route path="/*" element={<Login onLogin={handleGitHubLogin} />} />
        </Routes>
      )}
    </div>
  );
}

export default App;
