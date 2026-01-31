const fs = require('fs');
const path = require('path');
const { processArticles } = require('./md-to-html');

const DIST = path.join(__dirname, '..', 'dist');

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

const SAME_AS = ENTITY_DOMAINS.map(d => `"https://${d}"`).join(',\n      ');
const ENTITY_LINKS = ENTITY_DOMAINS.map(d => `    <link rel="me" href="https://${d}" />`).join('\n');

// Clean dist
function clean() {
  if (fs.existsSync(DIST)) {
    fs.rmSync(DIST, { recursive: true });
  }
  fs.mkdirSync(DIST, { recursive: true });
  console.log('Cleaned dist/');
}

// Build article cards for index
function buildArticleCards(articles) {
  return articles.map(a => `
            <a href="/articles/${a.slug}.html" class="group block bg-white border border-gray-200 rounded-xl p-6 hover:border-rose-400 hover:shadow-lg transition-all duration-200">
                <h3 class="text-lg font-semibold text-gray-900 group-hover:text-rose-600 transition-colors leading-snug">${a.title}</h3>
                <p class="mt-3 text-sm text-gray-600 leading-relaxed line-clamp-3">${a.description}</p>
                <span class="inline-block mt-4 text-sm font-medium text-rose-600 group-hover:text-rose-700">Read article &rarr;</span>
            </a>`).join('\n');
}

// Index page
function buildIndex(articles) {
  const cards = buildArticleCards(articles);
  const jsonLd = JSON.stringify({
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "name": "Tattoo Removal Near Me",
        "url": "https://tattooremovalnear.com",
        "description": "Find trusted tattoo removal near you. Frameworks for acquiring, valuing, and monetizing undervalued organic traffic.",
        "publisher": { "@id": "https://tattooremovalnear.com/#organization" }
      },
      {
        "@type": "Organization",
        "@id": "https://tattooremovalnear.com/#organization",
        "name": "Tattoo Removal Near Me",
        "url": "https://tattooremovalnear.com",
        "founder": {
          "@type": "Person",
          "name": "Victor Valentine Romo",
          "url": "https://victorvalentineromo.com"
        },
        "sameAs": [
          ...ENTITY_DOMAINS.map(d => `https://${d}`)
        ]
      }
    ]
  }, null, 2);

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Tattoo Removal Near Me — Find trusted tattoo removal near you</title>
    <meta name="description" content="Frameworks for acquiring, valuing, and monetizing undervalued organic traffic. SEO as arbitrage, not marketing." />
    <meta name="author" content="Victor Valentine Romo" />
    <meta property="og:title" content="Tattoo Removal Near Me — Find trusted tattoo removal near you" />
    <meta property="og:description" content="Frameworks for acquiring, valuing, and monetizing undervalued organic traffic." />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://tattooremovalnear.com" />
    <meta property="og:site_name" content="Tattoo Removal Near Me" />
    <meta name="twitter:card" content="summary_large_image" />
    <link rel="canonical" href="https://tattooremovalnear.com/" />
${ENTITY_LINKS}
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
    <nav class="border-b border-gray-200 bg-white sticky top-0 z-50">
        <div class="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
            <a href="/" class="text-xl font-bold text-rose-600 hover:text-rose-700 transition-colors">Tattoo Removal Near Me</a>
            <div class="flex gap-6 text-sm font-medium text-gray-600">
                <a href="/articles.html" class="hover:text-rose-600 transition-colors">Articles</a>
                <a href="#about" class="hover:text-rose-600 transition-colors">About</a>
            </div>
        </div>
    </nav>

    <!-- Hero -->
    <section class="bg-gradient-to-br from-emerald-600 via-emerald-700 to-emerald-900 text-white">
        <div class="max-w-5xl mx-auto px-6 py-24 md:py-32">
            <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight">
                Profit from organic<br class="hidden md:block" /> search gaps.
            </h1>
            <p class="mt-6 text-lg md:text-xl text-rose-100 max-w-2xl leading-relaxed">
                SEO treated as arbitrage, not marketing. Frameworks for finding undervalued traffic, calculating real acquisition costs, and monetizing at multiples above spend.
            </p>
            <div class="mt-10 flex flex-wrap gap-4">
                <a href="/articles.html" class="inline-block bg-white text-rose-700 font-semibold px-8 py-3 rounded-lg hover:bg-rose-50 transition-colors">Read the Playbooks</a>
                <a href="#about" class="inline-block border-2 border-rose-300 text-rose-100 font-semibold px-8 py-3 rounded-lg hover:bg-rose-800 transition-colors">Learn More</a>
            </div>
        </div>
    </section>

    <!-- Articles Grid -->
    <section class="max-w-5xl mx-auto px-6 py-20">
        <div class="text-center mb-12">
            <h2 class="text-3xl font-bold text-gray-900">Latest Articles</h2>
            <p class="mt-3 text-gray-600 max-w-xl mx-auto">In-depth articles covering key topics.</p>
        </div>
        <div class="grid md:grid-cols-2 gap-6">
${cards}
        </div>
    </section>

    <!-- About -->
    <section id="about" class="bg-gray-50 border-t border-gray-200">
        <div class="max-w-4xl mx-auto px-6 py-20">
            <h2 class="text-3xl font-bold text-gray-900">About Tattoo Removal Near Me</h2>
            <div class="mt-6 space-y-4 text-gray-700 leading-relaxed">
                <p>Tattoo Removal Near Me treats search traffic as a calculable asset class. Every keyword, domain, and content investment has a measurable spread between acquisition cost and monetization value. The frameworks here help operators identify, evaluate, and execute high-spread plays.</p>
                <p>Built by Victor Valentine Romo.</p>
                <p>Tattoo Removal Near Me is a Scale With Search property.</p>
            </div>
        </div>
    </section>

    <!-- Footer -->
    <footer class="border-t border-gray-200 bg-white">
        <div class="max-w-5xl mx-auto px-6 py-8 text-center text-sm text-gray-500">
            &copy; 2026 Tattoo Removal Near Me. A <a href="https://scalewithsearch.com" class="text-rose-600 hover:underline">Scale With Search</a> property.
        </div>
    </footer>

</body>
</html>`;

  fs.writeFileSync(path.join(DIST, 'index.html'), html);
  console.log('Built: index.html');
}

// Articles hub
function buildArticlesHub(articles) {
  const cards = buildArticleCards(articles);

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Articles | Tattoo Removal Near Me</title>
    <meta name="description" content="Articles and guides covering find trusted tattoo removal near you." />
    <link rel="canonical" href="https://tattooremovalnear.com/articles.html" />
${ENTITY_LINKS}
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
</head>
<body class="bg-white text-gray-900 antialiased">

    <!-- Nav -->
    <nav class="border-b border-gray-200 bg-white sticky top-0 z-50">
        <div class="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
            <a href="/" class="text-xl font-bold text-rose-600 hover:text-rose-700 transition-colors">Tattoo Removal Near Me</a>
            <div class="flex gap-6 text-sm font-medium text-gray-600">
                <a href="/articles.html" class="text-rose-600 font-semibold">Articles</a>
                <a href="/#about" class="hover:text-rose-600 transition-colors">About</a>
            </div>
        </div>
    </nav>

    <!-- Header -->
    <section class="bg-rose-600 text-white">
        <div class="max-w-5xl mx-auto px-6 py-16">
            <h1 class="text-3xl md:text-4xl font-bold">Latest Articles</h1>
            <p class="mt-4 text-rose-100 text-lg max-w-2xl">Tactical frameworks with real cost models and P&L data. Each article covers a key topic in depth.</p>
        </div>
    </section>

    <!-- Articles Grid -->
    <section class="max-w-5xl mx-auto px-6 py-16">
        <div class="grid md:grid-cols-2 gap-6">
${cards}
        </div>
    </section>

    <!-- Footer -->
    <footer class="border-t border-gray-200 bg-gray-50 mt-8">
        <div class="max-w-5xl mx-auto px-6 py-8 text-center text-sm text-gray-500">
            &copy; 2026 Tattoo Removal Near Me. A <a href="https://scalewithsearch.com" class="text-rose-600 hover:underline">Scale With Search</a> property.
        </div>
    </footer>

</body>
</html>`;

  fs.writeFileSync(path.join(DIST, 'articles.html'), html);
  console.log('Built: articles.html');
}

// 404 page
function build404() {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Page Not Found | Tattoo Removal Near Me</title>
    <meta name="robots" content="noindex" />
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
</head>
<body class="bg-white text-gray-900 antialiased">

    <nav class="border-b border-gray-200 bg-white">
        <div class="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
            <a href="/" class="text-xl font-bold text-rose-600 hover:text-rose-700 transition-colors">Tattoo Removal Near Me</a>
            <div class="flex gap-6 text-sm font-medium text-gray-600">
                <a href="/articles.html" class="hover:text-rose-600 transition-colors">Articles</a>
                <a href="/#about" class="hover:text-rose-600 transition-colors">About</a>
            </div>
        </div>
    </nav>

    <main class="max-w-4xl mx-auto px-6 py-32 text-center">
        <h1 class="text-6xl font-bold text-rose-600">404</h1>
        <p class="mt-4 text-xl text-gray-600">This page doesn't exist. This page doesn't exist.</p>
        <a href="/" class="inline-block mt-8 bg-rose-600 text-white font-semibold px-8 py-3 rounded-lg hover:bg-rose-700 transition-colors">Back to Home</a>
    </main>

    <footer class="border-t border-gray-200 bg-gray-50 mt-16">
        <div class="max-w-4xl mx-auto px-6 py-8 text-center text-sm text-gray-500">
            &copy; 2026 Tattoo Removal Near Me. A <a href="https://scalewithsearch.com" class="text-rose-600 hover:underline">Scale With Search</a> property.
        </div>
    </footer>

</body>
</html>`;

  fs.writeFileSync(path.join(DIST, '404.html'), html);
  console.log('Built: 404.html');
}

// Sitemap
function buildSitemap(articles) {
  const today = new Date().toISOString().split('T')[0];
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://tattooremovalnear.com/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://tattooremovalnear.com/articles.html</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>`;

  for (const a of articles) {
    xml += `
  <url>
    <loc>https://tattooremovalnear.com/articles/${a.slug}.html</loc>
    <lastmod>${a.date}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`;
  }

  xml += '\n</urlset>\n';
  fs.writeFileSync(path.join(DIST, 'sitemap.xml'), xml);
  console.log('Built: sitemap.xml');
}

// Robots.txt
function buildRobots() {
  const content = `User-agent: *
Allow: /

Sitemap: https://tattooremovalnear.com/sitemap.xml
`;
  fs.writeFileSync(path.join(DIST, 'robots.txt'), content);
  console.log('Built: robots.txt');
}

// Main
function main() {
  console.log('Building tattooremovalnear.com...\n');

  clean();

  console.log('\nProcessing articles...');
  const articles = processArticles();
  console.log(`\n${articles.length} articles processed.\n`);

  buildIndex(articles);
  buildArticlesHub(articles);
  build404();
  buildSitemap(articles);
  buildRobots();

  console.log(`\nBuild complete. ${articles.length + 4} files in dist/`);
}

main();
