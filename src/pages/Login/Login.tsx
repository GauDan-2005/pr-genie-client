import useOAuth from "../../api/useOAuth";

const Login = () => {
  const { handleGitHubLogin } = useOAuth();

  return (
    <div>
      <h1>Login with Github</h1>
      <button onClick={handleGitHubLogin}>Login with GitHub</button>
    </div>
  );
};

export default Login;
