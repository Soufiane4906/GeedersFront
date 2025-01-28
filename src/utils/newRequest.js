import axios from "axios";

const newRequest = axios.create({
 // baseURL: "https://BlaBlaTripapi.onrender.com/api/",
 baseURL: "/api/",


  withCredentials: true,
});

export default newRequest;
