import axios from "axios";

const newRequest = axios.create({
  baseURL: "https://geedersapi.onrender.com/api/",

  withCredentials: true,
});

export default newRequest;
