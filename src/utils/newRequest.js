import axios from "axios";

const newRequest = axios.create({
 // baseURL: "https://BlaBlaTripapi.onrender.com/api/",
 //baseURL: "https://46.202.195.73:8800/api",
 baseURL: "https://www.blablatrip.com/api", // Correct base URL


  withCredentials: true,
});

export default newRequest;
