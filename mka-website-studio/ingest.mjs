import fs from 'fs';
import path from 'path';
import { getCliClient } from 'sanity/cli';

const client = getCliClient({ apiVersion: '2023-05-03' });

const IMAGES_DIR = 'C:\\Users\\Fakhir Ashraf\\Desktop\\MKA_Images';

// Helper to determine category from Urdu name
function determineCategory(folderName) {
  if (folderName.includes('مسجد') || folderName.includes('دارالعلوم')) return 'religious';
  if (folderName.includes('ولا') || folderName.includes('منزل') || folderName.includes('حویلی') || folderName.includes('ڈی ایچ اے')) return 'residential';
  if (folderName.includes('سرائے') || folderName.includes('کلب') || folderName.includes('میس') || folderName.includes('سراۓ')) return 'hospitality';
  if (folderName.includes('ہسپتال')) return 'health';
  if (folderName.includes('مال') || folderName.includes('مرکز') || folderName.includes('براڈواے') || folderName.includes('سٹپلز') || folderName.includes('سائکل پیالہ')) return 'commercial';
  
  // Default fallback
  return 'master-planning'; 
}

async function uploadImage(filePath) {
  console.log(`Uploading ${filePath}...`);
  const asset = await client.assets.upload('image', fs.createReadStream(filePath), {
    filename: path.basename(filePath)
  });
  return asset._id;
}

async function run() {
  const folders = fs.readdirSync(IMAGES_DIR, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

  console.log(`Found ${folders.length} extracted project folders.`);

  function getImagesRecursively(dir) {
    let results = [];
    const list = fs.readdirSync(dir, { withFileTypes: true });
    for (const file of list) {
      const fullPath = path.join(dir, file.name);
      if (file.isDirectory()) {
        results = results.concat(getImagesRecursively(fullPath));
      } else if (file.name.match(/\.(jpg|jpeg|png|gif)$/i)) {
        results.push(fullPath);
      }
    }
    return results;
  }

  for (const folder of folders) {
    console.log(`\nProcessing Project: ${folder}`);
    const folderPath = path.join(IMAGES_DIR, folder);
    const files = getImagesRecursively(folderPath);
    
    if (files.length === 0) {
      console.log(`No images found in ${folder}, skipping...`);
      continue;
    }

    const title = folder.replace(/^__?/, '').replace(/_$/, '').split('-')[0].replace(/^\d+\s/, '').trim();
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') || `project-${Date.now()}`;
    const category = determineCategory(folder);

    try {
      // Upload main image (first file)
      const mainImageId = await uploadImage(files[0]);
      
      // Upload remaining images for gallery
      const gallery = [];
      for (let i = 1; i < files.length; i++) {
        const imageId = await uploadImage(files[i]);
        gallery.push({
          _type: 'image',
          asset: { _type: 'reference', _ref: imageId }
        });
      }

      // Create document
      const doc = {
        _type: 'project',
        title: title,
        slug: { _type: 'slug', current: slug },
        category: category,
        featured: false,
        mainImage: {
          _type: 'image',
          asset: { _type: 'reference', _ref: mainImageId }
        },
      };

      if (gallery.length > 0) {
        doc.gallery = gallery;
      }

      const created = await client.create(doc);
      console.log(`✅ Created project: ${created.title} (ID: ${created._id})`);

    } catch (err) {
      console.error(`❌ Failed to process ${folder}:`, err.message);
    }
  }
}

run().catch(console.error);
