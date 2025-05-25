import React, { useEffect, useState } from 'react';

const Display = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchImages() {
      try {
        const res = await fetch('/api/list-wedding-images');  // or full URL if needed
        if (!res.ok) throw new Error('Network response was not ok');
        const data = await res.json();
        setImages(data.images);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchImages();
  }, []);

  if (loading) return <p>Loading images...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h2>Wedding Images</h2>
      {images.length === 0 && <p>No images found.</p>}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
        {images.map((url, idx) => (
          <img key={idx} src={url} alt={`Wedding img ${idx + 1}`} style={{ width: '150px' }} />
        ))}
      </div>
    </div>
  );
};

export default Display;
