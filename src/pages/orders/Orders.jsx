import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";
import {
  FaCheckCircle,
  FaRegClock,
  FaEnvelope,
  FaInfoCircle,
  FaFilter,
  FaSort,
  FaSearch,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaClock
} from "react-icons/fa";
import "./Orders.scss";

const Orders = () => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const navigate = useNavigate();

  // State for filtering and sorting
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all"); // all, completed, pending
  const [sortBy, setSortBy] = useState("date"); // date, price

  const { isLoading, error, data } = useQuery({
    queryKey: ["orders"],
    queryFn: () => newRequest.get(`/orders`).then((res) => res.data),
  });

  const handleContact = async (order) => {
    const AmbassadorId = order.AmbassadorId;
    const GuestId = order.GuestId;
    const id = AmbassadorId + GuestId;

    try {
      const res = await newRequest.get(`/conversations/single/${id}`);
      navigate(`/message/${res.data.id}`);
    } catch (err) {
      if (err.response.status === 404) {
        const res = await newRequest.post(`/conversations/`, {
          to: currentUser.Ambassador ? GuestId : AmbassadorId,
        });
        navigate(`/message/${res.data.id}`);
      }
    }
  };

  // Filter and sort orders
  const filteredOrders = data ? data.filter(order => {
    // Search filter
    const matchesSearch = order.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.location?.toLowerCase().includes(searchTerm.toLowerCase());

    // Status filter
    if (filter === "completed") return matchesSearch && order.isCompleted;
    if (filter === "pending") return matchesSearch && !order.isCompleted;
    return matchesSearch;
  }) : [];

  // Sort orders
  const sortedOrders = [...filteredOrders].sort((a, b) => {
    if (sortBy === "date") {
      return new Date(b.createdAt) - new Date(a.createdAt);
    } else if (sortBy === "price") {
      return b.totalprice - a.totalprice;
    }
    return 0;
  });

  // Format date to a readable format
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
      <div className="orders-container">
        <div className="orders">
          {isLoading ? (
              <div className="loading-spinner">
                <div className="spinner"></div>
                <p>Loading your orders...</p>
              </div>
          ) : error ? (
              <div className="error-container">
                <p>Error loading orders. Please try again later.</p>
                <button className="btn-retry" onClick={() => window.location.reload()}>
                  Retry
                </button>
              </div>
          ) : (
              <>
                <div className="orders-header">
                  <h1>My Orders</h1>
                  <p className="orders-subtitle">Manage and track all your bookings</p>
                </div>

                <div className="orders-controls">
                  <div className="search-container">
                    <FaSearch className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search by title or location..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                  </div>

                  <div className="filter-sort-container">
                    <div className="filter-container">
                      <FaFilter className="filter-icon" />
                      <select
                          value={filter}
                          onChange={(e) => setFilter(e.target.value)}
                          className="filter-select"
                      >
                        <option value="all">All Orders</option>
                        <option value="completed">Completed</option>
                        <option value="pending">Pending</option>
                      </select>
                    </div>

                    <div className="sort-container">
                      <FaSort className="sort-icon" />
                      <select
                          value={sortBy}
                          onChange={(e) => setSortBy(e.target.value)}
                          className="sort-select"
                      >
                        <option value="date">Sort by Date</option>
                        <option value="price">Sort by Price</option>
                      </select>
                    </div>
                  </div>
                </div>

                {sortedOrders.length === 0 ? (
                    <div className="no-orders">
                      <p>No orders found. Try adjusting your search or filters.</p>
                    </div>
                ) : (
                    <div className="table-responsive">
                      <table className="table">
                        <thead>
                        <tr>
                          <th>Experience</th>
                          <th>Details</th>
                          <th>Location</th>
                          <th>Date</th>
                          <th>Price</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {sortedOrders.map((order) => (
                            <tr key={order._id} className="order-row">
                              <td className="image-cell">
                                <img
                                    className="order-image"
                                    src={order.img || "./img/noavatar.jpg"}
                                    alt={order.title}
                                />
                              </td>
                              <td className="title-cell">
                                <h3>{order.title}</h3>
                                <div className="order-duration">
                                  <FaClock /> {order.duration} hours
                                </div>
                                {order.options && (
                                    <div className="order-options">
                                      {order.options.car && <span className="option car">Car</span>}
                                      {order.options.scooter && <span className="option scooter">Scooter</span>}
                                    </div>
                                )}
                              </td>
                              <td className="location-cell">
                                <div className="order-location">
                                  <FaMapMarkerAlt /> {order.location || "Not specified"}
                                </div>
                              </td>
                              <td className="date-cell">
                                <div className="order-date">
                                  <FaCalendarAlt /> {formatDate(order.createdAt)}
                                </div>
                              </td>
                              <td className="price-cell">
                                <div className="order-price">${order.totalprice}</div>
                                <div className="base-price">Base: ${order.price}</div>
                              </td>
                              <td className="status-cell">
                                <div className={`status-badge ${order.isCompleted ? "completed" : "pending"}`}>
                                  {order.isCompleted ? (
                                      <>
                                        <FaCheckCircle className="status-icon" />
                                        <span>Completed</span>
                                      </>
                                  ) : (
                                      <>
                                        <FaRegClock className="status-icon" />
                                        <span>Pending</span>
                                      </>
                                  )}
                                </div>
                              </td>
                              <td className="actions-cell">
                                <div className="actions">
                                  <button
                                      className="action-btn message-btn"
                                      onClick={() => handleContact(order)}
                                      title="Contact Ambassador"
                                  >
                                    <FaEnvelope />
                                  </button>
                                  <Link
                                      to={`/singleOrder/${order._id}`}
                                      className="action-btn details-btn"
                                      title="View Order Details"
                                  >
                                    <FaInfoCircle />
                                  </Link>
                                </div>
                              </td>
                            </tr>
                        ))}
                        </tbody>
                      </table>
                    </div>
                )}
              </>
          )}
        </div>
      </div>
  );
};

export default Orders;