import { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import Login from "./pages/Login/Login";

import "./App.css";

function App() {
  // const [user, setUser] = useState(null);

  useEffect(() => {
    const checkLoginStatus = async () => {};

    checkLoginStatus();
  }, []);

  // const logout = async () => {
  //   try {
  //     await axios.get("/auth/logout", {
  //       withCredentials: true,
  //     });
  //     setUser(null);
  //   } catch (error) {
  //     console.error("Error logging out:", error);
  //   }
  // };

  return (
    <div className="App">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/*" element={<Login />} />
      </Routes>
    </div>
  );
}

export default App;
