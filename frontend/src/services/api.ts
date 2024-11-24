import axios from "axios";

const baseUrl = process.env.REACT_APP_API_URL || "http://localhost:3333";

export const api = axios.create({
  baseURL: baseUrl,
});
