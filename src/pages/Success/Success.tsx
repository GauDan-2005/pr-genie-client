import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const Success = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  useEffect(() => {
    const token = searchParams.get("token") || "";
    if (token) {
      localStorage.setItem("userToken", token);
      navigate("/");
    } else {
      navigate("/login");
    }
  }, [searchParams]);

  return <div>Authenticating...</div>;
};

export default Success;
