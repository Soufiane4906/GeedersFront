import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import newRequest from "../../utils/newRequest";
import "./Messages.scss";
import moment from "moment";
import { FaEnvelope, FaFilter, FaSearch, FaUser, FaSortAmountDown, FaSortAmountUp,
  FaImage, FaFileAlt, FaMicrophone, FaMapMarkerAlt, FaComment } from 'react-icons/fa';
import { toast } from 'react-toastify';

const Messages = () => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState({
    search: "",
    type: "all",
    timeframe: "all",
    unreadOnly: false
  });
  const [sort, setSort] = useState({ field: "updatedAt", order: "desc" });
  const [users, setUsers] = useState({});
  const [showFilters, setShowFilters] = useState(false);

  // Fetch conversations
  const { isLoading, error, data } = useQuery({
    queryKey: ["conversations", filters, sort],
    queryFn: async () => {
      const queryParams = new URLSearchParams();

      if (filters.search) queryParams.append("search", filters.search);
      if (filters.type !== "all") queryParams.append("type", filters.type);
      if (filters.timeframe !== "all") queryParams.append("timeframe", filters.timeframe);
      if (filters.unreadOnly) queryParams.append("unread", "true");
      queryParams.append("sort", sort.field);
      queryParams.append("order", sort.order);

      const response = await newRequest.get(`/conversations?${queryParams.toString()}`);
      return response.data;
    },
  });

  // Fetch user details for each conversation
  useEffect(() => {
    const fetchUserDetails = async () => {
      if (!data) return;

      const userIds = data.map(c =>
          currentUser.isAmbassador ? c.GuestId : c.AmbassadorId
      );

      // Avoid duplicate requests
      const uniqueIds = [...new Set(userIds)];

      try {
        const promises = uniqueIds.map(id =>
            newRequest.get(`/users/${id}`).then(res => [id, res.data])
        );

        const userDetails = await Promise.all(promises);
        const usersMap = Object.fromEntries(userDetails);
        setUsers(usersMap);
      } catch (err) {
        console.error("Error fetching user details:", err);
      }
    };

    fetchUserDetails();
  }, [data, currentUser.isAmbassador]);

  // Mark conversation as read
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

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  // Handle sort change
  const handleSortChange = (field) => {
    setSort(prev => ({
      field,
      order: prev.field === field && prev.order === "desc" ? "asc" : "desc"
    }));
  };

  // Get message type icon
  const getMessageTypeIcon = (type) => {
    switch (type) {
      case 'text': return <FaComment className="message-type-icon" />;
      case 'image': return <FaImage className="message-type-icon" />;
      case 'audio': return <FaMicrophone className="message-type-icon" />;
      case 'location': return <FaMapMarkerAlt className="message-type-icon" />;
      case 'file': return <FaFileAlt className="message-type-icon" />;
      default: return <FaComment className="message-type-icon" />;
    }
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      search: "",
      type: "all",
      timeframe: "all",
      unreadOnly: false
    });
  };

  return (
      <div className="messages">
        <div className="container">
          <div className="title">
            <h1>Messages</h1>
            <div className="title-buttons">
              <button
                  className="filter-toggle"
                  onClick={() => setShowFilters(!showFilters)}
                  aria-label="Toggle filters"
              >
                <FaFilter />
                <span>{showFilters ? "Hide Filters" : "Show Filters"}</span>
              </button>
              <FaEnvelope className="animated-icon" />
            </div>
          </div>

          {/* Filters Section */}
          {showFilters && (
              <div className="filters-container">
                <div className="search-bar">
                  <FaSearch className="search-icon" />
                  <input
                      type="text"
                      name="search"
                      placeholder="Search by message content or username..."
                      value={filters.search}
                      onChange={handleFilterChange}
                  />
                </div>

                <div className="filters-row">
                  <div className="filter-group">
                    <label>Message Type</label>
                    <select
                        name="type"
                        value={filters.type}
                        onChange={handleFilterChange}
                    >
                      <option value="all">All Types</option>
                      <option value="text">Text</option>
                      <option value="image">Images</option>
                      <option value="audio">Audio</option>
                      <option value="location">Location</option>
                      <option value="file">Files</option>
                    </select>
                  </div>

                  <div className="filter-group">
                    <label>Time Frame</label>
                    <select
                        name="timeframe"
                        value={filters.timeframe}
                        onChange={handleFilterChange}
                    >
                      <option value="all">All Time</option>
                      <option value="today">Today</option>
                      <option value="week">This Week</option>
                      <option value="month">This Month</option>
                    </select>
                  </div>

                  <div className="filter-group checkbox">
                    <label>
                      <input
                          type="checkbox"
                          name="unreadOnly"
                          checked={filters.unreadOnly}
                          onChange={handleFilterChange}
                      />
                      Unread Only
                    </label>
                  </div>

                  <button
                      className="reset-filters"
                      onClick={resetFilters}
                  >
                    Reset Filters
                  </button>
                </div>
              </div>
          )}

          {isLoading ? (
              <div className="loading-animation">
                <div className="spinner"></div>
                <p>Loading conversations...</p>
              </div>
          ) : error ? (
              <div className="error-message">
                <p>Error: {error.message}</p>
                <button onClick={() => queryClient.invalidateQueries(["conversations"])}>
                  Try Again
                </button>
              </div>
          ) : data?.length === 0 ? (
              <div className="empty-state">
                <FaEnvelope size={48} />
                <p>No conversations found</p>
                {(filters.search || filters.type !== "all" || filters.timeframe !== "all" || filters.unreadOnly) && (
                    <button className="reset-filters" onClick={resetFilters}>
                      Clear Filters
                    </button>
                )}
              </div>
          ) : (
              <div className="table-responsive">
                <table className="table">
                  <thead>
                  <tr>
                    <th className="sortable" onClick={() => handleSortChange("user")}>
                      <div className="th-content">
                        {currentUser.isAmbassador ? "Guest" : "Ambassador"}
                        {sort.field === "user" && (
                            sort.order === "desc" ? <FaSortAmountDown className="sort-icon" /> : <FaSortAmountUp className="sort-icon" />
                        )}
                      </div>
                    </th>
                    <th>Last Message</th>
                    <th className="sortable" onClick={() => handleSortChange("updatedAt")}>
                      <div className="th-content">
                        Date
                        {sort.field === "updatedAt" && (
                            sort.order === "desc" ? <FaSortAmountDown className="sort-icon" /> : <FaSortAmountUp className="sort-icon" />
                        )}
                      </div>
                    </th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                  </thead>
                  <tbody>
                  {data.map((c) => {
                    const otherUserId = currentUser.isAmbassador ? c.GuestId : c.AmbassadorId;
                    const otherUser = users[otherUserId] || { username: "Unknown User" };
                    const isUnread = (currentUser.isAmbassador && !c.readByAmbassador) ||
                        (!currentUser.isAmbassador && !c.readByGuest);

                    return (
                        <tr
                            className={isUnread ? "active" : ""}
                            key={c.id}
                        >
                          <td className="user-cell">
                            <div className="user-info">
                              <div className="user-avatar">
                                {otherUser.img ? (
                                    <img src={otherUser.img} alt={otherUser.username} />
                                ) : (
                                    <FaUser />
                                )}
                              </div>
                              <div className="user-details">
                                <span className="username">{otherUser.username}</span>
                                {otherUser.country && <span className="location">{otherUser.city}, {otherUser.country}</span>}
                              </div>
                            </div>
                          </td>
                          <td className="message-cell">
                            <Link to={`/message/${c.id}`} className="message-link">
                              <div className="message-content">
                                {getMessageTypeIcon(c.lastMessageType)}
                                <div className="message-text">
                                  {c?.lastMessage?.substring(0, 60)}{c?.lastMessage?.length > 60 ? "..." : ""}
                                </div>
                              </div>
                            </Link>
                          </td>
                          <td className="date-cell">
                            <span className="timeago">{moment(c.updatedAt).fromNow()}</span>
                            <span className="full-date">{moment(c.updatedAt).format("MMM D, YYYY [at] h:mm A")}</span>
                          </td>
                          <td className="status-cell">
                        <span className={`status-badge ${isUnread ? "unread" : "read"}`}>
                          {isUnread ? "Unread" : "Read"}
                        </span>
                          </td>
                          <td className="action-cell">
                            <div className="action-buttons">
                              <Link to={`/message/${c.id}`} className="btn btn-view">
                                View
                              </Link>
                              {isUnread && (
                                  <button
                                      className="btn btn-success"
                                      onClick={() => handleRead(c.id)}
                                  >
                                    Mark as Read
                                  </button>
                              )}
                            </div>
                          </td>
                        </tr>
                    );
                  })}
                  </tbody>
                </table>
              </div>
          )}
        </div>
      </div>
  );
};

export default Messages;