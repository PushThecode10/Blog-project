// src/axios.js
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true, // Only if your backend uses cookies/sessions
});
export default API;