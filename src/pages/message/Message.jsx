import React, { useEffect, useRef, useState, useCallback } from "react";
import { Link, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";
import "./Message.scss";
import {
  AiFillMessage,
  AiFillAudio,
  AiOutlineTranslation,
  AiOutlineInfoCircle,
  AiOutlineCheck,
  AiOutlineClose
} from 'react-icons/ai';
import {
  BiMicrophone,
  BiPause,
  BiStop,
  BiArrowBack
} from 'react-icons/bi';
import {
  MdLocationOn,
  MdAttachFile,
  MdEmojiEmotions,
  MdCheckCircle,
  MdSend
} from 'react-icons/md';
import { toast } from 'react-toastify';
import Picker from 'emoji-picker-react';
import {
  sendTextMessage,
  sendAudioMessage,
  uploadFile,
  shareLocation,
  translateMessage as translateMessageUtil,
  markMessageAsRead,
  formatDuration,
  createAudioPlayer
} from "../../utils/messageUtils";

const Message = () => {
  const { id } = useParams();
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const queryClient = useQueryClient();
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const messageContainerRef = useRef(null);
  const audioPlayer = useRef(createAudioPlayer()).current;

  // State variables
  const [messageText, setMessageText] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordingInterval, setRecordingInterval] = useState(null);
  const [translateMessageId, setTranslateMessageId] = useState(null);
  const [translatedMessages, setTranslatedMessages] = useState({});
  const [audioRecorder, setAudioRecorder] = useState(null);
  const [audioBlob, setAudioBlob] = useState(null);
  const [targetLanguage, setTargetLanguage] = useState("en");
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);
  const [showUserInfo, setShowUserInfo] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isPlaying, setIsPlaying] = useState({});
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // Languages available for translation
  const languages = [
    { code: "en", name: "English" },
    { code: "fr", name: "French" },
    { code: "es", name: "Spanish" },
    { code: "de", name: "German" },
    { code: "zh", name: "Chinese" },
    { code: "ja", name: "Japanese" },
    { code: "ar", name: "Arabic" }
  ];

  // Fetch messages with error handling
  const { isLoading, error, data } = useQuery({
    queryKey: ["messages", id],
    queryFn: () => newRequest.get(`/messages/${id}`).then(res => res.data),
    refetchInterval: 5000,
    onError: (error) => {
      toast.error("Erreur lors du chargement des messages: " + error.message);
    }
  });

  // Fetch conversation data
  const { data: conversationData } = useQuery({
    queryKey: ["conversation", id],
    queryFn: () => newRequest.get(`/conversations/single/${id}`).then(res => res.data),
    enabled: !!id,
  });

  // Mark messages as read
  useEffect(() => {
    if (data && data.length > 0) {
      const unreadMessages = data.filter(
          (m) => m.userId !== currentUser._id && !m.read
      );

      if (unreadMessages.length > 0) {
        markMessageAsRead(id, queryClient);
      }
    }
  }, [data, currentUser._id, id, queryClient]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [data]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Initialize audio recorder
  useEffect(() => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ audio: true })
          .then(stream => {
            const mediaRecorder = new MediaRecorder(stream);
            const audioChunks = [];

            mediaRecorder.ondataavailable = (e) => {
              if (e.data.size > 0) audioChunks.push(e.data);
            };

            mediaRecorder.onstop = () => {
              const audioBlob = new Blob(audioChunks, { type: 'audio/mp3' });
              setAudioBlob(audioBlob);
            };

            setAudioRecorder(mediaRecorder);
          })
          .catch(error => {
            console.error("Error accessing microphone:", error);
            toast.error("Impossible d'accéder au microphone");
          });
    }
  }, []);

  // Handle message submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (messageText.trim() === "" && !selectedFile && !audioBlob) {
      return;
    }

    try {
      if (selectedFile) {
        await handleFileUpload();
      } else if (audioBlob) {
        await handleAudioSend();
      } else {
        await sendTextMessage(id, messageText, queryClient);
      }

      // Reset states
      setMessageText("");
      setSelectedFile(null);
      setAudioBlob(null);
      setShowEmojiPicker(false);
    } catch (error) {
     // toast.error("Erreur lors de l'envoi du message");
      console.error(error);
    }
  };

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast.error("Le fichier est trop volumineux (max 10MB)");
        return;
      }
      setSelectedFile(file);
    }
  };

  // Handle file upload
  const handleFileUpload = async () => {
    if (!selectedFile) return;

    try {
      await uploadFile(id, selectedFile, queryClient);
      setSelectedFile(null);
    } catch (error) {
      toast.error("Erreur lors de l'envoi du fichier");
      console.error(error);
    }
  };

  // Handle audio recording
  const handleRecordToggle = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  // Start recording
  const startRecording = () => {
    if (!audioRecorder) {
      toast.error("Microphone non disponible");
      return;
    }

    try {
      audioRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      const interval = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

      setRecordingInterval(interval);
    } catch (error) {
      toast.error("Erreur lors du démarrage de l'enregistrement");
      console.error(error);
    }
  };

  // Stop recording
  const stopRecording = () => {
    if (!audioRecorder || audioRecorder.state === "inactive") return;

    try {
      audioRecorder.stop();
      setIsRecording(false);
      clearInterval(recordingInterval);
    } catch (error) {
      toast.error("Erreur lors de l'arrêt de l'enregistrement");
      console.error(error);
    }
  };

  // Send recorded audio
  const handleAudioSend = async () => {
    if (!audioBlob) return;

    try {
      await sendAudioMessage(id, audioBlob, recordingTime, queryClient);
      setAudioBlob(null);
      setRecordingTime(0);
    } catch (error) {
      console.error(error);
    }
  };

  // Cancel audio recording
  const handleCancelAudio = () => {
    setAudioBlob(null);
    setRecordingTime(0);
    if (isRecording) {
      stopRecording();
    }
  };

  // Handle emoji selection
  const onEmojiClick = (event, emojiObject) => {
    setMessageText(prev => prev + emojiObject.emoji);
  };

  // Handle location sharing
  const handleShareLocation = async () => {
    try {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            async (position) => {
              const { latitude, longitude } = position.coords;
              await shareLocation(id, latitude, longitude, queryClient);
              toast.success("Localisation partagée");
            },
            (error) => {
              toast.error("Impossible d'obtenir votre localisation");
              console.error(error);
            }
        );
      } else {
        toast.error("Géolocalisation non supportée par votre navigateur");
      }
    } catch (error) {
      toast.error("Erreur lors du partage de la localisation");
      console.error(error);
    }
  };

  // Handle message translation
  const handleTranslateMessage = async (messageId, text) => {
    try {
      const translatedText = await translateMessageUtil(text, targetLanguage);
      setTranslatedMessages(prev => ({
        ...prev,
        [messageId]: translatedText
      }));
      setTranslateMessageId(messageId);
    } catch (error) {
      toast.error("Erreur lors de la traduction");
      console.error(error);
    }
  };

  // Toggle audio playback
  const toggleAudioPlay = useCallback((audioUrl, messageId) => {
    if (isPlaying[messageId]) {
      audioPlayer.pause();
      setIsPlaying(prev => ({ ...prev, [messageId]: false }));
    } else {
      // Stop any currently playing audio
      Object.keys(isPlaying).forEach(id => {
        if (isPlaying[id]) {
          audioPlayer.pause();
          setIsPlaying(prev => ({ ...prev, [id]: false }));
        }
      });

      audioPlayer.play(audioUrl, () => {
        setIsPlaying(prev => ({ ...prev, [messageId]: false }));
      });

      setIsPlaying(prev => ({ ...prev, [messageId]: true }));
    }
  }, [audioPlayer, isPlaying]);

  // Get other user from conversation
  const getOtherUser = () => {
    if (!conversationData) return null;

    return conversationData.sellerId === currentUser._id
        ? conversationData.buyerInfo
        : conversationData.sellerInfo;
  };

  const otherUser = getOtherUser();

  if (isLoading) return <div className="loading">Chargement...</div>;
  if (error) return <div className="error">Erreur lors du chargement des messages</div>;

  return (
      <div className="message">
        <div className="container">
          <div className="messages-container">
            {/* Chat Header */}
            <div className="chat-header">
              <Link to="/messages" className="back-link">
                <BiArrowBack />
              </Link>

              {otherUser && (
                  <div
                      className="chat-user-info"
                      onClick={() => setShowUserInfo(!showUserInfo)}
                  >
                    <img
                        src={otherUser.img || "/img/noavatar.jpg"}
                        alt={otherUser.username}
                        className="chat-user-avatar"
                    />
                    <div className="chat-user-details">
                      <h3>{otherUser.username}</h3>
                      <span>{otherUser.isOnline ? "En ligne" : "Hors ligne"}</span>
                    </div>
                  </div>
              )}

              <div className="chat-actions">
                <button
                    className="info-button"
                    onClick={() => setShowUserInfo(!showUserInfo)}
                >
                  <AiOutlineInfoCircle />
                </button>
              </div>
            </div>

            {/* User Info Panel */}
            {showUserInfo && otherUser && (
                <div className="user-info-panel">
                  <div className="user-info-header">
                    <h3>Informations</h3>
                    <button onClick={() => setShowUserInfo(false)}>
                      <AiOutlineClose />
                    </button>
                  </div>

                  <div className="user-info-content">
                    <img
                        src={otherUser.img || "/img/noavatar.jpg"}
                        alt={otherUser.username}
                        className="user-info-avatar"
                    />
                    <h4>{otherUser.username}</h4>
                    <p>{otherUser.desc || "Aucune description"}</p>
                    <div className="user-info-stats">
                      <div className="stat">
                        <span className="label">Membre depuis</span>
                        <span className="value">
                      {new Date(otherUser.createdAt).toLocaleDateString()}
                    </span>
                      </div>
                      <div className="stat">
                        <span className="label">Évaluation</span>
                        <span className="value">{otherUser.rating || "N/A"}/5</span>
                      </div>
                    </div>

                    <Link to={`/profile/${otherUser._id}`} className="view-profile-btn">
                      Voir le profil
                    </Link>
                  </div>
                </div>
            )}

            {/* Messages List */}
            <div className="messages" ref={messageContainerRef}>
              {data && data.map((m) => (
                  <div
                      className={`message-item ${m.userId === currentUser._id ? "owner" : ""}`}
                      key={m._id}
                  >
                    <div className="message-content">
                      {/* Message content based on type */}
                      {m.type === 'text' && (
                          <div className="text-message">
                            <p>{translatedMessages[m._id] || m.desc}</p>
                          </div>
                      )}

                      {m.type === 'image' && (
                          <div className="image-message">
                            <img src={m.fileUrl} alt="Shared" />
                          </div>
                      )}

                      {m.type === 'file' && (
                          <div className="file-message">
                            <a href={m.fileUrl} target="_blank" rel="noopener noreferrer">
                              <MdAttachFile /> {m.desc || "Fichier partagé"}
                            </a>
                          </div>
                      )}

                      {m.type === 'audio' && (
                          <div className="audio-message">
                            <button
                                onClick={() => toggleAudioPlay(m.fileUrl, m._id)}
                                className="audio-control"
                            >
                              {isPlaying[m._id] ? <BiPause /> : <AiFillAudio />}
                            </button>
                            <div className="audio-waveform"></div>
                            <span className="audio-duration">
                        {formatDuration(m.duration || 0)}
                      </span>
                          </div>
                      )}

                      {m.type === 'location' && m.location && (
                          <div className="location-message">
                            <a
                                href={`https://maps.google.com/?q=${m.location.latitude},${m.location.longitude}`}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                              <MdLocationOn /> Position partagée
                            </a>
                          </div>
                      )}

                      {/* Message actions */}
                      <div className="message-actions">
                        {m.userId !== currentUser._id && (
                            <button
                                className="translate-button"
                                onClick={() => handleTranslateMessage(m._id, m.desc)}
                            >
                              <AiOutlineTranslation />
                            </button>
                        )}
                      </div>

                      {/* Message timestamp */}
                      <div className="message-time">
                        {new Date(m.createdAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                        {m.userId === currentUser._id && (
                            <span className="read-status">
                        {m.read ? <MdCheckCircle className="read" /> : <AiOutlineCheck />}
                      </span>
                        )}
                      </div>
                    </div>
                  </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Language Selector */}
            {showLanguageSelector && (
                <div className="language-selector">
                  <div className="language-selector-header">
                    <h4>Choisir une langue</h4>
                    <button onClick={() => setShowLanguageSelector(false)}>
                      <AiOutlineClose />
                    </button>
                  </div>
                  <div className="language-list">
                    {languages.map((lang) => (
                        <button
                            key={lang.code}
                            className={`language-option ${targetLanguage === lang.code ? 'selected' : ''}`}
                            onClick={() => {
                              setTargetLanguage(lang.code);
                              setShowLanguageSelector(false);
                              if (translateMessageId) {
                                const message = data.find(m => m._id === translateMessageId);
                                if (message) {
                                  handleTranslateMessage(translateMessageId, message.desc);
                                }
                              }
                            }}
                        >
                          {lang.name}
                        </button>
                    ))}
                  </div>
                </div>
            )}

            {/* Message Input */}
            <form className="message-input" onSubmit={handleSubmit}>
              {selectedFile && (
                  <div className="selected-file">
                    <span>{selectedFile.name}</span>
                    <button type="button" onClick={() => setSelectedFile(null)}>
                      <AiOutlineClose />
                    </button>
                  </div>
              )}

              {audioBlob && !isRecording && (
                  <div className="recorded-audio">
                    <span>Audio enregistré ({formatDuration(recordingTime)})</span>
                    <div className="audio-actions">
                      <button type="button" onClick={handleCancelAudio}>
                        <AiOutlineClose />
                      </button>
                      <button type="submit">
                        <MdSend />
                      </button>
                    </div>
                  </div>
              )}

              {isRecording ? (
                  <div className="recording-indicator">
                    <span className="recording-pulse"></span>
                    <span>Enregistrement... {formatDuration(recordingTime)}</span>
                    <button type="button" onClick={stopRecording}>
                      <BiStop />
                    </button>
                  </div>
              ) : (
                  <>
                    <div className="message-input-actions">
                      <button
                          type="button"
                          className="emoji-button"
                          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                      >
                        <MdEmojiEmotions />
                      </button>

                      <button
                          type="button"
                          className="attachment-button"
                          onClick={() => fileInputRef.current.click()}
                      >
                        <MdAttachFile />
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            style={{ display: 'none' }}
                        />
                      </button>

                      <button
                          type="button"
                          className="location-button"
                          onClick={handleShareLocation}
                      >
                        <MdLocationOn />
                      </button>
                    </div>

                    <input
                        type="text"
                        placeholder="Écrivez un message..."
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                    />

                    {messageText || selectedFile ? (
                        <button type="submit" className="send-button">
                          <MdSend />
                        </button>
                    ) : (
                        <button
                            type="button"
                            className={`mic-button ${isRecording ? 'recording' : ''}`}
                            onClick={handleRecordToggle}
                        >
                          <BiMicrophone />
                        </button>
                    )}
                  </>
              )}
            </form>

            {/*{showEmojiPicker && (*/}
            {/*    <div className="emoji-picker-container">*/}
            {/*      <Picker onEmojiClick={onEmojiClick} />*/}
            {/*    </div>*/}
            {/*)}*/}
          </div>
        </div>
      </div>
  );
};

export default Message;
