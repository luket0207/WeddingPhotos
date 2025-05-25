const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

module.exports = async (req, res) => {
  console.log("Function invoked");
  try {
    const result = await cloudinary.api.resources({
      type: 'upload',
      prefix: 'Wedding/',
      max_results: 100,
    });
    console.log("Cloudinary result:", result);

    const images = result.resources.map(img => img.secure_url);
    res.status(200).json({ images });
  } catch (error) {
    console.error('Error fetching images:', error);
    res.status(500).json({ error: 'Failed to fetch images' });
  }
};
