import React from 'react';
import { FaFilePdf, FaDollarSign, FaClock, FaMapMarkerAlt, FaCar, FaCalendarAlt, FaCheck, FaEnvelope, FaPhone, FaLanguage } from 'react-icons/fa';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import newRequest from '../../utils/newRequest';
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import './SingleOrder.scss';

const SingleOrder = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { isLoading, error, data } = useQuery({
    queryKey: ['order', id],
    queryFn: () => newRequest.get(`/orders/${id}`).then((res) => res.data),
  });

  const generatePDF = () => {
    const element = document.getElementById('pdf-content');

    // Add PDF generation class to apply specific styles for PDF
    element.classList.add('generating-pdf');

    html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff'
    }).then((canvas) => {
      const imgData = canvas.toDataURL('image/jpeg', 1.0);
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210; // A4 size width in mm
      const pageHeight = 295; // A4 size height in mm
      const imgHeight = canvas.height * imgWidth / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      // Add logo or header to PDF
      pdf.setFillColor(255, 104, 26); // Theme color
      pdf.rect(0, 0, 210, 20, 'F');
      pdf.setTextColor(255, 255, 255);
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(16);
      pdf.text("Order Invoice", 105, 12, { align: "center" });

      // Add the order image below the header
      pdf.addImage(imgData, 'JPEG', 0, 20, imgWidth, imgHeight);
      heightLeft -= (pageHeight - 20);

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();

        // Add header to each page
        pdf.setFillColor(255, 104, 26);
        pdf.rect(0, 0, 210, 20, 'F');
        pdf.setTextColor(255, 255, 255);
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(16);
        pdf.text("Order Invoice", 105, 12, { align: "center" });

        pdf.addImage(imgData, 'JPEG', 0, position + 20, imgWidth, imgHeight);
        heightLeft -= (pageHeight - 20);
      }

      // Add footer to all pages
      const pageCount = pdf.internal.getNumberOfPages();
      pdf.setFontSize(10);

      for(let i = 1; i <= pageCount; i++) {
        pdf.setPage(i);
        pdf.setTextColor(128, 128, 128);
        pdf.text(`Page ${i} of ${pageCount}`, 105, 290, { align: 'center' });
        pdf.setDrawColor(255, 104, 26);
        pdf.line(20, 285, 190, 285);
      }

      pdf.save(`order-invoice-${id}.pdf`);

      // Remove the PDF generation class
      element.classList.remove('generating-pdf');
    });
  };

  if (isLoading) return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading order details...</p>
      </div>
  );

  if (error) return (
      <div className="error-container">
        <div className="error-icon">❌</div>
        <p>Error loading order details. Please try again.</p>
        <button className="btn-retry" onClick={() => window.location.reload()}>Retry</button>
      </div>
  );

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
      <div className="single-order-container">
        <div className="single-order">
          <div className="order-header">
            <h1>Order Details</h1>
            <div className="actions">
              <button className="btn-pdf" onClick={generatePDF}>
                <FaFilePdf /> Export as PDF
              </button>
              <button className="btn-back" onClick={() => navigate("/orders")}>
                Back to Orders
              </button>
            </div>
          </div>

          <div id="pdf-content" className="order-details">
            <div className="order-banner">
              <div className="logo-area">
                <div className="company-logo">TravelBuddy</div>
              </div>
              <div className="order-id">
                <span>Order #</span>
                <strong>{id}</strong>
              </div>
            </div>

            <div className="content-grid">
              {/* Order Information */}
              <div className="info-card order-info">
                <div className="card-header">
                  <h2>Order Information</h2>
                </div>
                <div className="card-body">
                  <div className="info-grid">
                    <div className="info-item">
                      <div className="info-label"><FaFilePdf className="icon" /> Title</div>
                      <div className="info-value">{data.order.title}</div>
                    </div>
                    <div className="info-item">
                      <div className="info-label"><FaDollarSign className="icon" /> Total Price</div>
                      <div className="info-value price">${data.order.totalprice}</div>
                    </div>
                    <div className="info-item">
                      <div className="info-label"><FaClock className="icon" /> Duration</div>
                      <div className="info-value">{data.order.duration} hours</div>
                    </div>
                    <div className="info-item">
                      <div className="info-label"><FaMapMarkerAlt className="icon" /> Location</div>
                      <div className="info-value">{data.order.location || "N/A"}</div>
                    </div>
                    <div className="info-item">
                      <div className="info-label"><FaCar className="icon" /> Vehicle Option</div>
                      <div className="info-value">{data.order.options?.car ? "Car" : data.order.options?.scooter ? "Scooter" : "None"}</div>
                    </div>
                    <div className="info-item">
                      <div className="info-label"><FaCalendarAlt className="icon" /> Order Date</div>
                      <div className="info-value">{formatDate(data.order.createdAt)}</div>
                    </div>
                    <div className="info-item">
                      <div className="info-label"><FaCheck className="icon" /> Status</div>
                      <div className={`info-value status ${data.order.isCompleted ? "completed" : "pending"}`}>
                        {data.order.isCompleted ? "Completed" : "Pending"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Ambassador Information */}
              <div className="info-card ambassador-info">
                <div className="card-header">
                  <h2>Ambassador Information</h2>
                </div>
                <div className="card-body">
                  <div className="ambassador-profile">
                    <div className="ambassador-img">
                      <img
                          src={data.Ambassador.img || "https://via.placeholder.com/150"}
                          alt={data.Ambassador.username}
                          className="profile-photo"
                      />
                      <div className={`verification-badge ${data.Ambassador.isVerified ? "verified" : "not-verified"}`}>
                        {data.Ambassador.isVerified ? "✓" : "✗"}
                      </div>
                    </div>
                    <div className="ambassador-details">
                      <h3 className="ambassador-name">{data.Ambassador.username}</h3>
                      <div className="contact-info">
                        <p><FaEnvelope className="icon" /> {data.Ambassador.email}</p>
                        <p><FaPhone className="icon" /> {data.Ambassador.phone || "Not provided"}</p>
                        <p><FaMapMarkerAlt className="icon" /> {data.Ambassador.city}, {data.Ambassador.country}</p>
                        <p><FaLanguage className="icon" /> {data.Ambassador.spokenLanguages || "Not specified"}</p>
                      </div>
                      <div className="ambassador-bio">
                        <h4>About Ambassador</h4>
                        <p>{data.Ambassador.desc || "No description available."}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="footer-note">
              <p>Thank you for booking with us!</p>
              <p className="small">This document serves as your official receipt and booking confirmation.</p>
            </div>
          </div>
        </div>
      </div>
  );
};

export default SingleOrder;