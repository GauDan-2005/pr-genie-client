import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const Success = () => {
  console.log("callback");

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  useEffect(() => {
    const token = searchParams.get("token") || "";
    if (token) {
      localStorage.setItem("userToken", token);
      navigate("/dashboard");
    } else {
      navigate("/login");
    }
  }, [searchParams]);

  return <div>Authenticating...</div>;
};

export default Success;
