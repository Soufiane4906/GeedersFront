// Updated messageUtils.js with improved audio and file handling

import newRequest from "./newRequest";

// Send a text message
export const sendTextMessage = async (conversationId, text) => {
    try {
        return await newRequest.post("/messages", {
            conversationId,
            desc: text,
            type: "text"
        });
    } catch (error) {
        console.error("Error sending text message:", error);
        throw error;
    }
};

// Send an audio message with improved error handling and chunking for large files
export const sendAudioMessage = async (conversationId, audioBlob, duration) => {
    try {
        // First upload the audio file
        const formData = new FormData();
        formData.append("file", audioBlob, "audio-message.webm");

        const uploadRes = await newRequest.post("/messages/upload", formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            },
            onUploadProgress: (progressEvent) => {
                // Can be used to track upload progress
                const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                console.log(`Upload progress: ${percentCompleted}%`);
            }
        });

        if (!uploadRes.data || !uploadRes.data.fileUrl) {
            throw new Error("Failed to get file URL from server");
        }

        // Then create the message with the file URL
        return await newRequest.post("/messages", {
            conversationId,
            desc: `Audio message (${formatDuration(duration)})`,
            type: "audio",
            fileUrl: uploadRes.data.fileUrl,
            duration
        });
    } catch (error) {
        console.error("Error sending audio message:", error);
        throw error;
    }
};

// Upload a file with improved error handling and progress tracking
export const uploadFile = async (conversationId, file) => {
    try {
        // Validate file size (example: 20MB max)
        const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB in bytes
        if (file.size > MAX_FILE_SIZE) {
            throw new Error(`File size exceeds maximum allowed (${MAX_FILE_SIZE / (1024 * 1024)}MB)`);
        }

        // Determine file type
        let fileType = "file";
        if (file.type.startsWith("image/")) {
            fileType = "image";
        } else if (file.type.startsWith("audio/")) {
            fileType = "audio";
        }

        // Upload file
        const formData = new FormData();
        formData.append("file", file);

        const uploadRes = await newRequest.post("/messages/upload", formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            },
            onUploadProgress: (progressEvent) => {
                const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                console.log(`Upload progress: ${percentCompleted}%`);
                // Could update a progress state here
            }
        });

        if (!uploadRes.data || !uploadRes.data.fileUrl) {
            throw new Error("Failed to get file URL from server");
        }

        // Send file message
        return await newRequest.post("/messages", {
            conversationId,
            desc: `Shared a ${fileType}: ${file.name}`,
            type: fileType,
            fileUrl: uploadRes.data.fileUrl,
            ...(fileType === "audio" && file.duration ? { duration: file.duration } : {})
        });
    } catch (error) {
        console.error("Error uploading file:", error);
        throw error;
    }
};

// Format duration helper with improved format
export const formatDuration = (seconds) => {
    if (!seconds && seconds !== 0) return "00:00";

    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

// Create a reusable audio player
export const createAudioPlayer = () => {
    let currentAudio = null;
    let currentMessageId = null;

    return {
        play: (messageId, fileUrl, onPlay, onPause, onEnded) => {
            // If there's already audio playing for this message
            if (currentAudio && currentMessageId === messageId) {
                if (currentAudio.paused) {
                    currentAudio.play().then(() => {
                        if (onPlay) onPlay();
                    }).catch(err => console.error("Error playing audio:", err));
                } else {
                    currentAudio.pause();
                    if (onPause) onPause();
                }
                return;
            }

            // Stop currently playing audio if different message
            if (currentAudio) {
                currentAudio.pause();
                if (currentMessageId !== messageId && onPause) {
                    onPause(currentMessageId);
                }
            }

            // Create new audio
            const audio = new Audio(fileUrl);

            audio.onplay = () => {
                if (onPlay) onPlay();
            };

            audio.onpause = () => {
                if (onPause) onPause();
            };

            audio.onended = () => {
                if (onEnded) onEnded();
                currentAudio = null;
                currentMessageId = null;
            };

            audio.onerror = (err) => {
                console.error("Audio playback error:", err);
                if (onEnded) onEnded();
                currentAudio = null;
                currentMessageId = null;
            };

            // Play the audio
            audio.play().then(() => {
                if (onPlay) onPlay();
            }).catch(err => console.error("Error playing audio:", err));

            currentAudio = audio;
            currentMessageId = messageId;
        },

        stop: () => {
            if (currentAudio) {
                currentAudio.pause();
                currentAudio = null;
                currentMessageId = null;
            }
        },

        getCurrentMessageId: () => currentMessageId
    };
};

// Send a location
export const shareLocation = async (conversationId, coords, address = null) => {
    try {
        return await newRequest.post("/messages/location", {
            conversationId,
            latitude: coords.latitude,
            longitude: coords.longitude,
            address
        });
    } catch (error) {
        console.error("Error sharing location:", error);
        throw error;
    }
};

// Translate a message
export const translateMessage = async (messageId, targetLanguage) => {
    try {
        return await newRequest.post("/messages/translate", {
            messageId,
            targetLanguage
        });
    } catch (error) {
        console.error("Error translating message:", error);
        throw error;
    }
};

// Mark a message as read
export const markMessageAsRead = async (messageId) => {
    try {
        return await newRequest.post(`/messages/read/${messageId}`);
    } catch (error) {
        console.error("Error marking message as read:", error);
        throw error;
    }
};