import { createClient } from '@sanity/client';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

const client = createClient({
  projectId: process.env.SANITY_STUDIO_PROJECT_ID || '6xblaggo', // from previous logs
  dataset: 'production',
  useCdn: false,
  apiVersion: '2023-05-03',
  token: process.env.SANITY_API_TOKEN
});

async function run() {
  console.log("Fetching projects...");
  const projects = await client.fetch('*[_type == "project"]');
  
  let found = false;
  for (const p of projects) {
    if (p.title && p.title.includes('Jamkhana')) {
      found = true;
      const newTitle = p.title.replace('Jamkhana', 'Gymkhana');
      console.log(`Updating ${p.title} -> ${newTitle}`);
      await client.patch(p._id).set({ title: newTitle }).commit();
    }
  }
  
  if (!found) {
    console.log("No projects found with 'Jamkhana' in the title.");
  } else {
    console.log("Done updating projects!");
  }
}

run().catch(console.error);
