import axios from "axios";
import dotenv from "dotenv";

const nodeEnv = "development";

const newRequest = axios.create({
 baseURL: "http://localhost:8800/api",
 withCredentials: true,
});

export default newRequest;