import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Orders.scss";
import { useQuery } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";

const Orders = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const navigate = useNavigate();

  const { isLoading, error, data = [] } = useQuery({
    queryKey: ["orders"],
    queryFn: () =>
      newRequest.get(`/orders`).then((res) => res.data),
  });

  const handleContact = async (order) => {
    const sellerId = order.sellerId;
    const buyerId = order.buyerId;
    const id = sellerId + buyerId;

    try {
      const res = await newRequest.get(`/conversations/single/${id}`);
      navigate(`/message/${res.data.id}`);
    } catch (err) {
      if (err.response?.status === 404) {
        const res = await newRequest.post(`/conversations/`, {
          to: currentUser.seller ? buyerId : sellerId,
        });
        navigate(`/message/${res.data.id}`);
      }
    }
  };

  const filteredOrders = data.filter(order =>
    order.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="orders">
      <div className="container">
        <div className="title">
          <h1>Orders</h1>
          <input
            type="text"
            placeholder="Search orders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        {isLoading ? (
          "loading"
        ) : error ? (
          "error"
        ) : (
          <table>
            <thead>
              <tr>
                <th>Image</th>
                <th>Title</th>
                <th>Price</th>
                <th>Tour Details</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order._id}>
                  <td>
                    <img
                      className="image"
                      src={order.img || "./img/noavatar.jpg"}
                    />
                  </td>
                  <td>{order.title}</td>
                  <td>${order.price.toFixed(2)}</td>

                  <td>
                    <Link to={`/gig/${order.gigId}`} className="gig-link">
                      View Gig
                    </Link>
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

export default Orders;
