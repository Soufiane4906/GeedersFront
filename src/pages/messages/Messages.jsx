import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { Link } from "react-router-dom";
import newRequest from "../../utils/newRequest";
import "./Messages.scss";
import moment from "moment";
import { FaEnvelope } from 'react-icons/fa';
import { toast } from 'react-toastify';

const Messages = () => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const queryClient = useQueryClient();

  const { isLoading, error, data } = useQuery({
    queryKey: ["conversations"],
    queryFn: () => newRequest.get(`/conversations`).then(res => res.data),
  });

  const mutation = useMutation({
    mutationFn: (id) => newRequest.put(`/conversations/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["conversations"]);
      toast.success("Conversation marked as read!", {
        position: "bottom-right",
        autoClose: 3000,
      });
    },
  });

  const handleRead = (id) => {
    mutation.mutate(id);
  };

  return (
      <div className="messages">
        <div className="container">
          <div className="title">
            <h1>Messages</h1>
            <FaEnvelope className="animated-icon" />
          </div>

          {isLoading ? (
              <div className="loading-animation">Loading conversations...</div>
          ) : error ? (
              <div className="error-message">Error: {error.message}</div>
          ) : data?.length === 0 ? (
              <div className="empty-state">
                <FaEnvelope size={48} />
                <p>No conversations found</p>
              </div>
          ) : (
              <table className="table">
                <thead>
                <tr>
                  <th>{currentUser.isAmbassador ? "Guest" : "Ambassador"}</th>
                  <th>Last Message</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>
                </thead>
                <tbody>
                {data.map((c) => (
                    <tr
                        className={`${((currentUser.isAmbassador && !c.readByAmbassador) ||
                            (!currentUser.isAmbassador && !c.readByGuest)) && "active"}`}
                        key={c.id}
                    >
                      <td>{currentUser.isAmbassador ? c.GuestId : c.AmbassadorId}</td>
                      <td>
                        <Link to={`/message/${c.id}`} className="link">
                          {c?.lastMessage?.substring(0, 100)}...
                        </Link>
                      </td>
                      <td>{moment(c.updatedAt).fromNow()}</td>
                      <td className="action-cell">
                        {((currentUser.isAmbassador && !c.readByAmbassador) ||
                            (!currentUser.isAmbassador && !c.readByGuest)) && (
                            <button
                                className="btn-success"
                                onClick={() => handleRead(c.id)}
                            >
                              Mark as Read
                            </button>
                        )}
                      </td>
                    </tr>
                ))}
                </tbody>
              </table>
          )}
        </div>
      </div>
  );
};

export default Messages;