import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapMarkerAlt, faChevronDown } from "@fortawesome/free-solid-svg-icons";
import newRequest from "../../utils/newRequest";
import { toast } from 'react-toastify';

const PointsOfInterestSection = ({ selectedPOIs, setSelectedPOIs, city, disabled = false }) => {
    const [showPOIDropdown, setShowPOIDropdown] = useState(false);
    const [pointsOfInterestOptions, setPointsOfInterestOptions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch POIs from backend
    const fetchPOIs = async () => {
        setIsLoading(true);
        try {
            const response = await newRequest.get("/pois");
            const fetchedPOIs = response.data.pois.map(poi => ({
                id: poi._id,
                name: poi.name,
                icon: poi.image
            }));
            setPointsOfInterestOptions(fetchedPOIs);
            setIsLoading(false);
        } catch (err) {
            setError(err.message || 'Failed to fetch Points of Interest');
            setIsLoading(false);
            toast.error('Failed to load Points of Interest');
        }
    };

    // Fetch POIs on component mount
    useEffect(() => {
        fetchPOIs();
    }, []);

    // Toggle POI selection
    const togglePOI = (poiId) => {
        setSelectedPOIs(prevSelected => {
            if (prevSelected.includes(poiId)) {
                return prevSelected.filter(id => id !== poiId);
            } else {
                return [...prevSelected, poiId];
            }
        });
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (!e.target.closest('.poi-dropdown-container')) {
                setShowPOIDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Loading and error states
    if (isLoading) return (
        <div className="form-group">
            <label>Points of Interest</label>
            <div>Loading Points of Interest...</div>
        </div>
    );

    if (error) return (
        <div className="form-group">
            <label>Points of Interest</label>
            <div className="text-danger">{error}</div>
        </div>
    );

    return (
        <div className="form-group poi-dropdown-container">
            <label>
                <FontAwesomeIcon icon={faMapMarkerAlt} className="me-2" />
                Points of Interest
            </label>
            <div className="position-relative">
                <button
                    type="button"
                    className="form-control text-start d-flex justify-content-between align-items-center"
                    onClick={() => setShowPOIDropdown(!showPOIDropdown)}
                    disabled={disabled}
                >
                    <span>
                        {selectedPOIs.length === 0
                            ? "Select points of interest"
                            : `${selectedPOIs.length} POI(s) selected`}
                    </span>
                    <FontAwesomeIcon icon={faChevronDown} className="dropdown-toggle" />
                </button>

                {showPOIDropdown && (
                    <div className="position-absolute top-100 start-0 w-100 bg-white border rounded z-3 mt-1 py-2 shadow poi-options-container">
                        {pointsOfInterestOptions.map((poi) => (
                            <div
                                key={poi.id}
                                className="d-flex align-items-center px-3 py-2 poi-option"
                                onClick={() => togglePOI(poi.id)}
                            >
                                <div className="form-check mb-0 d-flex align-items-center">
                                    <input
                                        type="checkbox"
                                        className="form-check-input"
                                        checked={selectedPOIs.includes(poi.id)}
                                        onChange={() => {}}
                                        id={`poi-${poi.id}`}
                                    />
                                    <div className="poi-icon-container mx-2">
                                        <img src={poi.icon} alt={poi.name} width="24" height="24" />
                                    </div>
                                    <label className="form-check-label" htmlFor={`poi-${poi.id}`}>
                                        {poi.name}
                                    </label>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Display selected POIs */}
            {selectedPOIs.length > 0 && (
                <div className="mt-2 d-flex flex-wrap">
                    {selectedPOIs.map(poiId => {
                        const poi = pointsOfInterestOptions.find(p => p.id === poiId);
                        return poi ? (
                            <span
                                key={poiId}
                                className="badge bg-info me-1 mb-1 d-flex align-items-center poi-badge"
                            >
                                <img src={poi.icon} alt={poi.name} width="16" height="16" className="me-1" />
                                {poi.name}
                                <button
                                    type="button"
                                    className="btn-close btn-close-white ms-2"
                                    onClick={() => togglePOI(poiId)}
                                ></button>
                            </span>
                        ) : null;
                    })}
                </div>
            )}
        </div>
    );
};

export default PointsOfInterestSection;