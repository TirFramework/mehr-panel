import Cookies from "js-cookie";

import { Redirect, useHistory } from "react-router-dom";

function Login() {
  let history = useHistory();

  const login = () => {
    Cookies.set("api_token", "a");
    history.push("/admin/dashboard");
  };

  return (
    <div>
      <p>You must log in to view the page at </p>
      <button onClick={login}>Log in</button>
    </div>
  );
}

export default Login;
