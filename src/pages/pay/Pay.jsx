import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import newRequest from '../../utils/newRequest';
import CheckoutForm from '../../components/checkoutForm/CheckoutForm';
// import 'bootstrap/dist/css/bootstrap.min.css';
import './Pay.scss'; // Import custom styles

const stripePromise = loadStripe("pk_test_51OtdAyGmXNQGydzP913niVXoymwGsHLrlllPlvqx2fcP96HMGtgp8vHs4wTPuvXtl5yD9SEBjAI6EjrEJIjdCjuh00GtozZgkO");

const Pay = () => {
  const [clientSecret, setClientSecret] = useState("");
  const [bookingDetails, setBookingDetails] = useState({});

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const byId = currentUser._id;

  const fetchBookingDetailsAndMakeRequest = async () => {
    const details = JSON.parse(sessionStorage.getItem('bookingDetails'));
    setBookingDetails(details || {});

    if (!details || !details.id || !currentUser?._id) return;

    try {
      const res = await newRequest.post(`/orders/create-payment-intent/${details.id}`, {
        totalPrice: details.totalPrice,
        city: details.city,
        country: details.country,
        options: {
          vehicle: details.selectedVehicle,
          carPrice: details.carPrice,
          scooterPrice: details.scooterPrice
        },
        hours: details.hours,
        GuestId: byId, // Include GuestId in the request payload
      });

      setClientSecret(res.data.clientSecret);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchBookingDetailsAndMakeRequest();
  }, []);

  const appearance = {
    theme: 'stripe',
  };
  const options = {
    clientSecret,
    appearance,
  };

  const currentDate = new Date().toLocaleDateString();

  return (
    <div className="pay container">
      <div className="pay-content">
        <div className="checkout-form">
          {clientSecret && (
            <Elements options={options} stripe={stripePromise}>
              <CheckoutForm />
            </Elements>
          )}
        </div>
        <div className="order-summary">
          <div className="order-summary-header">
            <h2>Order Summary</h2>
            <p>{currentDate}</p>
          </div>
          <div className="order-summary-body">
            <div className="summary-item">
              <div className="summary-description">Base Price</div>
              <div className="summary-price">${bookingDetails?.price || '0.00'}</div>
            </div>
            <div className="summary-item">
            </div>
            {bookingDetails?.selectedVehicle && (
              <div className="summary-item">
                <div className="summary-description">Transport ({bookingDetails.selectedVehicle})</div>
                <div className="summary-price">
                  ${bookingDetails?.carPrice || bookingDetails?.scooterPrice || '0.00'}
                </div>
              </div>
            )}
            <div className="summary-item">
              <div className="summary-description">Total Hours</div>
              <div className="summary-price">{bookingDetails?.hours || '0'} hours</div>
            </div>
            <div className="summary-total">
              <div className="summary-description">Total Price</div>
              <div className="summary-price total">${bookingDetails?.totalPrice || '0.00'}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pay;
