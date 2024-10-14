const Login = () => {
  const loginWithGithub = () => {
    // Redirect to the backend's GitHub auth route
    window.location.href = "/auth/github";
  };
  return (
    <div>
      <button onClick={loginWithGithub}>Login with GitHub</button>
    </div>
  );
};

export default Login;
