#!/usr/bin/env node

/**
 * Markdown → HTML converter for tattooremovalnear.com
 *
 * Parses frontmatter (double-colon format), converts markdown body via `marked`,
 * wraps in the Clean Slate article template with schema, nav, footer.
 *
 * Can run standalone or be required by build.js.
 */

const fs = require('fs');
const path = require('path');
const { marked } = require('marked');
const { megaNavHtml, megaNavScript, footerHtml, headIncludes, SAME_AS_ARRAY } = require('./shared');

const SKIP_FILES = ['README.md', '_brief.md', '_content-stack.md'];
const ARTICLES_DIR = path.join(__dirname, '..', 'Articles');
const DIST_DIR = path.join(__dirname, '..', 'dist', 'articles');

// ─── Frontmatter Parser (double-colon style) ─────────────────────

function parseFrontmatter(content) {
  const meta = {};
  const fmMatch = content.match(/^---\n([\s\S]*?)\n---/);
  if (!fmMatch) return { meta, body: content };

  const fmBlock = fmMatch[1];
  for (const line of fmBlock.split('\n')) {
    const match = line.match(/^(\w[\w_-]*)::?\s*(.+)$/);
    if (match) {
      meta[match[1].trim()] = match[2].trim();
    }
  }

  const body = content.slice(fmMatch[0].length).trim();
  return { meta, body };
}

function slugify(filename) {
  return filename.replace(/\.md$/, '');
}

// ─── Reading Time ─────────────────────────────────────────────────

function readingTime(text) {
  return Math.ceil(text.split(/\s+/).length / 200);
}

// ─── Schema Generators ───────────────────────────────────────────

function articleSchema(title, description, slug, date) {
  return {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    "headline": title,
    "description": description,
    "author": {
      "@type": "Person",
      "@id": "https://victorvalentineromo.com/#person",
      "name": "Victor Valentine Romo",
      "url": "https://victorvalentineromo.com"
    },
    "publisher": {
      "@type": "Organization",
      "@id": "https://tattooremovalnear.com/#organization",
      "name": "Tattoo Removal Near",
      "url": "https://tattooremovalnear.com",
      "sameAs": SAME_AS_ARRAY
    },
    "datePublished": date,
    "dateModified": date,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://tattooremovalnear.com/articles/${slug}.html`
    }
  };
}

function breadcrumbSchema(title, slug) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://tattooremovalnear.com" },
      { "@type": "ListItem", "position": 2, "name": "Articles", "item": "https://tattooremovalnear.com/articles.html" },
      { "@type": "ListItem", "position": 3, "name": title, "item": `https://tattooremovalnear.com/articles/${slug}.html` }
    ]
  };
}

// ─── HTML Template ────────────────────────────────────────────────

function buildArticleHTML(title, description, body, slug, date, keywords) {
  const htmlBody = marked(body);
  const minutes = readingTime(body);
  const isoDate = (date || '2026-01-19').replace(/\./g, '-');

  const schemas = [
    articleSchema(title, description, slug, isoDate),
    breadcrumbSchema(title, slug)
  ];
  const schemaScripts = schemas.map(s =>
    `    <script type="application/ld+json">\n${JSON.stringify(s, null, 6)}\n    </script>`
  ).join('\n');

  const safeTitle = title.replace(/"/g, '&quot;');
  const safeDesc = (description || '').replace(/"/g, '&quot;');

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${safeTitle} | Tattoo Removal Near</title>
    <meta name="description" content="${safeDesc}">
    <meta name="author" content="Victor Valentine Romo">
    <meta name="robots" content="index, follow">
    <meta property="og:title" content="${safeTitle}">
    <meta property="og:description" content="${safeDesc}">
    <meta property="og:type" content="article">
    <meta property="og:url" content="https://tattooremovalnear.com/articles/${slug}.html">
    <meta property="og:site_name" content="Tattoo Removal Near">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${safeTitle}">
    <meta name="twitter:description" content="${safeDesc}">
    <link rel="canonical" href="https://tattooremovalnear.com/articles/${slug}.html">
${headIncludes}
${schemaScripts}
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
        <span>${title}</span>
      </div>
    </div>

    <div class="container">
      <div class="article-body">
        <header style="margin-bottom:var(--space-8);">
          <div style="display:flex; align-items:center; gap:var(--space-3); margin-bottom:var(--space-4);">
            <span class="badge badge-teal">${minutes} min read</span>
            ${keywords ? `<span class="badge badge-muted">${keywords.split(',')[0].trim()}</span>` : ''}
          </div>
          <h1>${title}</h1>
          ${description ? `<p style="font-size:var(--text-lg); margin-top:var(--space-4);">${description}</p>` : ''}
        </header>

        <article>
          ${htmlBody}
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

// ─── Process All Articles ─────────────────────────────────────────

function processArticles() {
  if (!fs.existsSync(ARTICLES_DIR)) {
    console.log('No Articles directory found.');
    return [];
  }

  fs.mkdirSync(DIST_DIR, { recursive: true });

  const files = fs.readdirSync(ARTICLES_DIR)
    .filter(f => f.endsWith('.md') && !SKIP_FILES.includes(f));

  const metadata = [];

  for (const file of files) {
    const raw = fs.readFileSync(path.join(ARTICLES_DIR, file), 'utf-8');
    const { meta, body } = parseFrontmatter(raw);

    const slug = meta.slug || slugify(file);
    const title = meta.title || slug.replace(/-/g, ' ');
    const description = meta.description || meta.focus_keyword || '';
    const date = (meta.date || meta.created || '2026.01.19').replace(/\./g, '-');
    const keywords = meta.keywords || meta.focus_keyword || '';

    const html = buildArticleHTML(title, description, body, slug, date, keywords);
    fs.writeFileSync(path.join(DIST_DIR, `${slug}.html`), html);
    console.log(`  Built: articles/${slug}.html`);

    metadata.push({ slug, title, description, date, keywords });
  }

  return metadata;
}

module.exports = { processArticles, parseFrontmatter, buildArticleHTML };

if (require.main === module) {
  const articles = processArticles();
  console.log(`\nProcessed ${articles.length} articles.`);
}
