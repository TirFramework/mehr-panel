import React, { useEffect } from "react";
import Cookies from "js-cookie";
import { Outlet, useNavigate } from "react-router-dom";

function PublicLayout(props) {
  return (
    <div>
      <Outlet />
    </div>
  );
}

export default PublicLayout;
