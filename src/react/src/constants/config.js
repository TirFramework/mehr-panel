let apiBaseUrl = "";
let storage = "";
if (process.env.NODE_ENV === "development") {
  apiBaseUrl = "http://127.0.0.1:8000/api/v1/admin";
  storage = "http://127.0.0.1:8000/storage";
} else {
  apiBaseUrl = "/api/v1/admin";
  storage = "/storage";
}

const Config = {
  apiBaseUrl,
  storage,
};

export default Config;
