#!/usr/bin/env node

/**
 * Generate articles hub page from current article set.
 *
 * Scans dist/articles/ for built HTML files, extracts metadata,
 * and regenerates articles.html at root level.
 *
 * Run: node scripts/generate-indexes.js
 */

const fs = require('fs');
const path = require('path');
const { megaNavHtml, megaNavScript, footerHtml, headIncludes } = require('./shared');

const ROOT_DIR = path.join(__dirname, '..');
const DIST_ARTICLES = path.join(ROOT_DIR, 'dist', 'articles');
const SITE_URL = 'https://tattooremovalnear.com';

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function extractTitle(html) {
  const h1 = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/);
  if (h1) return h1[1].replace(/<[^>]*>/g, '').trim();
  const title = html.match(/<title>([\s\S]*?)<\/title>/);
  if (title) return title[1].replace(/\s*\|.*$/, '').trim();
  return 'Untitled';
}

function extractDescription(html) {
  const match = html.match(/<meta\s+name="description"\s+content="([\s\S]*?)"/);
  return match ? match[1].trim() : '';
}

function getArticles() {
  if (!fs.existsSync(DIST_ARTICLES)) return [];

  return fs.readdirSync(DIST_ARTICLES)
    .filter(f => f.endsWith('.html'))
    .map(file => {
      const html = fs.readFileSync(path.join(DIST_ARTICLES, file), 'utf8');
      const title = extractTitle(html);
      const description = extractDescription(html);
      const slug = file.replace('.html', '');
      return { file, slug, title, description };
    })
    .sort((a, b) => a.title.localeCompare(b.title));
}

function generateHub() {
  const articles = getArticles();

  const cards = articles.map(a => `
        <a href="/articles/${a.slug}.html" class="card card-article">
          <h3>${escapeHtml(a.title)}</h3>
          <p>${escapeHtml(a.description)}</p>
          <span class="card-arrow">Read article &rarr;</span>
        </a>`).join('\n');

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
    <meta property="og:description" content="In-depth guides covering laser technologies, real cost data, and clinic vetting.">
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

  // Write to root for source, and dist for output
  fs.writeFileSync(path.join(ROOT_DIR, 'articles.html'), html);
  if (fs.existsSync(path.join(ROOT_DIR, 'dist'))) {
    fs.writeFileSync(path.join(ROOT_DIR, 'dist', 'articles.html'), html);
  }

  console.log(`Generated articles.html (${articles.length} articles)`);
}

generateHub();
