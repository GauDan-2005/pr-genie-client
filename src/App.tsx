import { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Login from "./pages/Login/Login";
import Dashboard from "./pages/Dashboard/Dashboard";
import useUser from "./api/useUser";
import axios from "axios";
import GitHubCallback from "./pages/GithubCallback/GithubCallback";
import { ToastContainer } from "react-toastify";

function App() {
  const [user, setUser] = useState(null);
  const { handleGitHubLogin } = useUser();

  const checkLoginStatus = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/auth/user`,
        {
          withCredentials: true,
        }
      );
      console.log(response);
      if (response.data) {
        setUser(response.data); // Set user data if authenticated
        localStorage.setItem("user", JSON.stringify(response.data));
      }
    } catch (error) {
      setUser(null);
      console.log(error);
    }
  };

  useEffect(() => {
    checkLoginStatus();
  }, []);

  return (
    <div className="App">
      {user ? (
        <Routes>
          <Route path="/dashboard" element={<Dashboard user={user} />} />
          <Route path="/*" element={<Navigate to="/dashboard" />} />
        </Routes>
      ) : (
        <Routes>
          <Route
            path="/login"
            element={<Login onLogin={handleGitHubLogin} />}
          />
          <Route path="/auth/github/callback" element={<GitHubCallback />} />

          <Route path="/*" element={<Navigate to="/login" />} />
        </Routes>
      )}
      <ToastContainer />
    </div>
  );
}

export default App;
