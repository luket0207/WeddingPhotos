import React, { useEffect, useState } from 'react';

const Display = () => {
  const [images, setImages] = useState([]);

  const fetchImages = async () => {
    try {
      const response = await fetch('http://localhost:5000/wedding-images');
      const data = await response.json();
      setImages(data);
    } catch (err) {
      console.error('Failed to load images:', err);
    }
  };

  useEffect(() => {
    fetchImages();

    // Optional: Poll for updates every 10 seconds
    const interval = setInterval(fetchImages, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <h2>Wedding Gallery</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
        {images.map((img) => (
          <img
            key={img.public_id}
            src={img.url}
            alt="Wedding"
            style={{ width: '300px', borderRadius: '8px' }}
          />
        ))}
      </div>
    </div>
  );
};

export default Display;
