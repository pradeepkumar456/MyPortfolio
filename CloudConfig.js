// /config/cloudinary.js
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key:    process.env.CLOUD_API,
  api_secret: process.env.CLOUD_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    // जिस folder में upload करना है
    const folder = 'pradeep-kumar'; 
    // कौन से formats allow हैं
    const allowedFormats = ['jpg','jpeg','png','webp','pdf'];

    // public_id को readable रखने के लिए
    const originalName = file.originalname.split('.').slice(0, -1).join('.') || 'file';
    const publicId = `${Date.now()}-${originalName}`;

    return {
      folder,
      public_id: publicId,
      resource_type: 'auto',          // image/pdf/video auto detect
      allowed_formats: allowedFormats // सिर्फ ये formats allow
    };
  },
});

module.exports = { cloudinary, storage };
