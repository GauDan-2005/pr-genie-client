type Peops = {
  onLogin: () => void; // Define the onLogin prop type
};

const Login = (props: Peops) => {
  return (
    <div>
      <h1>Login with Github</h1>
      <button onClick={props.onLogin}>Login with GitHub</button>
    </div>
  );
};

export default Login;
