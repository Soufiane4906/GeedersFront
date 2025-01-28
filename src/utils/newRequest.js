import axios from "axios";
import dotenv from "dotenv";

dotenv.config();
const processEnv = process.env; // Utilisez une variable locale pour stocker process.env
const nodeEnv = processEnv.NODE_ENV || "development";

const newRequest = axios.create({
 baseURL: processEnv.API_APP_BASE_URL,
 withCredentials: true,
});

export default newRequest;