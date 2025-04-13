import axios from "axios";

const newRequest = axios.create({
 // baseURL: "https://BlaBlaTripapi.onrender.com/api/",
   baseURL: "https://www.blablatrip.com/api",  // Change to your domain
   //baseURL: "http://localhost:8800/api",  // Change to your domain

  withCredentials: true,
});


export default newRequest;
