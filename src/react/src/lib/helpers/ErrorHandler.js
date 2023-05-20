import Cookies from "js-cookie";
import {notification} from "antd";

const ErrorHandler = async (error) => {
    let mes = [];
    if (error.response.data instanceof Blob) {
        const responseBlob = new Blob([error.response.data], {type: 'application/json'});
        const jsonData = await responseBlob.text();
        error.response.data = JSON.parse(jsonData);
    }

    if (error.response.data.message) {
        for (const [key, value] of Object.entries(error.response.data.message)) {
            value.forEach((val) => {
                mes.push(val);
            });
        }
    }

    notification["warning"]({
        message: error.response.data.title,
        description: mes.length > 0 ? (
            <ul className="pl-2">
                {mes.map((val) => (
                    <li>{val}</li>
                ))}
            </ul>
        ) : null,
    });


    if (error.response.status === 401) {

        setTimeout(() => {
            window.location.pathname !== "/admin/login" && window.location.replace("/admin/login");
        }, 1000);

        Cookies.remove("api_token");
    }
    return null;
}

export default ErrorHandler;
