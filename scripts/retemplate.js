#!/usr/bin/env node

/**
 * Retemplate all article HTML files to match the Clean Slate design system.
 *
 * Extracts: title, meta description, schema JSON-LD, article body
 * Wraps in: base.css + Outfit + Nunito Sans + mega nav/footer
 *
 * Run: node scripts/retemplate.js
 */

const fs = require('fs');
const path = require('path');
const { megaNavHtml, megaNavScript, footerHtml, headIncludes } = require('./shared');

const ROOT_DIR = path.join(__dirname, '..');
const ARTICLES_DIR = path.join(ROOT_DIR, 'dist', 'articles');

function escapeAttr(str) {
  let decoded = str
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
  return decoded
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function extractFromHtml(html) {
  const titleMatch = html.match(/<title>([\s\S]*?)<\/title>/);
  const title = titleMatch ? titleMatch[1].trim() : 'Tattoo Removal Near';

  const descMatch = html.match(/<meta\s+name="description"\s+content="([\s\S]*?)"/);
  const description = descMatch ? descMatch[1].trim() : '';

  const schemaBlocks = [];
  const schemaRegex = /<script\s+type="application\/ld\+json">\s*([\s\S]*?)\s*<\/script>/g;
  let match;
  while ((match = schemaRegex.exec(html)) !== null) {
    schemaBlocks.push(match[1].trim());
  }

  const articleMatch = html.match(/<article[^>]*>([\s\S]*?)<\/article>/);
  const articleContent = articleMatch ? articleMatch[1] : '';

  return { title, description, schemaBlocks, articleContent };
}

function buildTemplate(title, description, schemaBlocks, articleContent, slug) {
  const safeTitle = escapeAttr(title);
  const safeDesc = escapeAttr(description);

  const schemaScripts = schemaBlocks.map(s =>
    `    <script type="application/ld+json">\n    ${s}\n    </script>`
  ).join('\n');

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${safeTitle}</title>
    <meta name="description" content="${safeDesc}">
    <meta name="robots" content="index, follow">
    <link rel="canonical" href="https://tattooremovalnear.com/articles/${slug}">
    <meta property="og:type" content="article">
    <meta property="og:url" content="https://tattooremovalnear.com/articles/${slug}">
    <meta property="og:title" content="${safeTitle}">
    <meta property="og:description" content="${safeDesc}">
    <meta property="og:site_name" content="Tattoo Removal Near">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${safeTitle}">
    <meta name="twitter:description" content="${safeDesc}">
${schemaScripts}
${headIncludes}
</head>
<body>
${megaNavHtml}

  <main class="page-content">
    <div class="container" style="padding-top:var(--space-8);">
      <div class="breadcrumbs" style="padding-top:0;">
        <a href="/">Home</a>
        <span class="sep">&rsaquo;</span>
        <a href="/articles.html">Articles</a>
        <span class="sep">&rsaquo;</span>
        <span>${title.replace(/\s*\|.*$/, '')}</span>
      </div>
    </div>

    <div class="container">
      <div class="article-body">
        <article>
          ${articleContent}
        </article>

        <div class="cta-box">
          <h3>Ready to Start Your Removal?</h3>
          <p>Find verified clinics near you with transparent pricing and real technology data.</p>
          <a href="/find-a-clinic.html" class="btn btn-primary btn-lg">Find a Clinic Near You</a>
          <div class="trust-signals">
            <span>850+ clinics researched</span>
            <span>50 US markets</span>
            <span>Real pricing data</span>
          </div>
        </div>

        <div style="margin-top:var(--space-8); padding-top:var(--space-6); border-top:1px solid var(--border);">
          <a href="/articles.html" style="font-weight:600;">&larr; All Articles</a>
        </div>
      </div>
    </div>
  </main>

${footerHtml}
${megaNavScript}
</body>
</html>`;
}

function retemplate() {
  console.log('Retemplating article pages to Clean Slate...\n');

  if (!fs.existsSync(ARTICLES_DIR)) {
    console.log('No dist/articles/ directory. Run build first.');
    return;
  }

  const files = fs.readdirSync(ARTICLES_DIR).filter(f => f.endsWith('.html'));
  let count = 0;
  const errors = [];

  for (const file of files) {
    const filePath = path.join(ARTICLES_DIR, file);
    const html = fs.readFileSync(filePath, 'utf8');
    const { title, description, schemaBlocks, articleContent } = extractFromHtml(html);

    if (!articleContent) {
      errors.push(`${file}: no <article> tag found`);
      continue;
    }

    const slug = file.replace('.html', '');
    const newHtml = buildTemplate(title, description, schemaBlocks, articleContent, slug);
    fs.writeFileSync(filePath, newHtml);
    count++;
  }

  if (errors.length > 0) {
    console.log(`\nWarnings (${errors.length}):`);
    errors.forEach(e => console.log(`  ${e}`));
  }

  console.log(`\nRetemplated ${count} articles.`);
}

retemplate();
