import React, { useEffect, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";
import "./Message.scss";
import { AiFillMessage } from 'react-icons/ai';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaGlobe } from 'react-icons/fa'; // Icons for envelope, phone, city, and country
import "bootstrap/dist/css/bootstrap.min.css";

const Message = () => {
  const { id } = useParams();
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const queryClient = useQueryClient();
  const messagesEndRef = useRef(null);

  const { isLoading, error, data } = useQuery({
    queryKey: ["messages", id],
    queryFn: () => newRequest.get(`/messages/${id}`).then(res => res.data),
    refetchInterval: 5000, // Refetch messages every 5 seconds
  });

  const mutation = useMutation({
    mutationFn: (message) => newRequest.post(`/messages`, message),
    onSuccess: () => {
      queryClient.invalidateQueries(["messages", id]);
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    },
  });

  useEffect(() => {
    const navbar = document.querySelector("#root > div.app > div.navbar");
    if (navbar) {
      const menu = navbar.querySelector("div.menu");
      if (menu) {
        menu.style.display = location.pathname === "/messages" ? "none" : "block";
      }
    }
  }, [location.pathname]);

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate({
      conversationId: id,
      desc: e.target[0].value,
    });
    e.target[0].value = "";
  };

  if (isLoading) return <div className="alert alert-info" role="alert">Loading...</div>;
  if (error) return <div className="alert alert-danger" role="alert">Error fetching messages: {error.message}</div>;

  return (
    <div className="message">
      <div className="container">
        <div className="row">
          {/* Buyer Details Section */}
          {/* <div className="col-md-4">
            <div className="card">
              <div className="card-header">Guide Details</div>
              <div className="card-body">
                <img
                  src={data.buyer.img || "https://via.placeholder.com/100"}
                  alt="Buyer"
                  className="img-fluid rounded-circle mb-3"
                />
                <h5 className="card-title">{data.buyer.username}</h5>
                <p className="card-text">
                  <FaEnvelope /> {data.buyer.email}
                </p>
                <p className="card-text">
                  <FaPhone /> {data.buyer.phone}
                </p>
                <p className="card-text">
                  <FaMapMarkerAlt /> {data.buyer.city || "Unknown City"}
                </p>
                <p className="card-text">
                  <FaGlobe /> {data.buyer.country || "Unknown Country"}
                </p>
              </div>
            </div>
          </div> */}

          {/* Conversation Section */}
          <div className="col-md-8">
            <div className="messages-container">
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link to="/messages">Messages</Link>
                  </li>
                </ol>
              </nav>
              <div className="messages list-group">
                {data.messages.map((m) => (
                  <div
                    className={`list-group-item d-flex ${
                      m.userId === currentUser._id ? "owner item justify-content-end" : "item"
                    }`}
                    key={m._id}
                  >
                    {m.user._id !== currentUser._id && (
                      <img
                        src={m.user.img || "https://via.placeholder.com/50"}
                        alt="User"
                        className="rounded-circle me-3"
                        style={{ width: "50px", height: "50px" }}
                      />
                    )}
                    <div className={`message-content ${m.userId === currentUser._id ? "text-end" : ""}`}>
                      <p className="username mb-1 font-weight-bold">{m.user.username}</p>
                      <p className={`message-text p-2 rounded ${m.userId === currentUser._id ? "current-user" : "other-user"}`}>{m.desc}</p>
                    </div>
                    {m.userId === currentUser._id && (
                      <img
                        src={m.user.img || "https://via.placeholder.com/50"}
                        alt="User"
                        className="rounded-circle ms-3"
                        style={{ width: "50px", height: "50px" }}
                      />
                    )}
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
              <hr />
              <form className="write d-flex align-items-center" onSubmit={handleSubmit}>
                <textarea
                  className="form-control me-2"
                  placeholder="Write a message"
                  style={{ flexGrow: 1 }}
                />
                <button type="submit" className="btn btn-success">
                  <AiFillMessage size={20} />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Message;
