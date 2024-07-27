import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";
import { FaCheck, FaCheckCircle, FaEnvelope, FaRegCheckCircle, FaRegClock } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Orders.scss";

const Orders = () => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  const navigate = useNavigate();
  const { isLoading, error, data } = useQuery({
    queryKey: ["orders"],
    queryFn: () => newRequest.get(`/orders`).then((res) => res.data),
  });

  const handleContact = async (order) => {
    const sellerId = order.sellerId;
    const buyerId = order.buyerId;
    const id = sellerId + buyerId;

    try {
      const res = await newRequest.get(`/conversations/single/${id}`);
      navigate(`/message/${res.data.id}`);
    } catch (err) {
      if (err.response.status === 404) {
        const res = await newRequest.post(`/conversations/`, {
          to: currentUser.seller ? buyerId : sellerId,
        });
        navigate(`/message/${res.data.id}`);
      }
    }
  };

  return (
    <div className="orders">
    {isLoading ? (
      <p className="text-center">Loading...</p>
    ) : error ? (
      <p className="text-center text-danger">Error loading orders.</p>
    ) : (
      <div className="container">
        <div className="title mb-4">
          <h1 className="text-primary">Orders</h1>
        </div>
        <table className="table table-striped table-hover">
          <thead>
            <tr>
              <th>Image</th>
              <th>Title</th>
              <th>Price</th>
              <th>Status</th>
              <th>Contact</th>
            </tr>
          </thead>
          <tbody>
            {data.map((order) => (
              <tr key={order._id} className="order-row">
                <td>
                  <img className="image img-fluid" src={order.img || "./img/noavatar.jpg"} alt={order.title} />
                </td>
                <td>{order.title}</td>
                <td>${order.price}</td>
                <td>{order.isCompleted ? <FaRegCheckCircle className="icon completed" /> : <FaRegClock className="icon pending" />}</td>
                <td>
                  <FaEnvelope
                    className="message-icon"
                    onClick={() => handleContact(order)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </div>
);
};

export default Orders;