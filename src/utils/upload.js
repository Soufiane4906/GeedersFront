// src/utils/upload.js
import axios from "axios";

const upload = async (file) => {
  const data = new FormData();
  data.append("file", file);
  data.append("upload_preset", "guiders"); // Ensure this is your correct upload preset

  try {
    const res = await axios.post(
      "https://api.cloudinary.com/v1_1/db6z6r660/image/upload", // Ensure this URL is correct
      data
    );

    const { url } = res.data;
    return url;
  } catch (err) {
    console.error("Error uploading file:", err.response.data); // Log the detailed error
  }
};

export default upload;
