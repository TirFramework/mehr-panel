import Cookies from "js-cookie";
import { notification } from "antd";

const ErrorHandler = async (error) => {
  let mes = [];
  if (error.response.data instanceof Blob) {
    const responseBlob = new Blob([error.response.data], {
      type: "application/json",
    });
    const jsonData = await responseBlob.text();
    error.response.data = JSON.parse(jsonData);
  }

  if (error.response.data.message) {
    if (typeof error.response.data.message === "object") {
      for (const [key, value] of Object.entries(error.response.data.message)) {
        value.forEach((val) => {
          mes.push(val);
        });
      }
    } else {
      mes.push(error.response.data.message);
    }
    notification["warning"]({
      message: error.response.data.title,
      description:
        mes.length > 0 ? (
          <ul className="pl-2">
            {mes.map((val, index) => (
              <li key={`error-${index}`}>{val}</li>
            ))}
          </ul>
        ) : null,
      duration:
        error.response.data.duration === "undefined"
          ? 10
          : error.response.data.duration,
    });
  } else {
    notification["warning"]({
      message: "Unknown error",
      duration:
        error.response.data.duration === "undefined"
          ? 10
          : error.response.data.duration,
    });
  }

  if (error.response.data?.redirect !== undefined) {
    const page = window.location.pathname + window.location.search;
    const redirect = "/admin" + error.response.data?.redirect;

    setTimeout(() => {
      page !== redirect && window.location.replace(redirect);
    }, 500);
  }

  if (error.response.status === 401) {
    setTimeout(() => {
      window.location.pathname !== "/admin/login" &&
        window.location.replace("/admin/login");
    }, 1000);

    Cookies.remove("api_token");
  }
  return null;
};

export default ErrorHandler;
