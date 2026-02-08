#!/usr/bin/env node

/**
 * tattooremovalnear.com — Build Pipeline
 *
 * Orchestrates the full static-site build:
 *   1. Clean dist/
 *   2. Copy root HTML pages + base.css
 *   3. Process Articles/*.md → dist/articles/*.html
 *   4. Generate articles hub + category indexes
 *   5. Build sitemap.xml + robots.txt
 *   6. Build 404 page
 */

const fs = require('fs');
const path = require('path');
const { processArticles } = require('./md-to-html');
const { megaNavHtml, megaNavScript, footerHtml, headIncludes, SAME_AS_ARRAY } = require('./shared');

const ROOT = path.join(__dirname, '..');
const DIST = path.join(ROOT, 'dist');
const SITE_URL = 'https://tattooremovalnear.com';

// Root-level files to copy verbatim to dist
const ROOT_FILES = [
  'index.html',
  'find-a-clinic.html',
  'base.css',
  'netlify.toml'
];

// ─── Utilities ────────────────────────────────────────────────────

function clean() {
  if (fs.existsSync(DIST)) {
    fs.rmSync(DIST, { recursive: true });
  }
  fs.mkdirSync(DIST, { recursive: true });
  console.log('Cleaned dist/');
}

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ─── Copy Root Files ──────────────────────────────────────────────

function copyRootFiles() {
  let count = 0;
  console.log('\nRoot files:');
  for (const file of ROOT_FILES) {
    const src = path.join(ROOT, file);
    if (fs.existsSync(src)) {
      fs.copyFileSync(src, path.join(DIST, file));
      console.log(`  ${file}`);
      count++;
    } else {
      console.log(`  ${file} (not found, skipping)`);
    }
  }
  return count;
}

// ─── Article Cards HTML ───────────────────────────────────────────

function buildArticleCards(articles) {
  return articles.map(a => `
        <a href="/articles/${a.slug}.html" class="card card-article">
          <h3>${escapeHtml(a.title)}</h3>
          <p>${escapeHtml(a.description)}</p>
          <span class="card-arrow">Read article &rarr;</span>
        </a>`).join('\n');
}

// ─── Articles Hub Page ────────────────────────────────────────────

function buildArticlesHub(articles) {
  const cards = buildArticleCards(articles);

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tattoo Removal Articles &amp; Guides | Tattoo Removal Near</title>
    <meta name="description" content="In-depth guides on tattoo removal technologies, costs, pain management, and how to find the right clinic. Real data, no sales pitch.">
    <meta name="robots" content="index, follow">
    <link rel="canonical" href="${SITE_URL}/articles.html">
    <meta property="og:type" content="website">
    <meta property="og:url" content="${SITE_URL}/articles.html">
    <meta property="og:title" content="Tattoo Removal Articles &amp; Guides">
    <meta property="og:description" content="In-depth guides on tattoo removal technologies, costs, and clinic selection.">
    <meta property="og:site_name" content="Tattoo Removal Near">
${headIncludes}
</head>
<body>
${megaNavHtml}

  <main class="page-content">
    <div class="section" style="background:linear-gradient(170deg, var(--base), var(--surface-alt));">
      <div class="container">
        <h1 style="margin-bottom:var(--space-3);">Tattoo Removal Guides</h1>
        <p style="font-size:var(--text-lg); max-width:600px;">
          ${articles.length} articles covering laser technologies, real pricing data, pain management, and clinic vetting. Each one built from research, not marketing.
        </p>
      </div>
    </div>

    <div class="section">
      <div class="container">
        <div class="grid-2">
${cards}
        </div>
      </div>
    </div>
  </main>

${footerHtml}
${megaNavScript}
</body>
</html>`;

  fs.writeFileSync(path.join(DIST, 'articles.html'), html);
  console.log('Built: articles.html');
}

// ─── 404 Page ─────────────────────────────────────────────────────

function build404() {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Page Not Found | Tattoo Removal Near</title>
    <meta name="robots" content="noindex">
${headIncludes}
</head>
<body>
${megaNavHtml}

  <main class="page-content">
    <div class="container" style="padding-top:var(--space-24); padding-bottom:var(--space-24); text-align:center;">
      <h1 style="font-size:clamp(4rem,10vw,6rem); color:var(--accent); margin-bottom:var(--space-4);">404</h1>
      <p style="font-size:var(--text-xl); color:var(--text-secondary); margin-bottom:var(--space-8);">This page doesn't exist.</p>
      <a href="/" class="btn btn-primary btn-lg">Back to Home</a>
    </div>
  </main>

${footerHtml}
${megaNavScript}
</body>
</html>`;

  fs.writeFileSync(path.join(DIST, '404.html'), html);
  console.log('Built: 404.html');
}

// ─── Sitemap ──────────────────────────────────────────────────────

function buildSitemap(articles) {
  const today = new Date().toISOString().split('T')[0];
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${SITE_URL}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${SITE_URL}/articles.html</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${SITE_URL}/find-a-clinic.html</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>`;

  for (const a of articles) {
    xml += `
  <url>
    <loc>${SITE_URL}/articles/${a.slug}.html</loc>
    <lastmod>${a.date}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`;
  }

  xml += '\n</urlset>\n';
  fs.writeFileSync(path.join(DIST, 'sitemap.xml'), xml);
  console.log('Built: sitemap.xml');
}

// ─── Robots.txt ───────────────────────────────────────────────────

function buildRobots() {
  const content = `User-agent: *
Allow: /

Sitemap: ${SITE_URL}/sitemap.xml
`;
  fs.writeFileSync(path.join(DIST, 'robots.txt'), content);
  console.log('Built: robots.txt');
}

// ─── Main ─────────────────────────────────────────────────────────

function main() {
  console.log('Building tattooremovalnear.com (Clean Slate)\n');

  clean();
  const rootCount = copyRootFiles();

  console.log('\nProcessing articles...');
  const articles = processArticles();
  console.log(`${articles.length} articles processed.`);

  buildArticlesHub(articles);
  build404();
  buildSitemap(articles);
  buildRobots();

  const total = rootCount + articles.length + 3; // +3 for articles.html, 404, sitemap
  console.log(`\nBuild complete. ${total} files in dist/`);
}

main();
