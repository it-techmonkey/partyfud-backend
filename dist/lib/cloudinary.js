"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFromCloudinary = exports.uploadToCloudinary = void 0;
const cloudinary_1 = require("cloudinary");
require("dotenv/config");
// Validate Cloudinary configuration
const cloud_name = process.env.CLOUDINARY_CLOUD_NAME?.trim();
const api_key = process.env.CLOUDINARY_API_KEY?.trim();
const api_secret = process.env.CLOUDINARY_API_SECRET?.trim();
if (!cloud_name || !api_key || !api_secret) {
    console.error('❌ Cloudinary configuration missing!');
    console.error('Please set the following environment variables:');
    console.error('  - CLOUDINARY_CLOUD_NAME (your Cloudinary cloud name)');
    console.error('  - CLOUDINARY_API_KEY (your API key)');
    console.error('  - CLOUDINARY_API_SECRET (your API secret)');
    console.error('\n💡 Note: The cloud_name is NOT the same as the API key name.');
    console.error('   Find your cloud_name in the Cloudinary dashboard URL or Settings.');
    console.error('\n📋 Current values:');
    console.error(`   CLOUDINARY_CLOUD_NAME: ${cloud_name || 'NOT SET'}`);
    console.error(`   CLOUDINARY_API_KEY: ${api_key || 'NOT SET'}`);
    console.error(`   CLOUDINARY_API_SECRET: ${api_secret ? '***SET***' : 'NOT SET'}`);
}
else {
    console.log('✅ Cloudinary configuration loaded');
    console.log(`   Cloud Name: ${cloud_name}`);
    console.log(`   API Key: ${api_key}`);
}
// Configure Cloudinary
cloudinary_1.v2.config({
    cloud_name: cloud_name || '',
    api_key: api_key || '',
    api_secret: api_secret || '',
});
/**
 * Upload image to Cloudinary
 * @param file - Multer file object
 * @param folder - Cloudinary folder path (optional)
 * @returns Promise<string> - Secure URL of uploaded image
 */
const uploadToCloudinary = async (file, folder = 'partyfud') => {
    // Check if Cloudinary is configured
    if (!cloud_name || !api_key || !api_secret) {
        throw new Error('Cloudinary is not configured. Please check your environment variables.');
    }
    // Log the cloud_name being used for debugging (without exposing secret)
    console.log(`[Cloudinary] Attempting upload with cloud_name: ${cloud_name}`);
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary_1.v2.uploader.upload_stream({
            folder: folder,
            resource_type: 'image',
            transformation: [
                { width: 800, height: 600, crop: 'limit' },
                { quality: 'auto' },
            ],
        }, (error, result) => {
            if (error) {
                console.error('[Cloudinary] Upload error:', error);
                console.error('[Cloudinary] Error details:', {
                    message: error.message,
                    http_code: error.http_code,
                    name: error.name,
                });
                // Provide more helpful error messages
                if (error.message?.includes('Invalid cloud_name') || error.http_code === 401) {
                    reject(new Error(`Invalid Cloudinary cloud_name "${cloud_name}". Please verify:
1. The cloud_name in your .env file matches your Cloudinary dashboard URL
2. Your dashboard URL looks like: https://console.cloudinary.com/console/c/[cloud_name]/...
3. The cloud_name is the part after "/c/" in the URL
4. There are no quotes or extra spaces around the value in .env`));
                }
                else if (error.message?.includes('Invalid API Key') || error.http_code === 401) {
                    reject(new Error(`Invalid Cloudinary API credentials. Please verify:
1. Your CLOUDINARY_API_KEY is correct
2. Your CLOUDINARY_API_SECRET is correct
3. The API key is active in your Cloudinary dashboard`));
                }
                else {
                    reject(new Error(`Cloudinary upload failed: ${error.message || 'Unknown error'}. HTTP Code: ${error.http_code || 'N/A'}`));
                }
            }
            else {
                console.log(`[Cloudinary] Upload successful: ${result.secure_url}`);
                resolve(result.secure_url);
            }
        });
        uploadStream.end(file.buffer);
    });
};
exports.uploadToCloudinary = uploadToCloudinary;
/**
 * Delete image from Cloudinary
 * @param imageUrl - Full URL of the image to delete
 * @returns Promise<void>
 */
const deleteFromCloudinary = async (imageUrl) => {
    try {
        // Extract public_id from URL
        const urlParts = imageUrl.split('/');
        const filename = urlParts[urlParts.length - 1];
        const publicId = filename.split('.')[0];
        const folder = urlParts[urlParts.length - 2];
        const fullPublicId = folder ? `${folder}/${publicId}` : publicId;
        await cloudinary_1.v2.uploader.destroy(fullPublicId);
    }
    catch (error) {
        console.error('Error deleting image from Cloudinary:', error);
        // Don't throw error - allow deletion to continue even if Cloudinary deletion fails
    }
};
exports.deleteFromCloudinary = deleteFromCloudinary;
exports.default = cloudinary_1.v2;
