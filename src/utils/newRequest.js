import axios from "axios";

const newRequest = axios.create({
 // baseURL: "https://BlaBlaTripapi.onrender.com/api/",
 baseURL: "https://46.202.195.73/api",


  withCredentials: true,
});

export default newRequest;
