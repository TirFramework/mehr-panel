import Cookies from "js-cookie";
import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

function PublicLayout(props) {
  return (
    <div>
      <Outlet />
    </div>
  );
}

export default PublicLayout;
