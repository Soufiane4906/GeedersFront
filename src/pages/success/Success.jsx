import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import newRequest from "../../utils/newRequest";
// Style and bootstrap
import "./Success.scss";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Success = () => {
  const { search } = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(search);
  const payment_intent = params.get("payment_intent");

  useEffect(() => {
    const makeRequest = async () => {
      try {
        await newRequest.put("/orders", { payment_intent });
        // toast.success("Payment successful! Redirecting to orders...");
        setTimeout(() => {
          navigate("/orders");
        }, 2000);
      } catch (err) {
        console.log(err);
      }
    };

    makeRequest();
  }, [payment_intent, navigate]);

  return (
    <div className="success-container">
      <div className="success-content">
        <h1 className="success-title">Payment Successful</h1>
        <p className="success-text">
          You are being redirected to the orders page. Please do not close the
          page.
        </p>
      </div>
    </div>
  );
};

export default Success;
