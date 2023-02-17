import axios from "axios";

const api = axios.create({
  baseURL: "https://pqwebapi.azurewebsites.net/api",
});

export default api;
