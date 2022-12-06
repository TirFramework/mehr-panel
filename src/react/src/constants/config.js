let apiBaseUrl = "";
let storage = "";
if (process.env.NODE_ENV === "development") {
  apiBaseUrl = "/api/v1/admin";
  storage = "/storage";
} else {
  apiBaseUrl = "/api/v1/admin";
  storage = "/storage";
}

const Config = {
  apiBaseUrl,
  storage,
};

export default Config;
