import axios from "axios";

const newRequest = axios.create({
 // baseURL: "https://geedersapi.onrender.com/api/",
 baseURL: "https://46.202.195.73:8800/api",

  withCredentials: true,
});

export default newRequest;
