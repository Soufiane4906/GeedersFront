import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import newRequest from "../../utils/newRequest";
import "./Success.scss";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Success = () => {
  const { search } = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(search);
  const payment_intent = params.get("payment_intent");
  const [countdown, setCountdown] = useState(5);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  // Generate a random order number
  const orderNumber = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;

  useEffect(() => {
    // Create a flag in localStorage (more persistent than sessionStorage)
    const paymentProcessedKey = `payment_processed_${payment_intent}`;
    const isAlreadyProcessed = localStorage.getItem(paymentProcessedKey) === 'true';

    let timer;

    const makeRequest = async () => {
      // If no payment intent or already processed, skip API call
      if (!payment_intent || isAlreadyProcessed) {
        setLoading(false);
        startCountdown();
        return;
      }

      try {
        setLoading(true);

        // Set the flag BEFORE making the request to prevent race conditions
        localStorage.setItem(paymentProcessedKey, 'true');

        const response = await newRequest.put("/orders", { payment_intent });
        setOrder(response.data);
        toast.success("Paiement traité avec succès !");

      } catch (err) {
        console.error("Payment confirmation error:", err);
        toast.error("Un problème est survenu lors de la confirmation de votre commande");
      } finally {
        setLoading(false);
        startCountdown();
      }
    };

    const startCountdown = () => {
      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            navigate("/orders");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    };

    makeRequest();

    // Cleanup function
    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [payment_intent, navigate]);

  // Generate confetti elements
  const renderConfetti = () => {
    const confettiElements = [];
    for (let i = 0; i < 20; i++) {
      confettiElements.push(<div key={i} className="confetti"></div>);
    }
    return confettiElements;
  };

  // Generate floating bubble elements
  const renderBubbles = () => {
    const bubbleElements = [];
    for (let i = 0; i < 5; i++) {
      bubbleElements.push(<div key={i} className="bubble"></div>);
    }
    return bubbleElements;
  };

  return (
      <div className="success-container">
        {renderBubbles()}
        {renderConfetti()}

        <div className="success-content">
          <div className="success-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          </div>

          <h1 className="success-title">Paiement réussi !</h1>

          <div className="order-number">
            Commande #{orderNumber}
          </div>

          <p className="success-text">
            Merci pour votre réservation ! Votre paiement a été traité avec succès.
            Vous serez redirigé vers votre page de commandes dans {countdown} secondes.
            {loading && <span className="loader"></span>}
          </p>

          <div className="order-details">
            <p className="order-details-text">
              Un email de confirmation a été envoyé à votre adresse email enregistrée.
            </p>
          </div>

          <button
              className="btn-explore"
              onClick={() => navigate("/orders")}
          >
            Voir votre commande
          </button>
        </div>
      </div>
  );
};

export default Success;