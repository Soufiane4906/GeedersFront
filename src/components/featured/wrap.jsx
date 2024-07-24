import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGlobe, faCity } from '@fortawesome/free-solid-svg-icons';
import "./Featured.scss";

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
  { name: "Rwanda", flag: "🇷🇼"},
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


function Featured() {
  const [country, setCountry] = useState("");
  const [cities, setCities] = useState([]);
  const [city, setCity] = useState("");
  const [showCity, setShowCity] = useState(false);

  const navigate = useNavigate();

  const handleCountryChange = async (e) => {
    const selectedCountry = e.target.value;
    setCountry(selectedCountry);
    setShowCity(true);
    setCity("");
    try {
      const response = await axios.post('https://countriesnow.space/api/v0.1/countries/cities', {
        country: selectedCountry
      });
      setCities(response.data.data);
    } catch (error) {
      console.error("There was an error fetching the cities!", error);
    }
  };

  const handleCityChange = (e) => {
    const selectedCity = e.target.value;
    setCity(selectedCity);
  };

  return (
    <div className="featured">
      <div className="container">
        <div className="left">
          <h1>
            Discover the perfect <span>guide</span> for your adventure
          </h1>
          <div className="row">
            <div className="col-md-4">
              <div className="select">
                <label>
                  <FontAwesomeIcon icon={faGlobe} /> Country:
                </label>
                <select onChange={handleCountryChange} style={{ width: '100%' }}>
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
                  <FontAwesomeIcon icon={faCity} /> City:
                </label>
                <select onChange={handleCityChange} style={{ width: '100%' }} disabled={!showCity}>
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
        </div>
        <div className="right">
          <img src="./img/man.png" alt="" />
        </div>
      </div>
    </div>
  );
}

export default Featured;
