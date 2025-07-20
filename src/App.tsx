import { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Login from "./pages/Login/Login";
import Success from "./pages/Success/Success";
import Home from "./pages/Home/Home";
import Overview from "@/pages/Overview";
import Repositories from "./pages/Repositories";
import AIComments from "./pages/ai-comments";
import RepositoryPageBase from "./pages/Repositories/RepositoryPageBase";
import RepositoryPage from "./pages/Repositories/RepositoryPage";

function App() {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const userToken = localStorage.getItem("userToken");
    if (userToken) setToken(userToken);
  }, []);

  return (
    <div className="min-w-full min-h-screen">
      {token ? (
        <Routes>
          <Route path="/" element={<Home />}>
            <Route index element={<Navigate to="/overview" replace />} />
            <Route path="overview" element={<Overview />} />
            <Route path="repositories" element={<Repositories />} />
            <Route path="repositories/:id" element={<RepositoryPage />} />
            <Route
              path="repositories/active"
              element={<RepositoryPageBase filterType="active" />}
            />
            <Route
              path="repositories/starred"
              element={<RepositoryPageBase filterType="starred" />}
            />
            <Route
              path="repositories/forked"
              element={<RepositoryPageBase filterType="forked" />}
            />
            <Route
              path="repositories/private"
              element={<RepositoryPageBase filterType="private" />}
            />
            <Route
              path="repositories/public"
              element={<RepositoryPageBase filterType="public" />}
            />
            <Route
              path="repositories/archived"
              element={<RepositoryPageBase filterType="archived" />}
            />
            <Route path="ai-comments" element={<AIComments />} />
            <Route path="*" element={<Navigate to="/overview" replace />} />
          </Route>
        </Routes>
      ) : (
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/success" element={<Success />} />
          <Route path="/*" element={<Navigate to="/login" />} />
        </Routes>
      )}
    </div>
  );
}

export default App;
