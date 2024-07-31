import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";
import { FaCheckCircle, FaRegClock, FaEnvelope, FaEye, FaInfoCircle } from "react-icons/fa";
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
    <div className="orders container mt-4">
      {isLoading ? (
        <p className="text-center">Loading...</p>
      ) : error ? (
        <p className="text-center text-danger">Error loading orders.</p>
      ) : (
        <>
          <h1 className="text-primary mb-4">Orders</h1>
          <table className="table table-striped table-hover">
            <thead>
              <tr>
                <th>Image</th>
                <th>Title</th>
                <th>Price</th>
                <th>Status</th>
                <th>Messages</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {data.map((order) => (
                <tr key={order._id} className="order-row">
                  <td>
                    <img
                      className="image img-fluid"
                      src={order.img || "./img/noavatar.jpg"}
                      alt={order.title}
                    />
                  </td>
                  <td>{order.title}</td>
                  <td>${order.totalprice}</td>
                  <td>
                    {order.isCompleted ? (
                      <FaCheckCircle className="icon completed" />
                    ) : (
                      <FaRegClock className="icon pending" />
                    )}
                  </td>
                  <td>
                    <div className="actions">

                      <FaEnvelope
                        className="message-icon"
                        onClick={() => handleContact(order)}
                      />
                    </div>
                  </td>
                  <td>   <Link
                        to={`/singleOrder/${order._id}`}
                      >
                        <FaInfoCircle  className="icon view" />
                      </Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default Orders;
