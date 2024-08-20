import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import newRequest from '../../utils/newRequest';
import CheckoutForm from '../../components/checkoutForm/CheckoutForm';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Pay.scss'; // Import custom styles

const stripePromise = loadStripe("pk_live_51MJf33CGwTF1kH4wbf5E4l3qWjRm9jembJpLorwghX5NuQTu9WqRujtBJ9OAsnL43rkpBGLOM9Xd5gyNfNFA2aMT00JFT3qejX");

const Pay = () => {
  const [clientSecret, setClientSecret] = useState("");
  const [bookingDetails, setBookingDetails] = useState({});

  useEffect(() => {
    const fetchBookingDetails = () => {
      const details = JSON.parse(sessionStorage.getItem('bookingDetails'));
      setBookingDetails(details || {});
    };
    fetchBookingDetails();
  }, []);

  useEffect(() => {
    const makeRequest = async () => {
      if (!bookingDetails.id) return;

      try {
        const res = await newRequest.post(`/orders/create-payment-intent/${bookingDetails.id}`, {
          totalPrice: bookingDetails.totalPrice,
          city: bookingDetails.city,
          buyerId : bookingDetails.buyerId,
          country: bookingDetails.country,
          options: {
            vehicle: bookingDetails.selectedVehicle,
            carPrice: bookingDetails.carPrice,
            scooterPrice: bookingDetails.scooterPrice
          },
          hours: bookingDetails.hours,
        });

        setClientSecret(res.data.clientSecret);
      } catch (err) {
        console.log(err);
      }
    };

    makeRequest();
  }, [bookingDetails]);

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
