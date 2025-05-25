import React, { useState } from 'react';

const Upload = () => {
  const [imageUrl, setImageUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(null);

  const uploadImageWithNextAvailableName = async (file, startIndex = 1) => {
    let index = startIndex;
    const maxAttempts = 1000;

    while (index <= maxAttempts) {
      const formData = new FormData();
      const fileName = `photo_${String(index).padStart(3, '0')}`;

      formData.append('file', file);
      formData.append('upload_preset', 'react_upload');
      formData.append('folder', 'Wedding');

      try {
        const response = await fetch(`https://api.cloudinary.com/v1_1/dietvbzzl/image/upload`, {
          method: 'POST',
          body: formData,
        });

        const data = await response.json();
        console.log(`Attempt to upload as ${fileName}:`, data);

        if (response.ok && data.secure_url) {
          return { secureUrl: data.secure_url, fileName };
        } else {
          // Check if error indicates duplicate public_id (may vary)
          const errMsg = data.error?.message?.toLowerCase() || '';
          if (errMsg.includes('already exists') || errMsg.includes('public_id already exists')) {
            index++;
            continue;
          } else {
            // Other errors — stop trying
            throw new Error(data.error?.message || 'Unknown upload error');
          }
        }
      } catch (err) {
        throw err;
      }
    }
    throw new Error('No available filename found after multiple attempts.');
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setUploadSuccess(null);
    setImageUrl('');

    try {
      const { secureUrl, fileName } = await uploadImageWithNextAvailableName(file);
      setImageUrl(secureUrl);
      setUploadSuccess(true);
      console.log(`Image uploaded successfully as ${fileName}`);
    } catch (err) {
      console.error('Upload failed:', err.message);
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
