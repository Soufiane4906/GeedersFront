import React, { useState } from 'react';
import { FaImage, FaUpload, FaTrash } from 'react-icons/fa';

const ImageUpload = ({
                         label,
                         name,
                         currentImage,
                         onChange,
                         description = "Upload an image",
                         acceptedFormats = "image/jpeg, image/png, image/jpg"
                     }) => {
    const [preview, setPreview] = useState(currentImage || null);
    const [loading, setLoading] = useState(false);

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Create a preview
        const reader = new FileReader();
        reader.onload = () => {
            setPreview(reader.result);
        };
        reader.readAsDataURL(file);

        // Call the parent onChange handler
        setLoading(true);
        try {
            await onChange(e);
        } catch (error) {
            console.error("Error uploading file:", error);
        } finally {
            setLoading(false);
        }
    };

    const clearImage = () => {
        setPreview(null);
        // Reset the file input
        const fileInput = document.getElementById(`file-${name}`);
        if (fileInput) fileInput.value = '';
    };

    return (
        <div className="image-upload-container">
            <label className="upload-label">
                {label}
                <p className="upload-description">{description}</p>
            </label>

            <div className={`upload-area ${preview ? 'has-image' : ''}`}>
                {loading ? (
                    <div className="loading-indicator">
                        <div className="spinner"></div>
                        <span>Uploading...</span>
                    </div>
                ) : preview ? (
                    <div className="image-preview">
                        <img src={preview} alt={`${name} preview`} />
                        <button type="button" className="remove-image" onClick={clearImage}>
                            <FaTrash /> Remove
                        </button>
                    </div>
                ) : (
                    <div className="upload-placeholder">
                        <FaImage className="upload-icon" />
                        <span className="upload-text">Click or drag to upload</span>
                        <span className="upload-formats">Supported formats: JPG, PNG</span>
                    </div>
                )}

                <input
                    type="file"
                    name={name}
                    id={`file-${name}`}
                    accept={acceptedFormats}
                    onChange={handleFileChange}
                    className="file-input"
                />

                {!preview && (
                    <label htmlFor={`file-${name}`} className="upload-button">
                        <FaUpload /> Select File
                    </label>
                )}
            </div>
        </div>
    );
};

export default ImageUpload;