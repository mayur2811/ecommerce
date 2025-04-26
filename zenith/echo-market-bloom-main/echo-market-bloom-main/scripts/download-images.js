import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const imageUrls = {
  headphones: 'https://images.pexels.com/photos/3587478/pexels-photo-3587478.jpeg?auto=compress&cs=tinysrgb&w=1200',
  smartwatch: 'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=1200',
  camera: 'https://images.pexels.com/photos/51383/photo-camera-subject-photographer-51383.jpeg?auto=compress&cs=tinysrgb&w=1200',
  laptop: 'https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=1200',
  earbuds: 'https://images.pexels.com/photos/3780681/pexels-photo-3780681.jpeg?auto=compress&cs=tinysrgb&w=1200',
  smarthub: 'https://images.pexels.com/photos/4790255/pexels-photo-4790255.jpeg?auto=compress&cs=tinysrgb&w=1200'
};

const downloadImage = (url, filename) => {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(path.join(__dirname, '../public/images/products', filename));
    
    const request = https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    }, (response) => {
      // Handle redirects
      if (response.statusCode === 301 || response.statusCode === 302) {
        const redirectUrl = response.headers.location;
        https.get(redirectUrl, (redirectResponse) => {
          redirectResponse.pipe(file);
        });
        return;
      }

      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download ${filename}: ${response.statusCode}`));
        return;
      }

      response.pipe(file);

      file.on('finish', () => {
        file.close();
        // Verify file size
        const stats = fs.statSync(path.join(__dirname, '../public/images/products', filename));
        if (stats.size < 1000) { // Less than 1KB is probably an error
          reject(new Error(`Downloaded file ${filename} is too small (${stats.size} bytes)`));
          return;
        }
        console.log(`Downloaded ${filename} (${stats.size} bytes)`);
        resolve();
      });
    });

    request.on('error', (err) => {
      fs.unlink(path.join(__dirname, '../public/images/products', filename), () => {});
      reject(err);
    });

    file.on('error', (err) => {
      fs.unlink(path.join(__dirname, '../public/images/products', filename), () => {});
      reject(err);
    });
  });
};

const downloadAllImages = async () => {
  try {
    // Create products directory if it doesn't exist
    const productsDir = path.join(__dirname, '../public/images/products');
    if (!fs.existsSync(productsDir)) {
      fs.mkdirSync(productsDir, { recursive: true });
    }

    // Delete existing images
    const existingFiles = fs.readdirSync(productsDir);
    for (const file of existingFiles) {
      fs.unlinkSync(path.join(productsDir, file));
    }

    // Download all images
    for (const [key, url] of Object.entries(imageUrls)) {
      try {
        await downloadImage(url, `${key}.jpg`);
      } catch (error) {
        console.error(`Error downloading ${key}.jpg:`, error.message);
      }
    }

    console.log('All images downloaded successfully!');
  } catch (error) {
    console.error('Error:', error);
  }
};

downloadAllImages(); 