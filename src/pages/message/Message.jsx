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

  // Fetch messages
  const { isLoading, error, data } = useQuery({
    queryKey: ["messages", id],
    queryFn: () => newRequest.get(`/messages/${id}`).then(res => res.data),
    refetchInterval: 5000,
  });

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Mutation for sending messages
  const mutation = useMutation({
    mutationFn: (message) => newRequest.post(`/messages`, message),
    onSuccess: () => {
      queryClient.invalidateQueries(["messages", id]);
      scrollToBottom();
      toast.success("Message sent!", {
        position: "bottom-right",
        autoClose: 2000,
      });
    },
  });

  // Mutation for translating messages
  const translateMutation = useMutation({
    mutationFn: ({ messageId, targetLanguage }) =>
        translateMessageUtil(messageId, targetLanguage),
    onSuccess: (response) => {
      setTranslatedMessages(prev => ({
        ...prev,
        [response.data.messageId]: response.data.translatedText
      }));
    },
  });

  // Scroll to bottom of messages
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  // Mark messages as read when received
  useEffect(() => {
    if (data?.messages) {
      const unreadMessages = data.messages.filter(
          m => m.userId !== currentUser._id &&
              m.status !== 'read' &&
              !m.readBy.some(rb => rb.userId === currentUser._id)
      );

      unreadMessages.forEach(message => {
        markMessageAsRead(message._id)
            .catch(err => console.error("Failed to mark message as read:", err));
      });
    }
  }, [data?.messages, currentUser._id]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (data) {
      scrollToBottom();
    }
  }, [data, scrollToBottom]);

  // Clean up on component unmount
  useEffect(() => {
    return () => {
      // Clear recording interval
      if (recordingInterval) {
        clearInterval(recordingInterval);
      }

      // Stop audio playing
      audioPlayer.stop();

      // Stop recording if active
      if (audioRecorder && audioRecorder.state === "recording") {
        audioRecorder.stop();
      }
    };
  }, [recordingInterval, audioPlayer, audioRecorder]);

  // Send audio message when recording is stopped
  useEffect(() => {
    if (audioBlob && !isRecording) {
      sendAudioMessage(id, audioBlob, recordingTime)
          .then(() => {
            queryClient.invalidateQueries(["messages", id]);
            scrollToBottom();
            setAudioBlob(null);
            toast.success("Audio message sent!", {
              position: "bottom-right",
              autoClose: 2000,
            });
          })
          .catch(err => {
            toast.error("Failed to send audio message");
            console.error(err);
          });
    }
  }, [audioBlob, isRecording, id, queryClient, recordingTime, scrollToBottom]);

  // Submit text message
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!messageText.trim()) {
      toast.error("Message cannot be empty");
      return;
    }

    sendTextMessage(id, messageText)
        .then(() => {
          queryClient.invalidateQueries(["messages", id]);
          scrollToBottom();
          setMessageText("");
          setShowEmojiPicker(false);
          toast.success("Message sent!", {
            position: "bottom-right",
            autoClose: 2000,
          });
        })
        .catch(err => {
          toast.error("Failed to send message");
          console.error(err);
        });
  };

  // Handle location sharing
  const handleShareLocation = () => {
    if (navigator.geolocation) {
      toast.info("Getting your location...", {
        position: "bottom-right",
        autoClose: 2000,
      });

      navigator.geolocation.getCurrentPosition(
          (position) => {
            // Get address from coordinates if possible
            fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.coords.latitude}&lon=${position.coords.longitude}`)
                .then(res => res.json())
                .then(data => {
                  const address = data.display_name || null;
                  shareLocation(id, {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                  }, address)
                      .then(() => {
                        queryClient.invalidateQueries(["messages", id]);
                        scrollToBottom();
                        toast.success("Location shared successfully!", {
                          position: "bottom-right",
                          autoClose: 2000,
                        });
                      })
                      .catch(err => {
                        toast.error("Failed to share location");
                        console.error(err);
                      });
                })
                .catch(() => {
                  // Share location without address if geocoding fails
                  shareLocation(id, {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                  })
                      .then(() => {
                        queryClient.invalidateQueries(["messages", id]);
                        scrollToBottom();
                        toast.success("Location shared successfully!", {
                          position: "bottom-right",
                          autoClose: 2000,
                        });
                      })
                      .catch(err => {
                        toast.error("Failed to share location");
                        console.error(err);
                      });
                });
          },
          (error) => {
            toast.error("Failed to get your location");
            console.error(error);
          }
      );
    } else {
      toast.error("Geolocation is not supported by your browser");
    }
  };

  // Start audio recording
  const startRecording = async () => {
    try {
      // First check for permission
      let permissionStatus;
      try {
        permissionStatus = await navigator.permissions.query({ name: 'microphone' });

        if (permissionStatus.state === 'denied') {
          toast.error("Microphone access is blocked. Please enable it in your browser settings.");
          return;
        }
      } catch (permError) {
        // Some browsers don't support permission query for microphone, proceed anyway
        console.warn("Couldn't query microphone permission:", permError);
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // Try to use specific codec for better compatibility
      let options = { mimeType: 'audio/webm;codecs=opus' };

      // Test if the codec is supported
      if (!MediaRecorder.isTypeSupported(options.mimeType)) {
        options = { mimeType: 'audio/webm' }; // Fallback

        if (!MediaRecorder.isTypeSupported(options.mimeType)) {
          options = {}; // Use browser default
        }
      }

      const recorder = new MediaRecorder(stream, options);
      const chunks = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      recorder.onstop = () => {
        // Create appropriate audio type
        const blob = new Blob(chunks, { type: options.mimeType || "audio/webm" });
        setAudioBlob(blob);

        // Stop all tracks to release microphone
        stream.getTracks().forEach(track => track.stop());
      };

      recorder.onerror = (event) => {
        console.error('Recording error:', event.error);
        toast.error("Error while recording audio");
        stream.getTracks().forEach(track => track.stop());
        setIsRecording(false);
        clearInterval(recordingInterval);
        setRecordingInterval(null);
      };

      setAudioRecorder(recorder);
      recorder.start();

      setIsRecording(true);
      setRecordingTime(0);
      const interval = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      setRecordingInterval(interval);

      toast.info("Recording started...", {
        position: "bottom-right",
        autoClose: 2000,
        icon: <BiMicrophone className="toast-icon" />,
      });
    } catch (err) {
      // Handle specific permission errors
      if (err.name === 'NotAllowedError') {
        toast.error("Microphone access denied. Please allow microphone access.");
      } else if (err.name === 'NotFoundError') {
        toast.error("No microphone found on your device.");
      } else {
        toast.error("Could not access microphone");
        console.error(err);
      }
    }
  };

  // Stop audio recording
  const stopRecording = () => {
    if (audioRecorder && audioRecorder.state === "recording") {
      audioRecorder.stop();
      clearInterval(recordingInterval);
      setRecordingInterval(null);
      setIsRecording(false);

      toast.success("Audio message ready to send", {
        position: "bottom-right",
        autoClose: 2000,
        icon: <AiFillAudio className="toast-icon" />,
      });
    }
  };

  // Cancel audio recording
  const cancelRecording = () => {
    if (audioRecorder && audioRecorder.state === "recording") {
      audioRecorder.stop();
    }

    clearInterval(recordingInterval);
    setRecordingInterval(null);
    setIsRecording(false);
    setAudioBlob(null);

    toast.info("Recording cancelled", {
      position: "bottom-right",
      autoClose: 2000,
      icon: <AiOutlineClose className="toast-icon" />,
    });
  };

  // Format time for display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Handle emoji selection
  const handleEmojiClick = (emojiData) => {
    setMessageText(prev => prev + emojiData.emoji);
  };

  // Translate message
  const translateMessage = (messageId) => {
    if (translateMessageId === messageId) {
      setTranslateMessageId(null);
    } else {
      setTranslateMessageId(messageId);
      translateMutation.mutate({
        messageId,
        targetLanguage
      });
    }
  };

  // Format message timestamp
  const getMessageTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Group messages by date
  const groupMessagesByDate = (messages) => {
    if (!messages || messages.length === 0) return {};

    const grouped = {};
    messages.forEach(message => {
      const date = new Date(message.createdAt);
      const dateStr = date.toLocaleDateString();

      if (!grouped[dateStr]) {
        grouped[dateStr] = [];
      }

      grouped[dateStr].push(message);
    });

    return grouped;
  };

  // Format date for display
  const formatDate = (dateStr) => {
    const today = new Date().toLocaleDateString();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toLocaleDateString();

    if (dateStr === today) {
      return "Today";
    } else if (dateStr === yesterdayStr) {
      return "Yesterday";
    } else {
      return dateStr;
    }
  };

  // Handle file upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Reset the input to allow selecting the same file again
    e.target.value = null;

    setSelectedFile(file);

    // File size validation (20MB limit)
    const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB in bytes
    if (file.size > MAX_FILE_SIZE) {
      toast.error(`File size exceeds the 20MB limit`);
      setSelectedFile(null);
      return;
    }

    toast.info(`Uploading ${file.name}...`, {
      position: "bottom-right",
      autoClose: 2000,
    });

    uploadFile(id, file)
        .then(() => {
          queryClient.invalidateQueries(["messages", id]);
          scrollToBottom();
          setSelectedFile(null);

          toast.success("File sent successfully!", {
            position: "bottom-right",
            autoClose: 2000,
          });
        })
        .catch(err => {
          // Check for specific errors
          if (err.message && err.message.includes("File size exceeds")) {
            toast.error(err.message);
          } else {
            toast.error("Failed to upload file");
          }
          console.error(err);
          setSelectedFile(null);
        });
  };

  // Play/pause audio message
  const toggleAudioPlay = (messageId, fileUrl) => {
    audioPlayer.play(
        messageId,
        fileUrl,
        // On play
        () => {
          setIsPlaying(prev => ({...prev, [messageId]: true}));
        },
        // On pause
        (pausedMessageId) => {
          if (pausedMessageId) {
            // If a specific message ID is provided (different message was playing)
            setIsPlaying(prev => ({...prev, [pausedMessageId]: false}));
          } else {
            // Current message was paused
            setIsPlaying(prev => ({...prev, [messageId]: false}));
          }
        },
        // On ended
        () => {
          setIsPlaying(prev => ({...prev, [messageId]: false}));
        }
    );
  };

  // Render audio message UI
  const renderAudioMessage = (message) => {
    return (
        <div className="audio-message">
          <button
              className={`audio-play-btn ${isPlaying[message._id] ? 'playing' : ''}`}
              onClick={() => toggleAudioPlay(message._id, message.fileUrl)}
              aria-label={isPlaying[message._id] ? "Pause audio" : "Play audio"}
          >
            {isPlaying[message._id] ? <BiPause /> : "▶"}
          </button>
          <div className="audio-waveform">
            {Array(15).fill().map((_, i) => (
                <div
                    key={i}
                    className="waveform-bar"
                    style={{
                      height: `${10 + Math.random() * 30}px`,
                      backgroundColor: isPlaying[message._id] ? 'var(--theme-color)' : null
                    }}
                ></div>
            ))}
          </div>
          <span className="audio-duration">
          {message.duration ? formatDuration(message.duration) : '00:00'}
        </span>
        </div>
    );
  };

  // Render message content based on type
  const renderMessageContent = (message) => {
    switch (message.type) {
      case "audio":
        return renderAudioMessage(message);

      case "location":
        const mapUrl = message.location?.latitude && message.location?.longitude
            ? `https://www.openstreetmap.org/?mlat=${message.location.latitude}&mlon=${message.location.longitude}#map=15/${message.location.latitude}/${message.location.longitude}`
            : null;

        return (
            <div className="location-message">
              <MdLocationOn className="location-icon" />
              <span>{message.location?.address || "Location shared"}</span>
              {mapUrl && (
                  <a
                      href={mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="map-link"
                  >
                    <div className="map-preview">
                      <img
                          src={`https://staticmap.openstreetmap.de/staticmap.php?center=${message.location.latitude},${message.location.longitude}&zoom=14&size=300x200&maptype=mapnik&markers=${message.location.latitude},${message.location.longitude},red-pushpin`}
                          alt="Map location"
                          className="map-image"
                          loading="lazy"
                      />
                    </div>
                    <span className="view-map">View on map</span>
                  </a>
              )}
            </div>
        );

      case "image":
        return (
            <div className="image-message">
              <img
                  src={message.fileUrl}
                  alt="Shared image"
                  className="shared-image"
                  loading="lazy"
              />
            </div>
        );

      case "file":
        const fileName = message.desc.split("Shared a file: ")[1] || "File";
        return (
            <div className="file-message">
              <MdAttachFile className="file-icon" />
              <span className="file-name">{fileName}</span>
              <a
                  href={message.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="file-download"
              >
                Download
              </a>
            </div>
        );

      default: // text message
        return (
            <>
              <p className="message-text">{message.desc}</p>
              {translatedMessages[message._id] && (
                  <p className="translated-text">
                    <AiOutlineTranslation className="translation-icon" />
                    {translatedMessages[message._id]}
                  </p>
              )}
            </>
        );
    }
  };

  // Get message delivery status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case 'read':
        return <MdCheckCircle className="read-status double-check" />;
      case 'delivered':
        return <AiOutlineCheck className="read-status double-check" />;
      default:
        return <AiOutlineCheck className="read-status" />;
    }
  };

  const groupedMessages = data?.messages ? groupMessagesByDate(data.messages) : {};

  return (
      <div className="message">
        <div className="container">
          <div className="messages-container">
            {/* Header with user info */}
            <div className="chat-header">
              <Link to="/messages" className="back-link">
                <BiArrowBack />
              </Link>

              {!isLoading && !error && data?.Ambassador && (
                  <div
                      className="chat-user-info"
                      onClick={() => setShowUserInfo(!showUserInfo)}
                  >
                    <img
                        src={currentUser._id === data.Ambassador._id
                            ? data.Guest.img || "https://via.placeholder.com/40"
                            : data.Ambassador.img || "https://via.placeholder.com/40"}
                        alt="Chat User"
                        className="chat-user-avatar"
                    />
                    <div className="chat-user-details">
                      <h4>{currentUser._id === data.Ambassador._id
                          ? data.Guest.username
                          : data.Ambassador.username}</h4>
                      <span className="online-status">Online</span>
                    </div>
                  </div>
              )}

              <div className="chat-actions">
                <button
                    className="action-btn"
                    onClick={() => setShowLanguageSelector(!showLanguageSelector)}
                    aria-label="Translation options"
                >
                  <AiOutlineTranslation className="action-icon" />
                </button>
                <button
                    className="action-btn"
                    onClick={() => setShowUserInfo(!showUserInfo)}
                    aria-label="User information"
                >
                  <AiOutlineInfoCircle className="action-icon" />
                </button>
              </div>
            </div>

            {/* Language selector dropdown */}
            {showLanguageSelector && (
                <div className="language-selector">
                  <h4>Select translation language</h4>
                  <ul>
                    {languages.map(lang => (
                        <li
                            key={lang.code}
                            className={targetLanguage === lang.code ? 'active' : ''}
                            onClick={() => {
                              setTargetLanguage(lang.code);
                              setShowLanguageSelector(false);
                              toast.info(`Translation language set to ${lang.name}`);
                            }}
                        >
                          {lang.name}
                        </li>
                    ))}
                  </ul>
                </div>
            )}

            {/* User info panel */}
            {showUserInfo && data && (
                <div className="user-info-panel">
                  <div className="user-info-header">
                    <h3>Contact Info</h3>
                    <button
                        className="close-info"
                        onClick={() => setShowUserInfo(false)}
                        aria-label="Close user info"
                    >
                      <AiOutlineClose />
                    </button>
                  </div>

                  <div className="user-info-content">
                    <img
                        src={currentUser._id === data.Ambassador._id
                            ? data.Guest.img || "https://via.placeholder.com/100"
                            : data.Ambassador.img || "https://via.placeholder.com/100"}
                        alt="User profile"
                        className="user-profile-img"
                    />

                    <h4>{currentUser._id === data.Ambassador._id
                        ? data.Guest.username
                        : data.Ambassador.username}</h4>

                    <div className="user-contact-details">
                      <div className="contact-item">
                        <span className="contact-label">Email:</span>
                        <span className="contact-value">
                      {currentUser._id === data.Ambassador._id
                          ? data.Guest.email || "Not available"
                          : data.Ambassador.email || "Not available"}
                    </span>
                      </div>

                      <div className="contact-item">
                        <span className="contact-label">Phone:</span>
                        <span className="contact-value">
                      {currentUser._id === data.Ambassador._id
                          ? data.Guest.phone || "Not available"
                          : data.Ambassador.phone || "Not available"}
                    </span>
                      </div>
                    </div>
                  </div>
                </div>
            )}

            {/* Messages display area */}
            <div className="messages" ref={messageContainerRef}>
              {isLoading ? (
                  <div className="loading-bubbles">
                    <div className="bubble" />
                    <div className="bubble" />
                    <div className="bubble" />
                  </div>
              ) : error ? (
                  <div className="error-bubble">{error.message}</div>
              ) : (
                  Object.keys(groupedMessages).map(date => (
                      <div key={date} className="message-group">
                        <div className="date-separator">
                          <span>{formatDate(date)}</span>
                        </div>

                        {groupedMessages[date].map((m) => (
                            <div
                                className={`message-bubble ${
                                    m.userId === currentUser._id ? "current-user" : "other-user"
                                }`}
                                key={m._id}
                            >
                              {m.userId !== currentUser._id && (
                                  <img
                                      src={m.user?.img || "https://via.placeholder.com/40"}
                                      alt="User"
                                      className="user-avatar"
                                  />
                              )}

                              <div className="message-content">
                                {m.userId !== currentUser._id && (
                                    <span className="username">{m.user?.username || "User"}</span>
                                )}

                                {renderMessageContent(m)}

                                <div className="message-meta">
                          <span className="message-time">
                            {getMessageTime(m.createdAt || new Date())}
                          </span>

                                  {m.userId === currentUser._id && (
                                      <span className="message-status">
                              {getStatusIcon(m.status)}
                            </span>
                                  )}
                                </div>

                                {m.userId !== currentUser._id && m.type === 'text' && (
                                    <div className="message-actions">
                                      <button
                                          className={`action-btn ${translateMessageId === m._id ? 'active' : ''}`}
                                          onClick={() => translateMessage(m._id, m.desc)}
                                          aria-label={translateMessageId === m._id ? "Cancel translation" : "Translate message"}
                                      >
                                        {translateMessageId === m._id ?
                                            <AiOutlineClose /> :
                                            <AiOutlineTranslation />
                                        }
                                      </button>
                                    </div>
                                )}
                              </div>
                            </div>
                        ))}
                      </div>
                  ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Recording interface */}
            {isRecording ? (
                <div className="recording-container">
                  <div className="recording-indicator">
                    <span className="recording-pulse"></span>
                    <span className="recording-time">{formatTime(recordingTime)}</span>
                  </div>
                  <div className="recording-actions">
                    <button
                        className="cancel-recording"
                        onClick={cancelRecording}
                        aria-label="Cancel recording"
                    >
                      <AiOutlineClose />
                    </button>
                    <button
                        className="stop-recording"
                        onClick={stopRecording}
                        aria-label="Stop recording"
                    >
                      <BiStop />
                    </button>
                  </div>
                </div>
            ) : (
                /* Message input form */
                <form className="message-form" onSubmit={handleSubmit}>
                  <div className="message-input-container">
                    <button
                        type="button"
                        className="emoji-btn"
                        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                        aria-label="Emoji picker"
                    >
                      <MdEmojiEmotions />
                    </button>

                    <textarea
                        placeholder="Type a message..."
                        aria-label="Message input"
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSubmit(e);
                          }
                        }}
                    />

                    {/* Hidden file input */}
                    <input
                        type="file"
                        ref={fileInputRef}
                        style={{ display: 'none' }}
                        onChange={handleFileUpload}
                        accept="image/*,audio/*,video/*,application/*"
                    />

                    <button
                        type="button"
                        className="attach-btn"
                        onClick={() => fileInputRef.current.click()}
                        aria-label="Attach file"
                    >
                      <MdAttachFile />
                    </button>
                  </div>

                  {/* Emoji picker */}
                  {showEmojiPicker && (
                      <div className="emoji-picker-container">
                        <Picker onEmojiClick={handleEmojiClick} />
                      </div>
                  )}

                  <div className="message-actions-container">
                    {/* Location button */}
                    <button
                        type="button"
                        className="location-btn"
                        onClick={handleShareLocation}
                        aria-label="Share location"
                    >
                      <MdLocationOn />
                    </button>

                    {/* Send or microphone button */}
                    {messageText? (
                        <button type="submit" className="send-button">
                          <MdSend className="send-icon" />
                        </button>
                    ) : (
                        <button
                            type="button"
                            className="mic-button"
                            onClick={startRecording}
                        >
                          <BiMicrophone />
                        </button>
                    )}
                  </div>
                </form>
            )}
          </div>
        </div>
      </div>
  );
};

export default Message;