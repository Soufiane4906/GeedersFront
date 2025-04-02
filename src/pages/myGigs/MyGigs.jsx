import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./MyGigs.scss";
import getCurrentUser from "../../utils/getCurrentUser";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function MyGigs() {
  const currentUser = getCurrentUser();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBy, setFilterBy] = useState("all");
  const [selectedGig, setSelectedGig] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Fetching gigs data
  const { isLoading, error, data } = useQuery({
    queryKey: ["myGigs"],
    queryFn: () =>
        newRequest.get(`/gigs?userId=${currentUser._id}`).then((res) => res.data),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => newRequest.delete(`/gigs/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["myGigs"]);
      toast.success("Gig deleted successfully!");
    },
    onError: () => toast.error("Error deleting gig."),
  });

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this gig?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleEdit = (gig) => {
    navigate(`/edit-gig/${gig._id}`, { state: { gigData: gig } });
  };

  const calculateTotalPrice = (gig) => {
    return (gig.price || 0) +
        (gig.hasCar && gig.carPrice ? gig.carPrice : 0) +
        (gig.hasScooter && gig.scooterPrice ? gig.scooterPrice : 0);
  };

  const openDetailsModal = (gig) => {
    setSelectedGig(gig);
    setShowDetailsModal(true);
  };

  const closeDetailsModal = () => {
    setShowDetailsModal(false);
    setSelectedGig(null);
  };

  // Filter and search functionality
  const filteredGigs = data ? data.filter(gig => {
    // Search filter
    const searchMatch =
        gig.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        gig.country?.toLowerCase().includes(searchTerm.toLowerCase());

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
                <h1>Mes Annonces</h1>
                {currentUser.isAmbassador && (
                    <Link to="/add">
                      <button className="add-btn">
                        <i className="fa fa-plus"></i> Ajouter une disponibilité
                      </button>
                    </Link>
                )}
              </div>

              <div className="filter-container">
                <div className="search-box">
                  <i className="fa fa-search"></i>
                  <input
                      type="text"
                      placeholder="Rechercher par lieu..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <div className="filter-options">
                  <span>Filtrer par:</span>
                  <div className="filter-buttons">
                    <button
                        className={filterBy === "all" ? "active" : ""}
                        onClick={() => setFilterBy("all")}
                    >
                      Tous
                    </button>
                    <button
                        className={filterBy === "car" ? "active" : ""}
                        onClick={() => setFilterBy("car")}
                    >
                      Voiture
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
                      Tour uniquement
                    </button>
                  </div>
                </div>
              </div>

              {filteredGigs.length === 0 ? (
                  <div className="no-results">
                    <i className="fa fa-search"></i>
                    <p>Aucune annonce ne correspond à vos critères</p>
                  </div>
              ) : (
                  <div className="gigs-cards-container">
                    {filteredGigs.map((gig) => (
                        <div key={gig._id} className="gig-card">
                          <div className="gig-header">
                            <div className="location-info">
                              <i className="fa fa-map-marker"></i>
                              <h3>{gig.city}, {gig.country}</h3>
                            </div>
                            <div className="stars">
                              {gig.totalStars > 0 && gig.totalStars <= 5 ? (
                                  <>
                                    {[...Array(Math.floor(gig.totalStars))].map((_, index) => (
                                        <i key={index} className="fa fa-star" aria-hidden="true"></i>
                                    ))}
                                    {[...Array(5 - Math.floor(gig.totalStars))].map((_, index) => (
                                        <i key={index + Math.floor(gig.totalStars)} className="fa fa-star-o" aria-hidden="true"></i>
                                    ))}
                                  </>
                              ) : (
                                  <span className="no-ratings">Pas encore d'évaluations</span>
                              )}
                            </div>
                          </div>

                          <div className="gig-content">
                            <div className="dates-section">
                              <h4>Disponibilités:</h4>
                              <div className="availability-dates">
                                {gig.availabilityTimes && gig.availabilityTimes.length > 0 ? (
                                    gig.availabilityTimes.slice(0, 3).map((time, index) => (
                                        <div key={index} className="date-badge">
                                          {new Date(time).toLocaleDateString()}
                                        </div>
                                    ))
                                ) : (
                                    <span className="no-dates">Aucune date définie</span>
                                )}
                                {gig.availabilityTimes && gig.availabilityTimes.length > 3 && (
                                    <div className="more-dates">+{gig.availabilityTimes.length - 3} de plus</div>
                                )}
                              </div>
                            </div>

                            <div className="price-section">
                              <div className="price-details">
                                {gig.hasCar && gig.carPrice !== undefined && (
                                    <div className="price-item">
                                      <i className="fa fa-car"></i> Voiture: {gig.carPrice}€
                                    </div>
                                )}
                                {gig.hasScooter && gig.scooterPrice !== undefined && (
                                    <div className="price-item">
                                      <i className="fa fa-motorcycle"></i> Scooter: {gig.scooterPrice}€
                                    </div>
                                )}
                                <div className="price-item">
                                  <i className="fa fa-map"></i> Tour: {gig.price}€
                                </div>
                              </div>
                              <div className="total-price">
                                <span>Total:</span> {calculateTotalPrice(gig)}€
                              </div>
                            </div>
                          </div>

                          <div className="gig-actions">
                            <button
                                className="action-btn details-btn"
                                onClick={() => openDetailsModal(gig)}
                                title="Voir les détails"
                            >
                              <i className="fa fa-info-circle"></i> Détails
                            </button>
                            <button
                                className="action-btn edit-btn"
                                onClick={() => handleEdit(gig)}
                                title="Modifier l'annonce"
                            >
                              <i className="fa fa-pencil"></i> Modifier
                            </button>
                            <button
                                className="action-btn delete-btn"
                                onClick={() => handleDelete(gig._id)}
                                title="Supprimer l'annonce"
                            >
                              <i className="fa fa-trash"></i> Supprimer
                            </button>
                          </div>
                        </div>
                    ))}
                  </div>
              )}
            </div>
        )}

        {/* Details Modal */}
        {showDetailsModal && selectedGig && (
            <div className="modal-overlay" onClick={closeDetailsModal}>
              <div className="details-modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                  <h2>{selectedGig.city}, {selectedGig.country}</h2>
                  <button className="close-btn" onClick={closeDetailsModal}>
                    <i className="fa fa-times"></i>
                  </button>
                </div>

                <div className="modal-content">
                  <div className="modal-section">
                    <h3><i className="fa fa-info-circle"></i> Description</h3>
                    <p>{selectedGig.shortDesc || "Aucune description disponible."}</p>
                  </div>

                  <div className="modal-section">
                    <h3><i className="fa fa-calendar"></i> Disponibilités</h3>
                    <div className="dates-grid">
                      {selectedGig.availabilityTimes && selectedGig.availabilityTimes.length > 0 ? (
                          selectedGig.availabilityTimes.map((time, index) => (
                              <div key={index} className="date-item">
                                {new Date(time).toLocaleDateString()}
                              </div>
                          ))
                      ) : (
                          <p>Aucune date disponible</p>
                      )}
                    </div>
                  </div>

                  <div className="modal-section">
                    <h3><i className="fa fa-tag"></i> Tarifs</h3>
                    <div className="price-details-full">
                      <div className="price-row">
                        <span>Tour guidé:</span>
                        <span className="price-value">{selectedGig.price}€</span>
                      </div>
                      {selectedGig.hasCar && selectedGig.carPrice !== undefined && (
                          <div className="price-row">
                            <span>Option voiture:</span>
                            <span className="price-value">{selectedGig.carPrice}€</span>
                          </div>
                      )}
                      {selectedGig.hasScooter && selectedGig.scooterPrice !== undefined && (
                          <div className="price-row">
                            <span>Option scooter:</span>
                            <span className="price-value">{selectedGig.scooterPrice}€</span>
                          </div>
                      )}
                      <div className="price-row total">
                        <span>Total:</span>
                        <span className="price-value">{calculateTotalPrice(selectedGig)}€</span>
                      </div>
                    </div>
                  </div>

                  {selectedGig.features && selectedGig.features.length > 0 && (
                      <div className="modal-section">
                        <h3><i className="fa fa-check-circle"></i> Caractéristiques</h3>
                        <ul className="features-list">
                          {selectedGig.features.map((feature, index) => (
                              <li key={index}><i className="fa fa-check"></i> {feature}</li>
                          ))}
                        </ul>
                      </div>
                  )}
                </div>

                <div className="modal-footer">
                  <Link to={`/gig/${selectedGig._id}`} className="view-full-btn">
                    <i className="fa fa-eye"></i> Voir la page complète
                  </Link>
                  <button className="edit-btn" onClick={() => handleEdit(selectedGig)}>
                    <i className="fa fa-pencil"></i> Modifier
                  </button>
                </div>
              </div>
            </div>
        )}
      </div>
  );
}

export default MyGigs;
