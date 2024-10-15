import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import Login from "./pages/Login/Login";
import Dashboard from "./pages/Dashboard/Dashboard";
import useUser from "./api/useUser";
// import { errorToast } from "./lib/toast";
import axios from "axios";

function App() {
  const [user, setUser] = useState(null); // Store the user data
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
        setUser(response.data.user); // Set user data if authenticated
        localStorage.setItem("user", JSON.stringify(response.data.user));
      }
    } catch (error) {
      setUser(null); // Set user as null if not authenticated
      console.log(error);
    }
  };

  useEffect(() => {
    checkLoginStatus(); // Check authentication status on mount
  }, []);

  return (
    <div className="App">
      {user ? (
        <>
          <Routes>
            <Route path="/dashboard" element={<Dashboard user={user} />} />
            <Route path="/*" element={<Dashboard user={user} />} />
          </Routes>
        </>
      ) : (
        <>
          <Route
            path="/login"
            element={<Login onLogin={handleGitHubLogin} />}
          />
          <Route path="/*" element={<Login onLogin={handleGitHubLogin} />} />
        </>
      )}
    </div>
  );
}

export default App;
