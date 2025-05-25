import React, { useState } from 'react';

const Upload = () => {
  const [imageUrl, setImageUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(null);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setUploadSuccess(null);
    setImageUrl('');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'react_upload'); // Use your unsigned preset
    formData.append('folder', 'Wedding'); // Save to "Wedding" folder

    try {
      const response = await fetch(`https://api.cloudinary.com/v1_1/dietvbzzl/image/upload`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      console.log('Cloudinary response:', data);

      if (response.ok && data.secure_url) {
        setImageUrl(data.secure_url);
        setUploadSuccess(true);
      } else {
        console.error('Upload failed:', data);
        setUploadSuccess(false);
      }
    } catch (err) {
      console.error('Upload error:', err);
      setUploadSuccess(false);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <h2>Upload</h2>
      <input type="file" accept="image/*" onChange={handleImageUpload} />

      {uploading && <p>Uploading...</p>}
      {uploadSuccess === true && <p style={{ color: 'green' }}>✅ Upload successful!</p>}
      {uploadSuccess === false && <p style={{ color: 'red' }}>❌ Upload failed. Please check console for details.</p>}

      {imageUrl && (
        <div>
          <p>Uploaded Image:</p>
          <img src={imageUrl} alt="Uploaded" style={{ width: '300px' }} />
        </div>
      )}
    </div>
  );
};

export default Upload;
