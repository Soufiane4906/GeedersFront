import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from "react-router-dom";

import "../../style.scss";
const BlogSection = () => {
  return (
      <section className="blog-wrapper" style={{ padding: "60px 0" }}>
        <div className="container">
          <div className="row" style={{justifyContent: "center", textAlign: "center"}}>
            <div className="col-xl-6 col-lg-8" style={{animationDelay: "0.3s"}}>
              <div className="title-area">
                <span className="sec-subtitle">Traveler Stories</span>
                <h2 className="sec-title" style={{fontSize: "2rem"}}>Travel Differently with Local Ambassadors</h2>
                <p className="sec-text">
                  At Blablatrip, we believe that traveling is not just about visiting places, but about experiencing
                  authentic and meaningful connections with local Ambassadors who share their culture, stories, and
                  hidden gems.
                </p>
              </div>
            </div>
          </div>
          <div className="row" style={{display: "flex", flexWrap: "wrap"}}>
            {[
              {
                img: "assets/img/blog/blog-h-1-1.jpg",
                title: "Travel Without Language Barriers",
                text: "Choose an Ambassador who speaks your language for easy communication, better cultural understanding, and even language practice in a natural setting.",
                date: "April 1, 2025"
              },
              {
                img: "assets/img/blog/blog-h-1-1.jpg",
                title: "Tailor-Made Experiences Based on Your Interests",
                text: "Whether you're passionate about history, gastronomy, nature, or nightlife, find an Ambassador who shares your passions for an authentic experience.",
                date: "March 28, 2025"
              },
              {
                img: "assets/img/blog/blog-h-1-1.jpg",
                title: "Explore with Ease - Ambassadors with Vehicles",
                text: "Some Ambassadors offer transportation options, providing their car or motorcycle to help you get around and explore hard-to-reach locations effortlessly.",
                date: "March 25, 2025"
              },
              {
                img: "assets/img/blog/blog-h-1-1.jpg",
                title: "Be a Traveler Today, an Ambassador Tomorrow",
                text: "You can be a traveler one day and an Ambassador the next on Blablatrip.com, the only platform connecting travelers with local guides worldwide.",
                date: "March 20, 2025"
              }
            ].map((blog, index) => (
                <div key={index} className="col-xl-3" style={{padding: "15px", display: "flex"}}>
                  <div className="vs-blog" style={{
                    border: "1px solid #ddd",
                    borderRadius: "10px",
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                    height: "100%"  // Make sure all cards have the same height
                  }}>
                    <div className="blog-img">
                      <Link to="/blog-details">
                        <img src={blog.img} alt="blog image" style={{width: "100%", display: "block"}}/>
                      </Link>
                    </div>
                    <div className="blog-content" style={{padding: "15px", flex: "1"}}>
                      <h2 className="blog-title" style={{fontSize: "1.5rem"}}>
                        <Link to="/blog-details">{blog.title}</Link>
                      </h2>
                      <p className="blog-text" style={{color: "#555"}}>
                        {blog.text}
                      </p>
                    </div>
                    <div className="blog-bottom" style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "15px"
                    }}>
                      <Link className="blog-date" to="/blog-details" style={{color: "#777"}}>
                        <i className="fas fa-calendar-alt"></i> {blog.date}
                      </Link>
                      <Link className="vs-btn" to="/blog-details" style={{
                        background: "#000",
                        color: "#fff",
                        padding: "8px 12px",
                        textDecoration: "none",
                        borderRadius: "5px"
                      }}>
                        Read More <i className="fal fa-arrow-right"></i>
                      </Link>
                    </div>
                  </div>
                </div>
            ))}
          </div>
          <div className="row" style={{marginTop: "40px"}}>
            <div className="col-12">
              <div className="vs-blog"
                   style={{border: "1px solid #ddd", borderRadius: "10px", overflow: "hidden", padding: "20px"}}>
                <div className="blog-content">
                  <h2 className="blog-title text-center" style={{fontSize: "1.8rem", marginBottom: "20px"}}>
                    Traveler Stories
                  </h2>
                  <div className="row">
                    <div className="col-md-6">
                      <div style={{background: "#f9f9f9", padding: "15px", borderRadius: "8px", marginBottom: "15px"}}>
                        <h3 style={{fontSize: "1.3rem"}}>Carlos & Maria in New York</h3>
                        <p style={{color: "#555"}}>
                          "Jack, a New Yorker passionate about nightlife, took us on an unforgettable evening. With his
                          car, he took us to exclusive clubs and bars, far from touristy spots. We danced until dawn and
                          discovered hidden spots that only locals know."
                        </p>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div style={{background: "#f9f9f9", padding: "15px", borderRadius: "8px", marginBottom: "15px"}}>
                        <h3 style={{fontSize: "1.3rem"}}>Alex & Lucas in Dubai</h3>
                        <p style={{color: "#555"}}>
                          "Omar, a passionate Dubai local, made sure we lived incredible moments. He took us to top
                          activities: water sports, shopping, and a desert safari. In the evening, he showed us the best
                          nightclubs where we could enjoy the vibrant Dubai nightlife."
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="text-center" style={{marginTop: "30px"}}>
            <Link to="/stories" className="vs-btn" style={{
              background: "#000",
              color: "#fff",
              padding: "10px 20px",
              textDecoration: "none",
              borderRadius: "5px"
            }}>
              Discover More Stories
            </Link>
          </div>
        </div>
      </section>
  );
};

export default BlogSection;