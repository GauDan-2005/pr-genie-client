import useOAuth from "../../api/useOAuth";
import { FaGithub } from "react-icons/fa";
import styles from "./Login.module.css";

const Login = () => {
  const { handleGitHubLogin } = useOAuth();

  return (
    <div className={styles["login-container"]}>
      <div className={styles["login-card"]}>
        <div className={styles["login-header"]}>
          <FaGithub className={styles["github-icon"]} />
          <h1>Sign in to GitHub</h1>
        </div>
        <div className={styles["login-form"]}>
          <button
            className={styles["github-login-button"]}
            onClick={handleGitHubLogin}
          >
            <FaGithub /> Continue with GitHub
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
