#!/usr/bin/env node

/**
 * Sitemap Generator for tattooremovalnear.com
 *
 * Scans dist/ for all HTML files and generates sitemap.xml with
 * priority scoring based on page type.
 *
 * Run: node scripts/generate-sitemap.js
 */

const fs = require('fs');
const path = require('path');

const CONFIG = {
  baseUrl: 'https://tattooremovalnear.com',
  distDir: path.resolve(__dirname, '..', 'dist'),
  outputFile: path.resolve(__dirname, '..', 'dist', 'sitemap.xml'),

  excludeFiles: ['404.html'],

  priorities: {
    'index.html':          { priority: 1.0, changefreq: 'weekly' },
    'find-a-clinic.html':  { priority: 0.9, changefreq: 'weekly' },
    'articles.html':       { priority: 0.9, changefreq: 'weekly' },
    'articles/':           { priority: 0.8, changefreq: 'monthly' },
    'default':             { priority: 0.5, changefreq: 'monthly' }
  }
};

function getHtmlFiles(dir, fileList = []) {
  if (!fs.existsSync(dir)) return fileList;
  const items = fs.readdirSync(dir);

  for (const item of items) {
    const full = path.join(dir, item);
    const stat = fs.statSync(full);

    if (stat.isDirectory()) {
      getHtmlFiles(full, fileList);
    } else if (item.endsWith('.html') && !CONFIG.excludeFiles.includes(item)) {
      fileList.push(full);
    }
  }

  return fileList;
}

function getPriorityConfig(filePath) {
  const rel = path.relative(CONFIG.distDir, filePath);
  const fileName = path.basename(filePath);

  if (CONFIG.priorities[fileName]) return CONFIG.priorities[fileName];

  for (const [key, value] of Object.entries(CONFIG.priorities)) {
    if (rel.startsWith(key)) return value;
  }

  return CONFIG.priorities.default;
}

function fileToUrl(filePath) {
  let rel = path.relative(CONFIG.distDir, filePath);
  let url = rel.replace('.html', '');

  if (url === 'index') return `${CONFIG.baseUrl}/`;

  return `${CONFIG.baseUrl}/${url}`;
}

function getLastMod(filePath) {
  return fs.statSync(filePath).mtime.toISOString().split('T')[0];
}

function generateSitemap() {
  console.log('Scanning dist/ for HTML...');

  const files = getHtmlFiles(CONFIG.distDir);

  files.sort((a, b) => {
    const pa = getPriorityConfig(a).priority;
    const pb = getPriorityConfig(b).priority;
    if (pa !== pb) return pb - pa;
    return a.localeCompare(b);
  });

  const entries = files.map(f => {
    const { priority, changefreq } = getPriorityConfig(f);
    return `  <url>
    <loc>${fileToUrl(f)}</loc>
    <lastmod>${getLastMod(f)}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority.toFixed(1)}</priority>
  </url>`;
  }).join('\n');

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries}
</urlset>`;

  fs.writeFileSync(CONFIG.outputFile, sitemap);
  console.log(`Generated: ${CONFIG.outputFile}`);
  console.log(`Total: ${files.length} URLs`);
}

generateSitemap();
