import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FaSpinner } from "react-icons/fa";
import styles from "./Success.module.css";

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
  }, [searchParams, navigate]);

  return (
    <div className={styles["success-container"]}>
      <div className={styles["success-card"]}>
        <div className={styles["spinner-container"]}>
          <FaSpinner className={styles["spinner-icon"]} />
        </div>
        <h2>Authenticating...</h2>
        <p>Please wait while we complete your GitHub authentication.</p>
      </div>
    </div>
  );
};

export default Success;
