import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./SingleOrder.scss";
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaFilePdf } from 'react-icons/fa';

const SingleOrder = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { isLoading, error, data } = useQuery({
    queryKey: ["order", id],
    queryFn: () => newRequest.get(`/orders/${id}`).then((res) => res.data),
  });

  const generatePDF = () => {
    const input = document.getElementById('pdf-content');
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210; // A4 size width in mm
      const pageHeight = 295; // A4 size height in mm
      const imgHeight = canvas.height * imgWidth / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save("invoice.pdf");
    });
  };

  if (isLoading) return <p className="text-center">Loading...</p>;
  if (error) return <p className="text-center text-danger">Error loading order details.</p>;

  return (
    <div className="single-order container mt-4">
      <header className="header mb-4">
        <h1 className="text-primary">Geeders</h1>
        <div className="contact-info">
          <p><FaPhone /> +212 773-777320</p>
          <p><FaEnvelope /> geeders.info@gmail.com</p>
          <p>geeders.com</p>
        </div>
      </header>
      <div id="pdf-content" className="order-details">
        <div className="row">
          <div className="col-md-6">
            <div className="card">
              <div className="card-header bg-primary text-white">
                <h2>Order Information</h2>
              </div>
              <div className="card-body">
                <table className="table table-bordered">
                  <tbody>
                    <tr>
                      <th>Title</th>
                      <td>{data.order.title}</td>
                    </tr>
                    <tr>
                      <th>Price</th>
                      <td>${data.order.price}</td>
                    </tr>
                    <tr>
                      <th>Total Price</th>
                      <td>${data.order.totalprice}</td>
                    </tr>
                    <tr>
                      <th>Duration</th>
                      <td>{data.order.duration} hours</td>
                    </tr>
                    <tr>
                      <th>Location</th>
                      <td>{data.order.location || "N/A"}</td>
                    </tr>
                    <tr>
                      <th>Vehicle Option</th>
                      <td>{data.order.options?.car ? "Car" : data.order.options?.scooter ? "Scooter" : "None"}</td>
                    </tr>
                    <tr>
                      <th>Order Date</th>
                      <td>{new Date(data.order.createdAt).toLocaleDateString()}</td>
                    </tr>
                    <tr>
                      <th>Status</th>
                      <td>{data.order.isCompleted ? "Completed" : "Pending"}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card">
              <div className="card-header bg-success text-white">
                <h2>Guide Information</h2>
              </div>
              <div className="card-body">
                <table className="table table-bordered">
                  <tbody>
                    <tr>
                      <th>Username</th>
                      <td>{data.seller.username}</td>
                    </tr>
                    <tr>
                      <th>Full Name</th>
                      <td>{data.seller.firstName} {data.seller.lastName}</td>
                    </tr>
                    <tr>
                      <th>Email</th>
                      <td>{data.seller.email}</td>
                    </tr>
                    <tr>
                      <th>Phone</th>
                      <td>{data.seller.phone || "N/A"}</td>
                    </tr>
                    <tr>
                      <th>Location</th>
                      <td>{data.seller.city}, {data.seller.country}</td>
                    </tr>
                    <tr>
                      <th>Description</th>
                      <td>{data.seller.desc || "N/A"}</td>
                    </tr>
                    <tr>
                      <th>Verified</th>
                      <td>{data.seller.isVerified ? "Yes" : "No"}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <div className="text-center mt-4">
          <button className="btn btn-primary" onClick={generatePDF}>
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
