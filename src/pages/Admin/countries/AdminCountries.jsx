import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import newRequest from "../../../utils/newRequest";
import "./AdminCountries.scss";

const AdminCountries = () => {
    const [countries, setCountries] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState(null);
    const [cities, setCities] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // Form states
    const [countryName, setCountryName] = useState("");
    const [cityName, setCityName] = useState("");
    const [touristPlaceName, setTouristPlaceName] = useState("");
    const [touristPlaceDesc, setTouristPlaceDesc] = useState("");
    const [selectedCity, setSelectedCity] = useState(null);

    // Edit states
    const [editMode, setEditMode] = useState({
        city: false,
        touristPlace: false
    });
    const [editingCityId, setEditingCityId] = useState(null);
    const [editingTouristPlaceId, setEditingTouristPlaceId] = useState(null);

    const navigate = useNavigate();

    // Fetch all countries
    const fetchCountries = async () => {
        setIsLoading(true);
        try {
            const response = await newRequest.get("/countries");
            setCountries(response.data);
        } catch (err) {
            setError(err.response?.data || "Something went wrong");
        } finally {
            setIsLoading(false);
        }
    };

    // Fetch cities for a specific country
    const fetchCities = async (countryId) => {
        if (!countryId) return;

        setIsLoading(true);
        try {
            const response = await newRequest.get(`/cities?countryId=${countryId}`);
            setCities(response.data);
        } catch (err) {
            setError(err.response?.data || "Could not fetch cities");
        } finally {
            setIsLoading(false);
        }
    };

    // Create new country
    const handleCreateCountry = async (e) => {
        e.preventDefault();
        if (!countryName) return;

        setIsLoading(true);
        try {
            const response = await newRequest.post("/countries", { name: countryName });
            setCountries([...countries, response.data]);
            setCountryName("");
        } catch (err) {
            setError(err.response?.data || "Failed to create country");
        } finally {
            setIsLoading(false);
        }
    };

    // Create or update city
    const handleSubmitCity = async (e) => {
        e.preventDefault();
        if (!cityName || !selectedCountry) return;

        setIsLoading(true);
        try {
            if (editMode.city && editingCityId) {
                // Update existing city
                const response = await newRequest.put(
                    `/cities/${selectedCountry._id}/${editingCityId}`,
                    { name: cityName }
                );
                setCities(cities.map(city =>
                    city._id === editingCityId ? response.data : city
                ));
                setEditMode({...editMode, city: false});
                setEditingCityId(null);
            } else {
                // Create new city
                const response = await newRequest.post(
                    `/cities/${selectedCountry._id}`,
                    { name: cityName }
                );
                setCities([...cities, response.data]);
            }
            setCityName("");
        } catch (err) {
            setError(err.response?.data || "Failed to save city");
        } finally {
            setIsLoading(false);
        }
    };

    // Start editing a city
    const handleEditCity = (city) => {
        setCityName(city.name);
        setEditMode({...editMode, city: true});
        setEditingCityId(city._id);
    };

    // Cancel editing
    const handleCancelEdit = (type) => {
        if (type === 'city') {
            setEditMode({...editMode, city: false});
            setEditingCityId(null);
            setCityName("");
        } else if (type === 'touristPlace') {
            setEditMode({...editMode, touristPlace: false});
            setEditingTouristPlaceId(null);
            setTouristPlaceName("");
            setTouristPlaceDesc("");
        }
    };

    // Add or update tourist place
    const handleSubmitTouristPlace = async (e) => {
        e.preventDefault();
        if (!touristPlaceName || !selectedCountry || !selectedCity) return;

        setIsLoading(true);
        try {
            if (editMode.touristPlace && editingTouristPlaceId) {
                // Update existing tourist place
                await newRequest.put(
                    `/countries/${selectedCountry._id}/${selectedCity._id}/tourist-places/${editingTouristPlaceId}`,
                    {
                        name: touristPlaceName,
                        description: touristPlaceDesc
                    }
                );
                setEditMode({...editMode, touristPlace: false});
                setEditingTouristPlaceId(null);
            } else {
                // Add new tourist place
                await newRequest.post(
                    `/countries/${selectedCountry._id}/${selectedCity._id}/tourist-places`,
                    {
                        name: touristPlaceName,
                        description: touristPlaceDesc
                    }
                );
            }

            // Refresh cities to see the updated tourist places
            fetchCities(selectedCountry._id);
            setTouristPlaceName("");
            setTouristPlaceDesc("");
        } catch (err) {
            setError(err.response?.data || "Failed to save tourist place");
        } finally {
            setIsLoading(false);
        }
    };

    // Start editing a tourist place
    const handleEditTouristPlace = (place) => {
        setTouristPlaceName(place.name);
        setTouristPlaceDesc(place.description || "");
        setEditMode({...editMode, touristPlace: true});
        setEditingTouristPlaceId(place._id);
    };

    // Delete tourist place
    const handleDeleteTouristPlace = async (placeId) => {
        if (!window.confirm("Are you sure you want to delete this tourist place?")) return;

        setIsLoading(true);
        try {
            await newRequest.delete(
                `/countries/${selectedCountry._id}/${selectedCity._id}/tourist-places/${placeId}`
            );
            // Refresh cities to see the updated tourist places
            fetchCities(selectedCountry._id);
        } catch (err) {
            setError(err.response?.data || "Failed to delete tourist place");
        } finally {
            setIsLoading(false);
        }
    };

    // Delete country
    const handleDeleteCountry = async (countryId) => {
        if (!window.confirm("Are you sure you want to delete this country?")) return;

        setIsLoading(true);
        try {
            await newRequest.delete(`/countries/${countryId}`);
            setCountries(countries.filter(country => country._id !== countryId));
            if (selectedCountry && selectedCountry._id === countryId) {
                setSelectedCountry(null);
                setCities([]);
            }
        } catch (err) {
            setError(err.response?.data || "Failed to delete country");
        } finally {
            setIsLoading(false);
        }
    };

    // Delete city
    const handleDeleteCity = async (countryId, cityId) => {
        if (!window.confirm("Are you sure you want to delete this city?")) return;

        setIsLoading(true);
        try {
            await newRequest.delete(`/cities/${countryId}/${cityId}`);
            setCities(cities.filter(city => city._id !== cityId));
            if (selectedCity && selectedCity._id === cityId) {
                setSelectedCity(null);
            }
        } catch (err) {
            setError(err.response?.data || "Failed to delete city");
        } finally {
            setIsLoading(false);
        }
    };

    // Handle country selection
    const handleCountrySelect = (country) => {
        setSelectedCountry(country);
        fetchCities(country._id);
        setSelectedCity(null);
        resetFormStates();
    };

    // Handle city selection
    const handleCitySelect = (city) => {
        setSelectedCity(city);
        resetFormStates();
    };

    // Reset form states
    const resetFormStates = () => {
        setCityName("");
        setTouristPlaceName("");
        setTouristPlaceDesc("");
        setEditMode({city: false, touristPlace: false});
        setEditingCityId(null);
        setEditingTouristPlaceId(null);
    };

    // View gigs by country
    const viewGigsByCountry = (countryName) => {
        navigate(`/gigs?country=${countryName}`);
    };

    // View ambassadors by country
    const viewAmbassadorsByCountry = (countryName) => {
        navigate(`/ambassadors?country=${countryName}`);
    };

    useEffect(() => {
        fetchCountries();
    }, []);

    return (
        <div className="admin-countries">
            <h1>Manage Countries, Cities, and Tourist Places</h1>

            {error && <div className="error">{error}</div>}
            {isLoading && <div className="loading">Loading...</div>}

            <div className="content-wrapper">
                {/* Countries Section */}
                <div className="countries-section">
                    <h2>Countries</h2>

                    <form onSubmit={handleCreateCountry} className="form-container">
                        <input
                            type="text"
                            placeholder="Country Name"
                            value={countryName}
                            onChange={(e) => setCountryName(e.target.value)}
                        />
                        <button type="submit" disabled={isLoading}>
                            Add Country
                        </button>
                    </form>

                    <div className="countries-list">
                        {countries.map(country => (
                            <div
                                key={country._id}
                                className={`country-item ${selectedCountry?._id === country._id ? 'active' : ''}`}
                            >
                                <div className="country-info" onClick={() => handleCountrySelect(country)}>
                                    <span>{country.name}</span>
                                </div>
                                <div className="country-actions">
                                    <button onClick={() => viewGigsByCountry(country.name)}>View Gigs</button>
                                    <button onClick={() => viewAmbassadorsByCountry(country.name)}>View Ambassadors</button>
                                    <button
                                        className="delete-btn"
                                        onClick={() => handleDeleteCountry(country._id)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Cities Section */}
                {selectedCountry && (
                    <div className="cities-section">
                        <h2>Cities in {selectedCountry.name}</h2>

                        <form onSubmit={handleSubmitCity} className="form-container">
                            <input
                                type="text"
                                placeholder="City Name"
                                value={cityName}
                                onChange={(e) => setCityName(e.target.value)}
                            />
                            <div className="form-buttons">
                                <button type="submit" disabled={isLoading}>
                                    {editMode.city ? 'Update City' : 'Add City'}
                                </button>
                                {editMode.city && (
                                    <button
                                        type="button"
                                        onClick={() => handleCancelEdit('city')}
                                        className="cancel-btn"
                                    >
                                        Cancel
                                    </button>
                                )}
                            </div>
                        </form>

                        <div className="cities-list">
                            {cities.map(city => (
                                <div
                                    key={city._id}
                                    className={`city-item ${selectedCity?._id === city._id ? 'active' : ''}`}
                                >
                                    <div className="city-info" onClick={() => handleCitySelect(city)}>
                                        <span>{city.name}</span>
                                        <span className="tourist-places-count">
                                            {city.touristPlaces?.length || 0} tourist places
                                        </span>
                                    </div>
                                    <div className="city-actions">
                                        <button
                                            className="edit-btn"
                                            onClick={() => handleEditCity(city)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="delete-btn"
                                            onClick={() => handleDeleteCity(selectedCountry._id, city._id)}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Tourist Places Section */}
                {selectedCity && (
                    <div className="tourist-places-section">
                        <h2>Tourist Places in {selectedCity.name}</h2>

                        <form onSubmit={handleSubmitTouristPlace} className="form-container">
                            <input
                                type="text"
                                placeholder="Tourist Place Name"
                                value={touristPlaceName}
                                onChange={(e) => setTouristPlaceName(e.target.value)}
                            />
                            <textarea
                                placeholder="Description"
                                value={touristPlaceDesc}
                                onChange={(e) => setTouristPlaceDesc(e.target.value)}
                            />
                            <div className="form-buttons">
                                <button type="submit" disabled={isLoading}>
                                    {editMode.touristPlace ? 'Update Tourist Place' : 'Add Tourist Place'}
                                </button>
                                {editMode.touristPlace && (
                                    <button
                                        type="button"
                                        onClick={() => handleCancelEdit('touristPlace')}
                                        className="cancel-btn"
                                    >
                                        Cancel
                                    </button>
                                )}
                            </div>
                        </form>

                        <div className="tourist-places-list">
                            {selectedCity.touristPlaces?.map((place, index) => (
                                <div key={place._id || index} className="tourist-place-item">
                                    <div className="tourist-place-header">
                                        <h3>{place.name}</h3>
                                        <div className="tourist-place-actions">
                                            <button
                                                className="edit-btn"
                                                onClick={() => handleEditTouristPlace(place)}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className="delete-btn"
                                                onClick={() => handleDeleteTouristPlace(place._id)}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                    {place.description && <p>{place.description}</p>}
                                </div>
                            ))}
                            {selectedCity.touristPlaces?.length === 0 && (
                                <div className="empty-message">
                                    No tourist places yet. Add one using the form above.
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminCountries;