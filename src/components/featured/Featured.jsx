import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGlobe,
  faCity,
  faLanguage,
  faCar,
  faMotorcycle,
  faChevronDown,
  faCog,
} from "@fortawesome/free-solid-svg-icons";
import "./Featured.scss";
import { FaChevronDown, FaChevronUp, FaSearchPlus } from "react-icons/fa";
import { faChevronUp } from "@fortawesome/free-solid-svg-icons/faChevronUp";
import { FaRoadCircleCheck } from "react-icons/fa6";
import { faRoad } from "@fortawesome/free-solid-svg-icons/faRoad";
import { faMapMarkedAlt } from "@fortawesome/free-solid-svg-icons/faMapMarkedAlt";
import { faMapPin } from "@fortawesome/free-solid-svg-icons/faMapPin";


function Featured() {
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [showCity, setShowCity] = useState(false);
  const [cities, setCities] = useState([]);
  const [showVehicleOptions, setShowVehicleOptions] = useState(false);
  const [selectedVehicles, setSelectedVehicles] = useState([]);
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const navigate = useNavigate();
  const [showPointsOfInterest, setShowPointsOfInterest] = useState(false);
  const [selectedPointsOfInterest, setSelectedPointsOfInterest] = useState([]);
  const [backgroundImage, setBackgroundImage] = useState(
    "https://st2.depositphotos.com/3725083/5485/i/950/depositphotos_54856347-stock-photo-travel-the-world-monument-concept.jpg"
  );

  const handleCountryChange = async (e) => {
    const selectedCountry = e.target.value;
    setCountry(selectedCountry);
    setShowCity(true);
    setCity("");
    try {
      const response = await axios.post(
        "https://countriesnow.space/api/v0.1/countries/cities",
        {
          country: selectedCountry,
        }
      );
      setCities(response.data.data);
    } catch (error) {
      console.error("There was an error fetching the cities!", error);
    }
  };
  const handleMoreDetailsClick = () => {
    setShowPointsOfInterest((prev) => !prev);
    setBackgroundImage((prev) =>
      prev ===
      "https://st2.depositphotos.com/3725083/5485/i/950/depositphotos_54856347-stock-photo-travel-the-world-monument-concept.jpg"
        ? "https://thumbs.dreamstime.com/b/photo-collage-made-diverse-world-travel-destinations-wooden-surface-photos-127092750.jpg" // Replace with the new image URL
        : "https://st2.depositphotos.com/3725083/5485/i/950/depositphotos_54856347-stock-photo-travel-the-world-monument-concept.jpg"
    );
  };

  const handleCityChange = (e) => {
    const selectedCity = e.target.value;
    setCity(selectedCity);
  };

  const handleLanguageChange = (selectedOptions) => {
    setSelectedLanguages(selectedOptions.map((option) => option.value));
  };

  const handleVehicleChange = (e) => {
    const { value, checked } = e.target;
    setSelectedVehicles((prevVehicles) =>
      checked
        ? [...prevVehicles, value]
        : prevVehicles.filter((vehicle) => vehicle !== value)
    );
  };

  const handleVehicleMenuChange = (e) => {
    setShowVehicleOptions(e.target.value === "yes");
  };

  const handleSubmit = () => {
    if (!country) {
      alert("Please select both country and city.");
      return;
    }

    // Create a query string for vehicles if selected
    const vehicleParam =
      selectedVehicles.length > 0
        ? `vehicles=${selectedVehicles.join(",")}`
        : "";

    // Build the query string for the URL
    const queryParams = new URLSearchParams({
      country,
      city,
      languages: selectedLanguages.join(","),
      // ...(vehicleParam && { vehicles: vehicleParam }) // Include the vehicles parameter only if it's not empty
    });

    // Navigate to the new URL
    navigate(`/gigs?${queryParams.toString()}`);
  };
  const [isSwapped, setIsSwapped] = useState(false);

  return (
    <div className={`featured ${isSwapped ? 'swapped' : ''}`}>
    <div className="container">
      <div className={`left ${isSwapped ? 'hidden' : ''}`}>
        <h1>
          Discover the perfect <span>guide</span> for your adventure
        </h1>
        <div className="row">
          <div className="col-md-4">
            <div className="select">
              <label>
                <FontAwesomeIcon style={{marginRight:'4px'}} icon={faGlobe} /> Country:
              </label>
              <select
                required
                onChange={handleCountryChange}
                style={{ width: '100%' }}
              >
                <option value="">Select Country</option>
                {countriesData.map((country) => (
                  <option key={country.name} value={country.name}>
                    {country.flag} {country.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="col-md-4">
            <div className="select">
              <label>
                <FontAwesomeIcon style={{marginRight:'4px'}} icon={faCity} /> City:
              </label>
              <select
                required
                onChange={handleCityChange}
                style={{ width: '100%' }}
                disabled={!showCity}
              >
                <option value="">Select City</option>
                {cities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>
          </div>

        </div>
        <div className="row">
        <div className="col-md-9">
            <div className="select">
              <label>
                <FontAwesomeIcon style={{marginRight:'4px'}} icon={faLanguage} /> Languages:
              </label>
              <Select
                name="languages"
                options={languageOptions}
                isMulti
                value={languageOptions.filter((option) =>
                  selectedLanguages.includes(option.value)
                )}
                onChange={handleLanguageChange}
                styles={{ container: (base) => ({ ...base, width: '100%' }) }}
              />
            </div>
          </div>
          <div className="col-md-8">
            <div className="additional-fields">
              <p>
                <FontAwesomeIcon icon={faRoad} style={{ marginRight: '5px' }} />
                With Car Options?
              </p>
              <div>
              <label>
                    <input
                      type="radio"
                      name="vehicleMenu"
                      value="yes"
                      onChange={handleVehicleMenuChange}
                      checked={showVehicleOptions === true}
                    />
                    Yes
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="vehicleMenu"
                      value="no"
                      onChange={handleVehicleMenuChange}
                      checked={showVehicleOptions === false}
                    />
                    No
                  </label>
              </div>
              {showVehicleOptions && (
                <div>
                  <label
                    className={`checkbox-container ${selectedVehicles.includes('scooter') ? 'active' : ''}`}
                  >
                    <input
                      type="checkbox"
                      value="scooter"
                      checked={selectedVehicles.includes('scooter')}
                      onChange={handleVehicleChange}
                    />
                    <FontAwesomeIcon icon={faMotorcycle} /> Scooter
                  </label>
                  <label
                    className={`checkbox-container ${selectedVehicles.includes('car') ? 'active' : ''}`}
                  >
                    <input
                      type="checkbox"
                      value="car"
                      checked={selectedVehicles.includes('car')}
                      onChange={handleVehicleChange}
                    />
                    <FontAwesomeIcon icon={faCar} /> Car
                  </label>
                </div>
              )}
            </div>
          </div>
        </div>
        <button
        className="showpoi"
        style={{background :'#ffc107' , marginRight: '4%'} }
        onClick={() => {

          handleMoreDetailsClick();
          setIsSwapped(!isSwapped);
        }}>
          {showPointsOfInterest ? (
            <>
              <FontAwesomeIcon icon={faChevronUp} />
              Show Less
            </>
          ) : (
            <>
              <FontAwesomeIcon icon={faChevronDown} />
              Would you like a guide with specific places or volunteers?
            </>
          )}
        </button>

        {showPointsOfInterest && (
          <div className="points-of-interest">
            <p className="p-poi">
              <FontAwesomeIcon icon={faMapPin} /> Select Points of Interest
            </p>
            <div className="poi-options">
              {pointsOfInterestOptions.map((poi) => (
                <label
                  key={poi.name}
                  className={`poi-container ${selectedPointsOfInterest.includes(poi.name) ? 'active' : ''}`}
                >
                  <input
                    type="checkbox"
                    value={poi.name}
                    checked={selectedPointsOfInterest.includes(poi.name)}
                    onChange={(e) => {
                      const { value, checked } = e.target;
                      setSelectedPointsOfInterest((prev) =>
                        checked
                          ? [...prev, value]
                          : prev.filter((poi) => poi !== value)
                      );
                    }}
                  />
                  <img
                    src={poi.icon}
                    alt={poi.name}
                    style={{ width: 30, height: 30, marginRight: 10 }}
                  />
                  {poi.name}
                </label>
              ))}
            </div>
          </div>
        )}
        <button onClick={handleSubmit}>Search <FaSearchPlus></FaSearchPlus></button>
      </div>
      <div className={`right ${isSwapped ? 'visible' : ''}`}
           style={{ backgroundImage: `url(${backgroundImage})` }}>
        <img src="./img/man.png" alt="" />
      </div>
    </div>
  </div>
);
};

export default Featured;
const languageOptions = [
  { value: "English", label: "🇬🇧 English" },
  { value: "French", label: "🇫🇷 French" },
  { value: "German", label: "🇩🇪 German" },
  { value: "Italian", label: "🇮🇹 Italian" },
  { value: "Spanish", label: "🇪🇸 Spanish" },
  { value: "Chinese", label: "🇨🇳 Chinese" },
  { value: "Japanese", label: "🇯🇵 Japanese" },
  { value: "Korean", label: "🇰🇷 Korean" },
  { value: "Arabic", label: "🇦🇪 Arabic" },
  { value: "Russian", label: "🇷🇺 Russian" },
  { value: "Portuguese", label: "🇵🇹 Portuguese" },
  { value: "Dutch", label: "🇳🇱 Dutch" },
  { value: "Greek", label: "🇬🇷 Greek" },
  { value: "Hindi", label: "🇮🇳 Hindi" },
  { value: "Urdu", label: "🇵🇰 Urdu" },
  { value: "Turkish", label: "🇹🇷 Turkish" },
  { value: "Swedish", label: "🇸🇪 Swedish" },
  { value: "Norwegian", label: "🇳🇴 Norwegian" },
  { value: "Danish", label: "🇩🇰 Danish" },
  { value: "Finnish", label: "🇫🇮 Finnish" },
  { value: "Polish", label: "🇵🇱 Polish" },
  { value: "Czech", label: "🇨🇿 Czech" },
  { value: "Slovak", label: "🇸🇰 Slovak" },
  { value: "Hungarian", label: "🇭🇺 Hungarian" },
  { value: "Romanian", label: "🇷🇴 Romanian" },
  { value: "Bulgarian", label: "🇧🇬 Bulgarian" },
  { value: "Serbian", label: "🇷🇸 Serbian" },
  { value: "Croatian", label: "🇭🇷 Croatian" },
  { value: "Slovenian", label: "🇸🇮 Slovenian" },
  { value: "Albanian", label: "🇦🇱 Albanian" },
  { value: "Macedonian", label: "🇲🇰 Macedonian" },
  { value: "Bosnian", label: "🇧🇦 Bosnian" },
  { value: "Montenegrin", label: "🇲🇪 Montenegrin" },
  { value: "Kosovar", label: "🇽🇰 Kosovar" },
  { value: "Georgian", label: "🇬🇪 Georgian" },
  { value: "Armenian", label: "🇦🇲 Armenian" },
  { value: "Azerbaijani", label: "🇦🇿 Azerbaijani" },
  { value: "Kazakh", label: "🇰🇿 Kazakh" },
  { value: "Uzbek", label: "🇺🇿 Uzbek" },
  { value: "Turkmen", label: "🇹🇲 Turkmen" },
  { value: "Kyrgyz", label: "🇰🇬 Kyrgyz" },
  { value: "Tajik", label: "🇹🇯 Tajik" },
  { value: "Afghan", label: "🇦🇫 Afghan" },
  { value: "Pakistani", label: "🇵🇰 Pakistani" },
  { value: "Indian", label: "🇮🇳 Indian" },
  { value: "Bangladeshi", label: "🇧🇩 Bangladeshi" },
  { value: "Nepali", label: "🇳🇵 Nepali" },
  { value: "Bhutanese", label: "🇧🇹 Bhutanese" },
  { value: "Sri Lankan", label: "🇱🇰 Sri Lankan" },
  { value: "Maldivian", label: "🇲🇻 Maldivian" },
  { value: "American", label: "🇺🇸 American" },
  { value: "Canadian", label: "🇨🇦 Canadian" },
  { value: "Mexican", label: "🇲🇽 Mexican" },
  { value: "Brazilian", label: "🇧🇷 Brazilian" },
  { value: "Argentinian", label: "🇦🇷 Argentinian" },
  { value: "Chilean", label: "🇨🇱 Chilean" },
  { value: "Peruvian", label: "🇵🇪 Peruvian" },
  { value: "Colombian", label: "🇨🇴 Colombian" },
  { value: "Venezuelan", label: "🇻🇪 Venezuelan" },
  { value: "Ecuadorian", label: "🇪🇨 Ecuadorian" },
  //more

  // Add more languages as needed
];
const pointsOfInterestOptions = [
  { name: "Museum", icon: "https://img.icons8.com/ios/50/000000/museum.png" },
  { name: "Beach", icon: "https://img.icons8.com/ios/50/000000/beach.png" },
  {
    name: "Night Club",
    icon: "https://img.icons8.com/?size=100&id=60357&format=png&color=000000",
  },
  {
    name: "Park",
    icon: "https://img.icons8.com/?size=100&id=7XFQqoCVoosj&format=png&color=000000",
  },
  {
    name: "Shopping Mall",
    icon: "https://img.icons8.com/ios/50/000000/shopping-mall.png",
  },
  {
    name: "Theatre",
    icon: "https://img.icons8.com/?size=100&id=zbPYzShUWkkU&format=png&color=000000",
  },
  {
    name: "Amusement Park",
    icon: "https://img.icons8.com/?size=100&id=25053&format=png&color=000000",
  },
  {
    name: "Restaurant",
    icon: "https://img.icons8.com/ios/50/000000/restaurant.png",
  },
  {
    name: "Hiking",
    icon: "https://img.icons8.com/?size=100&id=9844&format=png&color=000000",
  },
];
const countriesData = [
  { name: "France", flag: "🇫🇷" },
  { name: "Germany", flag: "🇩🇪" },
  { name: "Italy", flag: "🇮🇹" },
  { name: "Spain", flag: "🇪🇸" },
  { name: "China", flag: "🇨🇳" },
  { name: "Japan", flag: "🇯🇵" },
  { name: "Korea", flag: "🇰🇷" },
  { name: "Arab Emirates", flag: "🇦🇪" },
  { name: "Russia", flag: "🇷🇺" },
  { name: "Portugal", flag: "🇵🇹" },
  { name: "Netherlands", flag: "🇳🇱" },
  { name: "Greece", flag: "🇬🇷" },
  { name: "India", flag: "🇮🇳" },
  { name: "Pakistan", flag: "🇵🇰" },
  { name: "Turkey", flag: "🇹🇷" },
  { name: "Sweden", flag: "🇸🇪" },
  { name: "Norway", flag: "🇳🇴" },
  { name: "Denmark", flag: "🇩🇰" },
  { name: "Finland", flag: "🇫🇮" },
  { name: "Switzerland", flag: "🇨🇭" },
  { name: "Austria", flag: "🇦🇹" },
  { name: "Belgium", flag: "🇧🇪" },
  { name: "Poland", flag: "🇵🇱" },
  { name: "Czech Republic", flag: "🇨🇿" },
  { name: "Hungary", flag: "🇭🇺" },
  { name: "Romania", flag: "🇷🇴" },
  { name: "Bulgaria", flag: "🇧🇬" },
  { name: "Croatia", flag: "🇭🇷" },
  { name: "Serbia", flag: "🇷🇸" },
  { name: "Bosnia and Herzegovina", flag: "🇧🇦" },
  //go
  { name: "United States", flag: "🇺🇸" },
  { name: "Canada", flag: "🇨🇦" },
  { name: "Mexico", flag: "🇲🇽" },
  { name: "Brazil", flag: "🇧🇷" },
  { name: "Argentina", flag: "🇦🇷" },
  { name: "Chile", flag: "🇨🇱" },
  { name: "Colombia", flag: "🇨🇴" },
  { name: "Peru", flag: "🇵🇪" },
  { name: "Venezuela", flag: "🇻🇪" },
  { name: "Ecuador", flag: "🇪🇨" },
  { name: "Uruguay", flag: "🇺🇾" },
  { name: "Paraguay", flag: "🇵🇾" },
  { name: "Bolivia", flag: "🇧🇴" },
  { name: "Australia", flag: "🇦🇺" },
  { name: "New Zealand", flag: "🇳🇿" },
  { name: "Fiji", flag: "🇫🇯" },
  { name: "Papua New Guinea", flag: "🇵🇬" },
  { name: "Solomon Islands", flag: "🇸🇧" },
  { name: "Vanuatu", flag: "🇻🇺" },
  { name: "Samoa", flag: "🇼🇸" },
  { name: "Tonga", flag: "🇹🇴" },
  { name: "Kiribati", flag: "🇰🇮" },
  { name: "Tuvalu", flag: "🇹🇻" },
  { name: "Nauru", flag: "🇳🇷" },
  { name: "Marshall Islands", flag: "🇲🇭" },
  { name: "Micronesia", flag: "🇫🇲" },
  { name: "Palau", flag: "🇵🇼" },
  { name: "Singapore", flag: "🇸🇬" },
  { name: "Malaysia", flag: "🇲🇾" },
  { name: "Indonesia", flag: "🇮🇩" },
  { name: "Philippines", flag: "🇵🇭" },
  { name: "Thailand", flag: "🇹🇭" },
  { name: "Vietnam", flag: "🇻🇳" },
  { name: "Cambodia", flag: "🇰🇭" },
  { name: "Laos", flag: "🇱🇦" },
  { name: "Myanmar", flag: "🇲🇲" },
  { name: "Bangladesh", flag: "🇧🇩" },
  { name: "Nepal", flag: "🇳🇵" },
  { name: "Sri Lanka", flag: "🇱🇰" },
  { name: "Afghanistan", flag: "🇦🇫" },
  { name: "Iran", flag: "🇮🇷" },
  { name: "Iraq", flag: "🇮🇶" },
  { name: "Syria", flag: "🇸🇾" },
  { name: "Lebanon", flag: "🇱🇧" },
  //allez
  { name: "South Africa", flag: "🇿🇦" },
  { name: "Nigeria", flag: "🇳🇬" },
  { name: "Egypt", flag: "🇪🇬" },
  { name: "Algeria", flag: "🇩🇿" },
  { name: "Morocco", flag: "🇲🇦" },
  { name: "Tunisia", flag: "🇹🇳" },
  { name: "Libya", flag: "🇱🇾" },
  { name: "Sudan", flag: "🇸🇩" },
  { name: "Ethiopia", flag: "🇪🇹" },
  { name: "Kenya", flag: "🇰🇪" },
  { name: "Uganda", flag: "🇺🇬" },
  { name: "Ghana", flag: "🇬🇭" },
  { name: "Cameroon", flag: "🇨🇲" },
  { name: "Ivory Coast", flag: "🇨🇮" },
  { name: "Senegal", flag: "🇸🇳" },
  { name: "Mali", flag: "🇲🇱" },
  { name: "Niger", flag: "🇳🇪" },
  { name: "Chad", flag: "🇹🇩" },
  { name: "Mauritania", flag: "🇲🇷" },
  { name: "Mozambique", flag: "🇲🇿" },
  { name: "Madagascar", flag: "🇲🇬" },
  { name: "Zimbabwe", flag: "🇿🇼" },
  { name: "Zambia", flag: "🇿🇲" },
  { name: "Angola", flag: "🇦🇴" },
  { name: "Namibia", flag: "🇳🇦" },
  { name: "Botswana", flag: "🇧🇼" },
  { name: "Mauritius", flag: "🇲🇺" },
  { name: "Malawi", flag: "🇲🇼" },
  { name: "Lesotho", flag: "🇱🇸" },
  { name: "Swaziland", flag: "🇸🇿" },
  { name: "Burundi", flag: "🇧🇮" },
  { name: "Rwanda", flag: "🇷🇼" },
  //come on for the last time
  { name: "Antarctica", flag: "🇦🇶" },
  { name: "Greenland", flag: "🇬🇱" },
  { name: "Faroe Islands", flag: "🇫🇴" },
  { name: "Iceland", flag: "🇮🇸" },
  { name: "Svalbard and Jan Mayen", flag: "🇸🇯" },
  { name: "United Kingdom", flag: "🇬🇧" },
  { name: "Ireland", flag: "🇮🇪" },
  //you understand me ?
];
countriesData.sort((a, b) => a.name.localeCompare(b.name));
