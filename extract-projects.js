const fs = require('fs');
const html = fs.readFileSync('projects/index.html', 'utf-8');
const regex = /<a href="([^"]+)" class="project-card-grid[^>]*>([\s\S]*?)<\/a>/g;
let match;
const projects = [];
while ((match = regex.exec(html)) !== null) {
  const url = match[1];
  const inner = match[2];
  const titleMatch = inner.match(/<div class="title">([^<]+)<\/div>/);
  if (titleMatch) {
    projects.push({ url, title: titleMatch[1].trim() });
  }
}
console.log(JSON.stringify(projects, null, 2));
