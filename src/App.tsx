import { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Login from "./pages/Login/Login";
import Dashboard from "./pages/Dashboard/Dashboard";
import Success from "./pages/Success/Success";
import { ThemeProvider } from "./context/ThemeContext";

function App() {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const userToken = localStorage.getItem("userToken");
    if (userToken) setToken(userToken);
  }, []);

  return (
    <ThemeProvider>
      <div className="App">
        {token ? (
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/*" element={<Navigate to="/dashboard" />} />
          </Routes>
        ) : (
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/success" element={<Success />} />

            {/* Add this before the catchall route */}
            {import.meta.env.VITE_TEMPO && <Route path="/tempobook/*" />}

            <Route path="/*" element={<Navigate to="/login" />} />
          </Routes>
        )}
      </div>
    </ThemeProvider>
  );
}

export default App;
