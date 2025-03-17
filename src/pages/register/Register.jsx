import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./Register.scss";
import newRequest from "../../utils/newRequest";
import HeroProfile from "../../components/HeroProfile";
import Footer from "../../components/footer/Footer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCity, faGlobe } from "@fortawesome/free-solid-svg-icons";

const topVisitedCities = [
  { city: "Bangkok", country: "Thailand" },
  { city: "Casablanca", country: "Morocco" },
  { city: "Paris", country: "France" },
  { city: "London", country: "United Kingdom" },
  { city: "Dubai", country: "United Arab Emirates" },
  { city: "Singapore", country: "Singapore" },
  { city: "Kuala Lumpur", country: "Malaysia" },
  { city: "New York", country: "United States" },
  { city: "Istanbul", country: "Turkey" },
  { city: "Tokyo", country: "Japan" },
  { city: "Milan", country: "Italy" },
  { city: "Barcelona", country: "Spain" },
  { city: "Bali", country: "Indonesia" },
];

const uniqueCountries = [...new Set(topVisitedCities.map((c) => c.country))];

function Register() {
  const [step, setStep] = useState(1);
  const [user, setUser] = useState({
    firstname: "",
    lastname: "",
    email: "",
    username: "",
    country: "",
    city: "",
    password: "",
    isAmbassador: false,
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setUser((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleCountryChange = (e) => {
    const selectedCountry = e.target.value;
    setUser((prev) => ({ ...prev, country: selectedCountry, city: "" }));
  };

  const handleCityChange = (e) => {
    setUser((prev) => ({ ...prev, city: e.target.value }));
  };

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await newRequest.post("/auth/register", user);
      toast.success("Inscription réussie !");
      navigate("/login");
    } catch (err) {
      toast.error("Une erreur s'est produite lors de l'inscription !");
    }
  };

  return (
      <>
        <HeroProfile />
        <div className="register mt-4 mb-4"> {/* Added margin top and bottom */}
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-6">
                <form onSubmit={handleSubmit} className="signup-form bg-smoke p-4 rounded">
                  <h1 className="form-title text-center mb-lg-35">Inscription</h1>

                  {/* Étape 1 : Infos personnelles */}
                  {step === 1 && (
                      <>
                        <div className="form-group">
                          <label htmlFor="firstname">Prénom</label>
                          <input
                              name="firstname"
                              type="text"
                              placeholder="Prénom"
                              value={user.firstname}
                              onChange={handleChange}
                              className="form-control"
                              required
                          />
                        </div>

                        <div className="form-group">
                          <label htmlFor="lastname">Nom</label>
                          <input
                              name="lastname"
                              type="text"
                              placeholder="Nom"
                              value={user.lastname}
                              onChange={handleChange}
                              className="form-control"
                              required
                          />
                        </div>

                        <button type="button" onClick={nextStep} className="vs-btn style4 w-100">
                          Suivant
                        </button>
                      </>
                  )}

                  {/* Étape 2 : Email & Mot de passe */}
                  {step === 2 && (
                      <>
                        <div className="form-group">
                          <label htmlFor="email">Email</label>
                          <input
                              name="email"
                              type="email"
                              placeholder="Adresse email"
                              value={user.email}
                              onChange={handleChange}
                              className="form-control"
                              required
                          />
                        </div>

                        <div className="form-group">
                          <label htmlFor="password">Mot de passe</label>
                          <input
                              name="password"
                              type="password"
                              placeholder="Mot de passe"
                              value={user.password}
                              onChange={handleChange}
                              className="form-control"
                              required
                          />
                        </div>

                        <div className="d-flex justify-content-between">
                          <button type="button" onClick={prevStep} className="vs-btn style3">
                            Précédent
                          </button>
                          <button type="button" onClick={nextStep} className="vs-btn style4">
                            Suivant
                          </button>
                        </div>
                      </>
                  )}

                  {/* Étape 3 : Pays & Ville */}
                  {step === 3 && (
                      <>
                        <div className="form-group">
                          <label htmlFor="country">
                            <FontAwesomeIcon icon={faGlobe} /> Pays
                          </label>
                          <select
                              name="country"
                              value={user.country}
                              onChange={handleCountryChange}
                              className="form-control"
                              required
                          >
                            <option value="">Sélectionner un pays</option>
                            {uniqueCountries.map((country) => (
                                <option key={country} value={country}>
                                  {country}
                                </option>
                            ))}
                          </select>
                        </div>

                        {user.country && (
                            <div className="form-group">
                              <label htmlFor="city">
                                <FontAwesomeIcon icon={faCity} /> Ville
                              </label>
                              <select
                                  name="city"
                                  value={user.city}
                                  onChange={handleCityChange}
                                  className="form-control"
                                  required
                              >
                                <option value="">Sélectionner une ville</option>
                                {topVisitedCities
                                    .filter((c) => c.country === user.country)
                                    .map((c) => (
                                        <option key={c.city} value={c.city}>
                                          {c.city}
                                        </option>
                                    ))}
                              </select>
                            </div>
                        )}

                        <div className="d-flex justify-content-between">
                          <button type="button" onClick={prevStep} className="vs-btn style3">
                            Précédent
                          </button>
                          <button type="button" onClick={nextStep} className="vs-btn style4">
                            Suivant
                          </button>
                        </div>
                      </>
                  )}

                  {/* Étape 4 : Récapitulatif et soumission */}
                  {step === 4 && (
                      <>
                        <h3 className="text-center">Résumé des informations</h3>
                        <ul className="list-group">

                          <li className="list-group-item"><b>UserName  :</b> {user.firstname}{ user.lastname}</li>

                          <li className="list-group-item"><strong>Prénom :</strong> {user.firstname}</li>
                          <li className="list-group-item"><strong>Nom :</strong> {user.lastname}</li>
                          <li className="list-group-item"><strong>Email :</strong> {user.email}</li>
                          <li className="list-group-item"><strong>Pays :</strong> {user.country}</li>
                          <li className="list-group-item"><strong>Ville :</strong> {user.city}</li>


                        </ul>

                        <div className="d-flex justify-content-between mt-3">
                        <button type="button" onClick={prevStep} className="vs-btn style3">
                            Précédent
                          </button>
                          <button type="submit" className="vs-btn style4">
                            S'inscrire
                          </button>
                        </div>
                      </>
                  )}
                </form>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </>
  );
}

export default Register;
