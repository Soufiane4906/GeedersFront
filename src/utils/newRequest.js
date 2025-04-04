import axios from "axios";

// Récupérer l'URL de base depuis les variables d'environnement
const API_BASE_URL = import.meta.env.VITE_API_APP_BASE_URL || "http://localhost:8800/api";

const newRequest = axios.create({
 baseURL: API_BASE_URL,
 withCredentials: true,
});

export default newRequest;
