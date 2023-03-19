import Cookies from "js-cookie";

import { Route, useHistory } from "react-router-dom";

// A wrapper for <Route> that redirects to the login
// screen if you're not yet authenticated.
const PrivateRoute = ({ component, ...rest }) => {
  let history = useHistory();
  let auth = Cookies.get("api_token");

  if (auth === undefined) {
    history.push("/admin/login");
  }

  return <Route component={component} {...rest} />;
};

export default PrivateRoute;
