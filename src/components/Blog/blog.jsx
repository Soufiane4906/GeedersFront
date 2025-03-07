import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from "react-router-dom";

import "../../style.scss";
const BlogSection = () => {
  return (
    <section className="blog-wrapper" style={{ padding: "60px 0" }}>
      <div className="container">
        <div className="row" style={{ justifyContent: "center", textAlign: "center" }}>
          <div className="col-xl-6 col-lg-8" style={{ animationDelay: "0.3s" }}>
            <div className="title-area">
              <span className="sec-subtitle">Blog & News</span>
              <h2 className="sec-title" style={{ fontSize: "2rem" }}>Our Latest Blog</h2>
              <p className="sec-text">
                Curabitur aliquet quam id dui posuere blandit. Vivamus magna justo, lacinia eget consectetur sed, convallis at tellus. Vestibulum ac diam sit.
              </p>
            </div>
          </div>
        </div>
        <div className="row" style={{ display: "flex", flexWrap: "wrap" }}>
          {[{
            img: "assets/img/blog/blog-h-1-1.jpg",
            title: "We Are Giving Amazing Experience For VIP",
            date: "July 22, 2023"
          }, {
            img: "assets/img/blog/blog-h-1-1.jpg",
            title: "Uncharted Territories Are Exploring The Unknown",
            date: "July 24, 2023"
          }, {
            img: "assets/img/blog/blog-h-1-1.jpg",
            title: "Roam And Revel Captivating Destinations Explored",
            date: "Aug 21, 2023"
          }, {
            img: "assets/img/blog/blog-h-1-1.jpg",
            title: "Voyage vignettes adventures beyond the horizon",
            date: "Sep 21, 2023"
          }].map((blog, index) => (
            <div key={index} className="col-xl-4" style={{ padding: "15px" }}>
              <div className="vs-blog" style={{ border: "1px solid #ddd", borderRadius: "10px", overflow: "hidden" }}>
                <div className="blog-img">
                  <Link to="/blog-details">
                    <img src={blog.img} alt="blog image" style={{ width: "100%", display: "block" }} />
                  </Link>
                </div>
                <div className="blog-content" style={{ padding: "15px" }}>
                  <h2 className="blog-title" style={{ fontSize: "1.5rem" }}>
                    <Link to="/blog-details">{blog.title}</Link>
                  </h2>
                  <p className="blog-text" style={{ color: "#555" }}>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Dolor sit amet.
                  </p>
                  <div className="blog-bottom" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Link className="blog-date" to="/blog-details" style={{ color: "#777" }}>
                      <i className="fas fa-calendar-alt"></i> {blog.date}
                    </Link>
                    <Link className="vs-btn" to="/blog-details" style={{ background: "#000", color: "#fff", padding: "8px 12px", textDecoration: "none", borderRadius: "5px" }}>
                      Read More <i className="fal fa-arrow-right"></i>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center" style={{ marginTop: "30px" }}>
          <Link to="/blog-grid" className="vs-btn" style={{ background: "#000", color: "#fff", padding: "10px 20px", textDecoration: "none", borderRadius: "5px" }}>
            View More
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BlogSection;
