import axios from "axios";

const newRequest = axios.create({
 // baseURL: "https://BlaBlaTripapi.onrender.com/api/",
 baseURL: "http://46.202.195.73:8800/api",


  withCredentials: true,
});

export default newRequest;
