import React, {useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./Register.scss";
import newRequest from "../../utils/newRequest";
import HeroProfile from "../../components/HeroProfile";
import Footer from "../../components/footer/Footer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCity, faGlobe, faUser, faLanguage } from "@fortawesome/free-solid-svg-icons";

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

const availableLanguages = [
  "English", "French", "Spanish", "Arabic", "Chinese", "Japanese",
  "German", "Italian", "Portuguese", "Russian", "Thai", "Turkish"
];


function Register() {
  const [step, setStep] = useState(1);
  const [user, setUser] = useState({
    username: "",
    email: "",
    firstName: "",
    lastName: "",
    password: "",
    country: "",
    city: "",
    userType: "guest",
    isAmbassador: false,
  });


  useEffect(() => {
    console.log(step);
    console.log((step === 4 && !user.isAmbassador));
  }, [step]); // Exécution uniquement lorsque `step` change


  const navigate = useNavigate();

  const handleChange = (e) => {
    setUser((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleUserTypeChange = (e) => {
    const selectedType = e.target.value;
    setUser((prev) => ({
      ...prev,
      userType: selectedType,
      isAmbassador: selectedType === "ambassador",
    }));
  };

  const handleLanguageChange = (e) => {
    const options = e.target.options;
    const selectedLanguages = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selectedLanguages.push(options[i].value);
      }
    }
    setUser((prev) => ({ ...prev, languages: selectedLanguages }));
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
        <div className="register mt-4 mb-4">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-6">
                <form onSubmit={handleSubmit} className="signup-form bg-smoke p-4 rounded">
                  <h1 className="form-title text-center mb-lg-35">Inscription</h1>

                  {/* Étape 1: Type de compte */}
                  {step === 1 && (
                      <>
                        <div className="form-group">
                          <label htmlFor="userType">
                            <FontAwesomeIcon icon={faUser} /> Type de compte
                          </label>
                          <select
                              name="userType"
                              value={user.userType}
                              onChange={handleUserTypeChange}
                              className="form-control"
                              required
                          >
                            <option value="guest">Guest</option>
                            <option value="ambassador">Ambassador</option>
                          </select>
                        </div>

                        <button type="button" onClick={nextStep} className="vs-btn style4 w-100">
                          Suivant
                        </button>
                      </>
                  )}

                  {/* Étape 2 : Infos personnelles */}
                  {step === 2 && (
                      <>
                        <div className="form-group">
                          <label htmlFor="firstName">Prénom</label>
                          <input
                              name="firstName"
                              type="text"
                              placeholder="Prénom"
                              value={user.firstName}
                              onChange={handleChange}
                              className="form-control"
                              required
                          />
                        </div>

                        <div className="form-group">
                          <label htmlFor="lastName">Nom</label>
                          <input
                              name="lastName"
                              type="text"
                              placeholder="Nom"
                              value={user.lastName}
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

                  {/* Étape 3 : Email & Mot de passe */}
                  {step === 3 && (
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

                  {/* Étape 4 : Pays & Ville */}
                  {step === 4 && user.isAmbassador    && (
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

                  {/* Étape 5: Informations supplémentaires pour les ambassadeurs */}
                  {step === 5 && user.isAmbassador && (
                      <>
                        <div className="form-group">
                          <label htmlFor="phone">Téléphone</label>
                          <input
                              name="phone"
                              type="tel"
                              placeholder="Numéro de téléphone"
                              value={user.phone}
                              onChange={handleChange}
                              className="form-control"
                              required
                          />
                        </div>

                        <div className="form-group">
                          <label htmlFor="age">Âge</label>
                          <input
                              name="age"
                              type="number"
                              placeholder="Votre âge"
                              value={user.age}
                              onChange={handleChange}
                              className="form-control"
                              required
                          />
                        </div>

                        <div className="form-group">
                          <label htmlFor="languages">
                            <FontAwesomeIcon icon={faLanguage} /> Langues parlées
                          </label>
                          <select
                              name="languages"
                              multiple
                              value={user.languages}
                              onChange={handleLanguageChange}
                              className="form-control"
                              required
                          >
                            {availableLanguages.map((language) => (
                                <option key={language} value={language}>
                                  {language}
                                </option>
                            ))}
                          </select>
                          <small className="form-text text-muted">
                            Maintenez Ctrl (ou Cmd sur Mac) pour sélectionner plusieurs langues
                          </small>
                        </div>

                        <div className="form-group">
                          <label htmlFor="desc">Description</label>
                          <textarea
                              name="desc"
                              placeholder="Parlez-nous de vous et de votre expérience en tant que guide local"
                              value={user.desc}
                              onChange={handleChange}
                              className="form-control"
                              rows="4"
                              required
                          ></textarea>
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

                  {/* Étape 4/6 : Récapitulatif et soumission */}
                  {((step === 4 && !user.isAmbassador) || step === 6) && (
                      <>
                        <h3 className="text-center">Résumé des informations</h3>
                        <ul className="list-group">
                          <li className="list-group-item"><b>Type de compte :</b> {
                            user.userType === "guest" ? "Guest" :
                                user.userType === "ambassador" ? "Ambassador" : "Administrateur"
                          }</li>
                          <li className="list-group-item"><strong>Prénom :</strong> {user.firstName}</li>
                          <li className="list-group-item"><strong>Nom :</strong> {user.lastName}</li>
                          <li className="list-group-item"><strong>Email :</strong> {user.email}</li>


                          {user.isAmbassador && (
                              <>
                                <li className="list-group-item"><strong>Pays :</strong> {user.country}</li>
                                <li className="list-group-item"><strong>Ville :</strong> {user.city}</li>
                                <li className="list-group-item"><strong>Téléphone :</strong> {user.phone}</li>
                                <li className="list-group-item"><strong>Âge :</strong> {user.age}</li>
                                {user.isAmbassador && user.languages && user.languages.length > 0 && (
                                    <li className="list-group-item">
                                      <strong>Langues parlées :</strong> {user.languages.join(", ")}
                                    </li>
                                )}
                                <li className="list-group-item"><strong>Description :</strong> {user.desc}</li>
                              </>
                          )}
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

      </>
  );
}

export default Register;