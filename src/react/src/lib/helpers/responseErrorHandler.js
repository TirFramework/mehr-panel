import Config from "../../constants/config";
import { clearApiToken } from "../authToken";

const responseErrorHandler = (error) => {
    console.log("🚀 ~ responseErrorHandler ~ error:", error);
    let mes = [];

    if (error.response.data?.redirect !== undefined) {
        const page = window.location.pathname + window.location.search;
        const redirect = "/admin" + error.response.data?.redirect;

        setTimeout(() => {
            page !== redirect && window.location.replace(redirect);
        }, 500);
    }

    if (error.response?.status === 401) {
        setTimeout(() => {
            window.location.pathname !== `/${Config.perfix}/login` &&
                window.location.replace(`/${Config.perfix}/login`);
        }, 1000);

        clearApiToken();
    }

    if (error?.response?.data instanceof Blob) {
        const responseBlob = new Blob([error.response.data], {
            type: "application/json",
        });
        const jsonData = responseBlob.textSync();
        error.response.data = JSON.parse(jsonData);
    }

    console.log(
        "🚀 ~ responseErrorHandler ~ error?.response?.data:",
        error?.response?.data,
    );

    if (error?.response?.data?.message) {
        if (typeof error.response.data.message === "object") {
            for (const [key, value] of Object.entries(
                error.response.data.message,
            )) {
                value.forEach((val) => {
                    mes.push(val);
                });
            }
        } else {
            mes.push(error?.response?.data?.message);
        }
        return {
            message: error.response.data.title || "Error",
            description:
                mes.length > 0
                    ? // <ul className="pl-2">
                      //   {mes.map((val, index) => (
                      //     <li key={`error-${index}`}>{val}</li>
                      //   ))}
                      // </ul>
                      mes.map((val, index) => val)
                    : null,
            duration:
                error.response.data.duration === "undefined"
                    ? 10
                    : error.response.data.duration,
        };
    } else {
        return {
            message: "Unknown error",
            duration:
                error.response.data.duration === "undefined"
                    ? 10
                    : error.response.data.duration,
        };
    }
};

export default responseErrorHandler;
