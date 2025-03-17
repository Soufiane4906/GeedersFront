import React from 'react';
import { FaFilePdf, FaDollarSign, FaClock, FaMapMarkerAlt, FaCar, FaCalendarAlt, FaCheck, FaEnvelope, FaPhone, FaLanguage } from 'react-icons/fa';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import newRequest from '../../utils/newRequest';
//canvspdf
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const SingleOrder = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { isLoading, error, data } = useQuery({
    queryKey: ['order', id],
    queryFn: () => newRequest.get(`/orders/${id}`).then((res) => res.data),
  });

  const generatePDF = () => {
    const element = document.getElementById('pdf-content');

    html2canvas(element, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL('image/jpeg');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210; // A4 size width in mm
      const pageHeight = 295; // A4 size height in mm
      const imgHeight = canvas.height * imgWidth / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save('invoice.pdf');
    });
  };

  if (isLoading) return <p className="text-center">Loading...</p>;
  if (error) return <p className="text-center text-danger">Error loading order details.</p>;

  return (
    <div className="single-order container mt-4">
      <div id="pdf-content" className="order-details">
        <div className="row">
          {/* Order Information */}
          <div className="col-md-6">
            <div className="card">
              <div className="card-header bg-primary text-white">
                <h2  style={{textAlign :'center'}}>Order Information</h2>
              </div>
              <div className="card-body">
                <table className="table table-bordered">
                  <tbody>
                    <tr>
                      <th><FaFilePdf /> Title</th>
                      <td>{data.order.title}</td>
                    </tr>
                    <tr>
                      <th><FaDollarSign /> Total Price</th>
                      <td>${data.order.totalprice}</td>
                    </tr>
                    <tr>
                      <th><FaClock /> Duration</th>
                      <td>{data.order.duration} hours</td>
                    </tr>
                    <tr>
                      <th><FaMapMarkerAlt /> Location</th>
                      <td>{data.order.location || "N/A"}</td>
                    </tr>
                    <tr>
                      <th><FaCar /> Vehicle Option</th>
                      <td>{data.order.options?.car ? "Car" : data.order.options?.scooter ? "Scooter" : "None"}</td>
                    </tr>
                    <tr>
                      <th><FaCalendarAlt /> Order Date</th>
                      <td>{new Date(data.order.createdAt).toLocaleDateString()}</td>
                    </tr>
                    <tr>
                      <th><FaCheck /> Status</th>
                      <td>{data.order.isCompleted ? "Completed" : "Pending"}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Guide Information */}
          <div className="col-md-6">
            <div className="card">
              <div className="card-header bg-success text-white">
                <h2 style={{textAlign :'center'} }>Ambassador Information</h2>
              </div>
              <div className="card-body">
                <div className="d-flex align-items-center mb-3">
                  <img
                    src={data.seller.img || "https://via.placeholder.com/100"}
                    alt="Guide"
                    className="img-fluid rounded-circle me-3"
                    style={{ width: '100px', height: '100px' }}
                  />
                  <div>
                    <h5 className="card-title">{data.seller.username}</h5>
                    <p className="card-text">
                      <FaEnvelope /> {data.seller.email}
                    </p>
                    <p className="card-text">
                      <FaPhone /> {data.seller.phone || "N/A"}
                    </p>
                    <p className="card-text">
                      <FaMapMarkerAlt /> {data.seller.city}, {data.seller.country}
                    </p>
                    <p className="card-text">
                      <FaLanguage /> {data.seller.spokenLanguages || "N/A"}
                    </p>
                    <p className="card-text">
                      {data.seller.desc || "N/A"}
                    </p>
                    <p className="card-text">
                      <FaCheck /> {data.seller.isVerified ? "Verified" : "Not Verified"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-4">
          <button className="btn btn-primary pdf-button" onClick={generatePDF}>
            <FaFilePdf /> Generate PDF
          </button>
          <button className="btn btn-secondary ms-2" onClick={() => navigate("/orders")}>
            Back to Orders
          </button>
        </div>
      </div>
    </div>
  );
};

export default SingleOrder;
