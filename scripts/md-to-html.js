const fs = require('fs');
const path = require('path');
const { marked } = require('marked');

const SKIP_FILES = ['README.md', '_brief.md', '_content-stack.md'];
const ARTICLES_DIR = path.join(__dirname, '..', 'Articles');
const DIST_DIR = path.join(__dirname, '..', 'dist', 'articles');

const ENTITY_DOMAINS = [
  'scalewithsearch.com',
  'victorvalentineromo.com',
  'aifirstsearch.com',
  'browserprompt.com',
  'creatinepedia.com',
  'polytraffic.com',
  'tattooremovalnear.com',
  'comicstripai.com',
  'tattooremovalnear.com',
  'aipaypercrawl.com',
  'b2bvic.com',
  'seobyrole.com',
  'quickfixseo.com'
];

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

function buildArticleHTML(title, description, body, slug, date) {
  const htmlBody = marked(body);
  const entityLinks = ENTITY_DOMAINS.map(d => `    <link rel="me" href="https://${d}" />`).join('\n');

  const jsonLd = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": title,
    "description": description,
    "author": {
      "@type": "Person",
      "name": "Victor Valentine Romo",
      "url": "https://victorvalentineromo.com"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Tattoo Removal Near Me",
      "url": "https://tattooremovalnear.com"
    },
    "datePublished": date || "2026-01-19",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://tattooremovalnear.com/articles/${slug}.html`
    }
  }, null, 2);

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${title} | Tattoo Removal Near Me</title>
    <meta name="description" content="${description}" />
    <meta name="author" content="Victor Valentine Romo" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:type" content="article" />
    <meta property="og:url" content="https://tattooremovalnear.com/articles/${slug}.html" />
    <meta property="og:site_name" content="Tattoo Removal Near Me" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${title}" />
    <meta name="twitter:description" content="${description}" />
    <link rel="canonical" href="https://tattooremovalnear.com/articles/${slug}.html" />
${entityLinks}
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
      tailwind.config = {
        theme: {
          extend: {
            colors: {
              emerald: {
                50: '#ecfdf5', 100: '#d1fae5', 200: '#a7f3d0', 300: '#6ee7b7',
                400: '#34d399', 500: '#10b981', 600: '#059669', 700: '#047857',
                800: '#065f46', 900: '#064e3b', 950: '#022c22'
              }
            }
          }
        }
      }
    </script>
    <script type="application/ld+json">
${jsonLd}
    </script>
</head>
<body class="bg-white text-gray-900 antialiased">

    <!-- Nav -->
    <nav class="border-b border-gray-200 bg-white">
        <div class="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
            <a href="/" class="text-xl font-bold text-rose-600 hover:text-rose-700 transition-colors">Tattoo Removal Near Me</a>
            <div class="flex gap-6 text-sm font-medium text-gray-600">
                <a href="/articles.html" class="hover:text-rose-600 transition-colors">Articles</a>
                <a href="/#about" class="hover:text-rose-600 transition-colors">About</a>
            </div>
        </div>
    </nav>

    <!-- Article -->
    <main class="max-w-4xl mx-auto px-6 py-12">
        <article class="prose prose-lg prose-gray max-w-none prose-headings:text-gray-900 prose-h1:text-3xl prose-h1:font-bold prose-h2:text-2xl prose-h2:font-semibold prose-h2:mt-12 prose-h2:mb-4 prose-h3:text-xl prose-h3:font-medium prose-h3:mt-8 prose-h3:mb-3 prose-a:text-rose-600 prose-a:no-underline hover:prose-a:underline prose-strong:text-gray-900 prose-blockquote:border-rose-500 prose-blockquote:bg-rose-50 prose-blockquote:py-1 prose-blockquote:px-4 prose-blockquote:rounded-r-lg">
            ${htmlBody}
        </article>

        <div class="mt-16 pt-8 border-t border-gray-200">
            <a href="/articles.html" class="text-rose-600 hover:text-rose-700 font-medium">&larr; All Articles</a>
        </div>
    </main>

    <!-- Footer -->
    <footer class="border-t border-gray-200 bg-gray-50 mt-16">
        <div class="max-w-4xl mx-auto px-6 py-8 text-center text-sm text-gray-500">
            &copy; 2026 Tattoo Removal Near Me. A <a href="https://scalewithsearch.com" class="text-rose-600 hover:underline">Scale With Search</a> property.
        </div>
    </footer>

</body>
</html>`;
}

function processArticles() {
  if (!fs.existsSync(ARTICLES_DIR)) {
    console.log('No Articles directory found.');
    return [];
  }

  fs.mkdirSync(DIST_DIR, { recursive: true });

  const files = fs.readdirSync(ARTICLES_DIR).filter(f => f.endsWith('.md') && !SKIP_FILES.includes(f));
  const metadata = [];

  for (const file of files) {
    const raw = fs.readFileSync(path.join(ARTICLES_DIR, file), 'utf-8');
    const { meta, body } = parseFrontmatter(raw);

    const slug = meta.slug || slugify(file);
    const title = meta.title || slug.replace(/-/g, ' ');
    const description = meta.description || meta.focus_keyword || '';
    const date = (meta.date || meta.created || '2026.01.19').replace(/\./g, '-');
    const keywords = meta.keywords || meta.focus_keyword || '';

    const html = buildArticleHTML(title, description, body, slug, date);
    fs.writeFileSync(path.join(DIST_DIR, `${slug}.html`), html);
    console.log(`  Built: articles/${slug}.html`);

    metadata.push({ slug, title, description, date, keywords });
  }

  return metadata;
}

module.exports = { processArticles };

if (require.main === module) {
  const articles = processArticles();
  console.log(`\nProcessed ${articles.length} articles.`);
}
