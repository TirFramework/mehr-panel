import Cookies from "js-cookie";

import { Route, useHistory } from "react-router-dom";

// A wrapper for <Route> that redirects to the login
// screen if you're not yet authenticated.
const PrivateRoute = ({ component, ...rest }) => {
  let history = useHistory();
  let auth = Cookies.get("api_token");

//   console.log( "🚀 ~ file: PrivateRoute.js ~ line 9 ~ PrivateRoute ~ auth", auth );

  if (auth === undefined) {
    history.push("/login");
  }

  return <Route component={component} {...rest} />;
};

export default PrivateRoute;
