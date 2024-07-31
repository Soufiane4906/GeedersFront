import {React , useEffect} from "react";
import { Link, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";
import "./Message.scss";
import { FaUserCircle } from 'react-icons/fa';
import { AiFillMessage } from 'react-icons/ai';

const Message = () => {
  const { id } = useParams();
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const queryClient = useQueryClient();

  const { isLoading, error, data } = useQuery({
    queryKey: ["messages", id],
    queryFn: () => newRequest.get(`/messages/${id}`).then(res => res.data),
    refetchInterval: 2000, // Refetch messages every 5 seconds
  });

  const mutation = useMutation({
    mutationFn: (message) => newRequest.post(`/messages`, message),
    onSuccess: () => queryClient.invalidateQueries(["messages", id]),
  });
  useEffect(() => {
    const navbar = document.querySelector("#root > div.app > div.navbar");
    if (navbar) {
      const menu = navbar.querySelector("div.menu");
      if (menu) {
        if (location.pathname === "/messages") {
          menu.style.display = "none";
        } else {
          menu.style.display = "block";
        }
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

  return (
    <div className="message">
      <div className="container">
        <span className="breadcrumbs">
          <Link to="/messages">Messages</Link>
        </span>
        {isLoading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>Error fetching messages: {error.message}</p>
        ) : (
          <div className="messages">
            {data.map((m) => (
              <div className={m.userId === currentUser._id ? "owner item" : "item"} key={m._id}>
                <img
                  src={m.userId.img || "https://via.placeholder.com/50"}
                  alt="User"
                  className="user-img"
                />
                <div className="message-content">
                  <p className="username">{m.userId.username}</p>
                  <p className="message-text">{m.desc}</p>
                </div>
              </div>
            ))}
          </div>
        )}
        <hr />
        <form className="write" onSubmit={handleSubmit}>
          <textarea type="text" placeholder="Write a message" />
          <button type="submit">
            <AiFillMessage size={20} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Message;
