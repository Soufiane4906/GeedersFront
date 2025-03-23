import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./MyGigs.scss";
import getCurrentUser from "../../utils/getCurrentUser";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function MyGigs() {
  const currentUser = getCurrentUser();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBy, setFilterBy] = useState("all");

  // Fetching gigs data
  const { isLoading, error, data } = useQuery({
    queryKey: ["myGigs"],
    queryFn: () =>
        newRequest.get(`/gigs?userId=${currentUser._id}`).then((res) => res.data),
  });

  const mutation = useMutation({
    mutationFn: (id) => newRequest.delete(`/gigs/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["myGigs"]);
      toast.success("Gig deleted successfully!");
    },
    onError: () => toast.error("Error deleting gig."),
  });

  const handleDelete = (id) => {
    mutation.mutate(id);
  };

  const calculateTotalPrice = (gig) => {
    return gig.price + (gig.hasCar ? gig.carPrice : 0) + (gig.hasScooter ? gig.scooterPrice : 0);
  };

  // Filter and search functionality
  const filteredGigs = data ? data.filter(gig => {
    // Search filter
    const searchMatch =
        gig.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        gig.country.toLowerCase().includes(searchTerm.toLowerCase());

    // Category filter
    if (filterBy === "all") return searchMatch;
    if (filterBy === "car") return gig.hasCar && searchMatch;
    if (filterBy === "scooter") return gig.hasScooter && searchMatch;
    if (filterBy === "tour") return searchMatch;

    return searchMatch;
  }) : [];

  return (
      <div className="myGigs">
        {isLoading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Loading your gigs...</p>
            </div>
        ) : error ? (
            <div className="error-message">
              <i className="fa fa-exclamation-circle"></i>
              <p>Error fetching gigs. Please try again later.</p>
            </div>
        ) : (
            <div className="container">
              <div className="title">
                <h1>My Posts</h1>
                {currentUser.isAmbassador && (
                    <Link to="/add">
                      <button className="add-btn">
                        <i className="fa fa-plus"></i> Add New Availability
                      </button>
                    </Link>
                )}
              </div>

              <div className="filter-container">
                <div className="search-box">
                  <i className="fa fa-search"></i>
                  <input
                      type="text"
                      placeholder="Search by location..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <div className="filter-options">
                  <span>Filter by:</span>
                  <div className="filter-buttons">
                    <button
                        className={filterBy === "all" ? "active" : ""}
                        onClick={() => setFilterBy("all")}
                    >
                      All
                    </button>
                    <button
                        className={filterBy === "car" ? "active" : ""}
                        onClick={() => setFilterBy("car")}
                    >
                      Car
                    </button>
                    <button
                        className={filterBy === "scooter" ? "active" : ""}
                        onClick={() => setFilterBy("scooter")}
                    >
                      Scooter
                    </button>
                    <button
                        className={filterBy === "tour" ? "active" : ""}
                        onClick={() => setFilterBy("tour")}
                    >
                      Tour Only
                    </button>
                  </div>
                </div>
              </div>

              {filteredGigs.length === 0 ? (
                  <div className="no-results">
                    <i className="fa fa-search"></i>
                    <p>No gigs found matching your criteria</p>
                  </div>
              ) : (
                  <table>
                    <thead>
                    <tr>
                      <th>Location</th>
                      <th>Stars</th>
                      <th>Availability</th>
                      <th>Prices</th>
                      <th>Total Price</th>
                      <th>Action</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredGigs.map((gig) => (
                        <tr key={gig._id}>
                          <td>
                            <Link to={`/gig/${gig._id}`} className="location">
                              <i className="fa fa-map-marker" aria-hidden="true"></i> {gig.city}, {gig.country}
                            </Link>
                          </td>
                          <td>
                            <div className="stars">
                              {gig.totalStars > 0 && gig.totalStars <= 5 ? (
                                  <>
                                    {[...Array(gig.totalStars)].map((_, index) => (
                                        <i key={index} className="fa fa-star" aria-hidden="true"></i>
                                    ))}
                                    {[...Array(5 - gig.totalStars)].map((_, index) => (
                                        <i key={index + gig.totalStars} className="fa fa-star-o" aria-hidden="true"></i>
                                    ))}
                                  </>
                              ) : (
                                  <p>No ratings yet</p>
                              )}
                            </div>
                          </td>
                          <td>
                            {gig.availabilityTimes.map((time, index) => (
                                <div key={index}>{new Date(time).toLocaleDateString()}</div>
                            ))}
                          </td>

                          <td>
                            <div className="price-details">
                              {gig.hasCar && (
                                  <div className="price-item">
                                    <i className="fa fa-car"></i> Car: ${gig.carPrice}
                                  </div>
                              )}
                              {gig.hasScooter && (
                                  <div className="price-item">
                                    <i className="fa fa-motorcycle"></i> Scooter: ${gig.scooterPrice}
                                  </div>
                              )}
                              <div className="price-item">
                                <i className="fa fa-map"></i> Tour: ${gig.price}
                              </div>
                            </div>
                          </td>
                          <td>
                            <div className="total-price">${calculateTotalPrice(gig)}</div>
                          </td>
                          <td className="action-cell">
                            <Link to={`/gig/${gig._id}`} className="view-btn">
                              <i className="fa fa-eye"></i>
                            </Link>
                            <button
                                className="delete-btn"
                                onClick={() => handleDelete(gig._id)}
                            >
                              <i className="fa fa-trash"></i>
                            </button>
                          </td>
                        </tr>
                    ))}
                    </tbody>
                  </table>
              )}
            </div>
        )}
      </div>
  );
}

export default MyGigs;