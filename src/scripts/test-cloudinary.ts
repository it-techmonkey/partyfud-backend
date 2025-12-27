import "dotenv/config";
import { v2 as cloudinary } from 'cloudinary';

/**
 * Test script to verify Cloudinary configuration
 * Run with: npm run test:cloudinary (add to package.json) or ts-node src/scripts/test-cloudinary.ts
 */

const cloud_name = process.env.CLOUDINARY_CLOUD_NAME?.trim();
const api_key = process.env.CLOUDINARY_API_KEY?.trim();
const api_secret = process.env.CLOUDINARY_API_SECRET?.trim();

console.log('\n🔍 Testing Cloudinary Configuration...\n');

// Check if variables are set
console.log('📋 Environment Variables:');
console.log(`   CLOUDINARY_CLOUD_NAME: ${cloud_name || '❌ NOT SET'}`);
console.log(`   CLOUDINARY_API_KEY: ${api_key || '❌ NOT SET'}`);
console.log(`   CLOUDINARY_API_SECRET: ${api_secret ? '✅ SET' : '❌ NOT SET'}`);
console.log('');

if (!cloud_name || !api_key || !api_secret) {
  console.error('❌ Missing Cloudinary configuration!');
  console.error('Please set all three environment variables in your .env file.');
  process.exit(1);
}

// Configure Cloudinary
cloudinary.config({
  cloud_name,
  api_key,
  api_secret,
});

// Test the configuration by trying to ping Cloudinary
async function testCloudinary() {
  try {
    console.log('🔄 Testing Cloudinary connection...');
    
    // Try to get account details (this will verify credentials)
    const result = await cloudinary.api.ping();
    
    console.log('✅ Cloudinary connection successful!');
    console.log(`   Cloud Name: ${cloud_name}`);
    console.log(`   API Key: ${api_key}`);
    console.log('\n🎉 Your Cloudinary configuration is correct!\n');
    
  } catch (error: any) {
    console.error('\n❌ Cloudinary connection failed!');
    console.error(`   Error: ${error.message}`);
    
    if (error.message?.includes('Invalid cloud_name') || error.http_code === 401) {
      console.error('\n💡 Troubleshooting:');
      console.error('   1. Verify your cloud_name in the Cloudinary dashboard URL');
      console.error('   2. The URL should be: https://console.cloudinary.com/console/c/[cloud_name]/...');
      console.error('   3. Make sure there are no quotes or spaces in your .env file');
      console.error(`   4. Current cloud_name: "${cloud_name}"`);
    } else if (error.message?.includes('Invalid API Key')) {
      console.error('\n💡 Troubleshooting:');
      console.error('   1. Verify your API Key and API Secret in Cloudinary dashboard');
      console.error('   2. Make sure the API key is active');
      console.error('   3. Check for any typos in your .env file');
    }
    
    console.error('\n');
    process.exit(1);
  }
}

testCloudinary();

