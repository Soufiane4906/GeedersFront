import newRequest from "./newRequest";
import { toast } from "react-toastify";

// Envoyer un message texte
export const sendTextMessage = async (conversationId, text, queryClient) => {
    try {
        const res = await newRequest.post("/messages", {
            conversationId,
            desc: text,
            type: "text"
        });

        queryClient.invalidateQueries(["messages", conversationId]);
        return res.data;
    } catch (error) {
        console.error("Error sending text message:", error);
        throw error;
    }
};

// Envoyer un message audio
// Envoyer un message audio
export const sendAudioMessage = async (conversationId, audioBlob, duration, queryClient) => {
    try {
        const formData = new FormData();
        formData.append("file", audioBlob, "audio.mp3");

        // Uploader le fichier audio
        const uploadRes = await newRequest.post("/messages/upload", formData);
        const fileUrl = uploadRes.data.fileUrl;

        // Créer le message audio
        const res = await newRequest.post("/messages", {
            conversationId,
            desc: "Message audio",
            type: "audio",
            fileUrl,
            duration
        });

        queryClient.invalidateQueries(["messages", conversationId]);
        return res.data;
    } catch (error) {
        console.error("Error sending audio message:", error);
        throw error;
    }
};
// Uploader un fichier
export const uploadFile = async (conversationId, file, queryClient) => {
    try {
        const formData = new FormData();
        formData.append("file", file);

        // Uploader le fichier
        const uploadRes = await newRequest.post("/upload", formData);
        const fileUrl = uploadRes.data.url;

        // Déterminer le type de message (image ou fichier)
        const isImage = file.type.startsWith("image/");
        const messageType = isImage ? "image" : "file";

        // Créer le message avec le fichier
        const res = await newRequest.post("/messages", {
            conversationId,
            desc: file.name,
            type: messageType,
            fileUrl
        });

        queryClient.invalidateQueries(["messages", conversationId]);
        return res.data;
    } catch (error) {
        console.error("Error uploading file:", error);
        throw error;
    }
};

// Partager la localisation
export const shareLocation = async (conversationId, latitude, longitude, queryClient) => {
    try {
        const res = await newRequest.post("/messages", {
            conversationId,
            desc: "Position partagée",
            type: "location",
            location: { latitude, longitude }
        });

        queryClient.invalidateQueries(["messages", conversationId]);
        return res.data;
    } catch (error) {
        console.error("Error sharing location:", error);
        throw error;
    }
};

// Traduire un message
export const translateMessage = async (text, targetLanguage) => {
    try {
        const res = await newRequest.post("/messages/translate", {
            text,
            targetLanguage
        });

        return res.data.translatedText;
    } catch (error) {
        console.error("Error translating message:", error);
        throw error;
    }
};

// Marquer les messages comme lus
export const markMessageAsRead = async (conversationId, queryClient) => {
    try {
        await newRequest.put(`/messages/read/${conversationId}`);
        queryClient.invalidateQueries(["messages", conversationId]);
        queryClient.invalidateQueries(["conversations"]);
    } catch (error) {
        console.error("Error marking messages as read:", error);
    }
};

// Formater la durée en format mm:ss
export const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
};

// Créer un lecteur audio
export const createAudioPlayer = () => {
    const audio = new Audio();

    return {
        play: (url, onEnded) => {
            audio.src = url;
            audio.onended = onEnded;
            audio.play().catch(error => {
                console.error("Error playing audio:", error);
                toast.error("Impossible de lire l'audio");
            });
        },
        pause: () => {
            audio.pause();
        },
        stop: () => {
            audio.pause();
            audio.currentTime = 0;
        }
    };
};
