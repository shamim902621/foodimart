const API_BASE_URL = "http://localhost:5000/api";
// const API_BASE_URL = "https://ungrudged-elisa-prefectural.ngrok-free.dev/api";


const SOCKET_URL =
  process.env.NODE_ENV === "production"
    ? "https://ungrudged-elisa-prefectural.ngrok-free.dev/api"
    : "http://localhost:5000";


const WEB_URL = "http://localhost:8081";
const MOBILE_URL = "exp://localhost:19000";


export {
  API_BASE_URL, MOBILE_URL, SOCKET_URL,
  WEB_URL
};

