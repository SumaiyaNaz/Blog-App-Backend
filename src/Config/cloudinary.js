// Config/cloudinary.js
import cloudinary from 'cloudinary';
import dotenv from 'dotenv'
import crypto from 'crypto';
import { Readable } from 'stream';

dotenv.config()

// Configure Cloudinary with correct env variables
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


const uploadImage = (file) => {
  return new Promise((resolve, reject) => {
    try {
      // Generate a unique filename without special characters
      const uniqueId = crypto.randomBytes(16).toString('hex');
      const sanitizedFilename = `blog_${uniqueId}`;
      
      console.log('Uploading file with sanitized name:', sanitizedFilename);
      console.log('File size:', file.size, 'bytes');
      
      const uploadStream = cloudinary.v2.uploader.upload_stream(
        {
          folder: 'blogs',
          public_id: sanitizedFilename,
          resource_type: 'image',
          transformation: [
            { quality: 'auto' },
            { fetch_format: 'auto' }
          ]
        },
        (error, result) => {
          if (error) {
            console.log('Cloudinary upload error:', error);
            reject(error);
          } else {
            console.log('Cloudinary upload success:', result);
            resolve({
              image: result.secure_url,
              public_id: result.public_id,
            });
          }
        }
      );
      
      // Convert buffer to stream and pipe to Cloudinary
      const bufferStream = Readable.from(file.buffer);
      bufferStream.pipe(uploadStream);
      
    } catch (error) {
      console.log('Error in uploadImage:', error);
      reject(error);
    }
  });
};

export { uploadImage };