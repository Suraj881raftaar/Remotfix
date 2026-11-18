import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import { defineConfig } from 'vite';
import { SITE_ROUTES, SITE_ORIGIN } from './src/data/routesMeta';

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function productionHardeningPlugin() {
  return {
    name: 'remotfix-production-hardening',
    closeBundle() {
      const distDir = path.resolve(__dirname, 'dist');
      if (!fs.existsSync(distDir)) return;

      // 1. Copy _headers and _redirects into dist/ for Cloudflare Pages
      for (const cfFile of ['_headers', '_redirects']) {
        const src = path.resolve(__dirname, cfFile);
        const dest = path.resolve(distDir, cfFile);
        if (fs.existsSync(src)) {
          fs.copyFileSync(src, dest);
        }
      }

      // 2. Strip non-production attachments/screenshots from dist/assets/aistudio/
      const aistudioDistDir = path.resolve(distDir, 'assets', 'aistudio');
      if (fs.existsSync(aistudioDistDir)) {
        for (const entry of fs.readdirSync(aistudioDistDir)) {
          if (entry.endsWith('.md') || entry.startsWith('Screenshot_')) {
            fs.unlinkSync(path.resolve(aistudioDistDir, entry));
          }
        }
      }

      // 3. Pre-render unique SEO HTML shells for each canonical route in dist/<route>/index.html
      const baseHtmlPath = path.resolve(distDir, 'index.html');
      if (!fs.existsSync(baseHtmlPath)) return;
      const baseHtml = fs.readFileSync(baseHtmlPath, 'utf-8');

      for (const route of SITE_ROUTES) {
        if (route.path === '/') continue;

        const canonicalUrl = `${SITE_ORIGIN}${route.path}`;
        const escapedTitle = escapeHtml(route.title);
        const escapedDesc = escapeHtml(route.description);

        const breadcrumbItems = [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: `${SITE_ORIGIN}/`,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: route.breadcrumbName,
            item: canonicalUrl,
          },
        ];

        const graphNodes: Record<string, unknown>[] = [
          {
            '@type': 'WebPage',
            '@id': `${canonicalUrl}#webpage`,
            url: canonicalUrl,
            name: route.title,
            description: route.description,
            isPartOf: { '@id': `${SITE_ORIGIN}/#website` },
            about: { '@id': `${SITE_ORIGIN}/#organization` },
            inLanguage: 'en',
          },
          {
            '@type': 'BreadcrumbList',
            '@id': `${canonicalUrl}#breadcrumb`,
            itemListElement: breadcrumbItems,
          },
        ];

        if (route.serviceName) {
          graphNodes.push({
            '@type': 'Service',
            name: route.serviceName,
            serviceType: route.serviceName,
            provider: { '@id': `${SITE_ORIGIN}/#organization` },
            areaServed: 'IN',
            url: canonicalUrl,
            description: route.description,
          });
        }

        const routeJsonLd = JSON.stringify(
          {
            '@context': 'https://schema.org',
            '@graph': graphNodes,
          },
          null,
          2
        ).replace(/</g, '\\u003c');

        const semanticSectionsHtml = route.sections
          .map(
            (sec) => `
          <section class="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-2">
            <h2 class="text-xl font-bold text-white">${escapeHtml(sec.heading)}</h2>
            <p class="text-sm text-slate-300 leading-relaxed">${escapeHtml(sec.body)}</p>
          </section>`
          )
          .join('\n');

        const semanticRootHtml = `<!--ROOT_START-->
      <div class="min-h-screen bg-[#090A0F] text-slate-100 px-6 py-12 max-w-5xl mx-auto">
        <header class="flex items-center justify-between border-b border-slate-800 pb-6 mb-10">
          <a href="/" class="flex items-center gap-3">
            <img src="/assets/brand/remotfix-logo.webp" alt="Remotfix - Remote IT Solutions &amp; Support" width="140" height="44" class="h-10 w-auto object-contain" />
            <span class="text-xs font-mono uppercase tracking-wider text-cyan-300">REMOTE IT SOLUTIONS &amp; SUPPORT</span>
          </a>
          <nav aria-label="Primary links" class="flex items-center gap-4 text-sm">
            <a href="/services" class="text-slate-200 hover:text-cyan-300">Services</a>
            <a href="/about" class="text-slate-200 hover:text-cyan-300">About</a>
            <a href="/contact" class="text-cyan-300 underline">support@remotfix.in</a>
          </nav>
        </header>
        <main class="space-y-8">
          <section class="space-y-3">
            <h1 class="text-4xl font-extrabold text-white tracking-tight">${escapeHtml(route.h1)}</h1>
            <p class="text-base text-slate-300 leading-relaxed">${escapeHtml(route.intro)}</p>
          </section>
          ${semanticSectionsHtml}
        </main>
      </div>
    <!--ROOT_END-->`;

        let routeHtml = baseHtml
          .replace(/<title>[\s\S]*?<\/title>/, `<title>${escapedTitle}</title>`)
          .replace(
            /<meta\s+name="description"[\s\S]*?\/>/,
            `<meta name="description" content="${escapedDesc}" />`
          )
          .replace(
            /<link rel="canonical" href="[^"]*"\s*\/>/,
            `<link rel="canonical" href="${canonicalUrl}" />`
          )
          .replace(
            /<meta property="og:url" content="[^"]*"\s*\/>/,
            `<meta property="og:url" content="${canonicalUrl}" />`
          )
          .replace(
            /<meta property="og:title" content="[^"]*"\s*\/>/,
            `<meta property="og:title" content="${escapedTitle}" />`
          )
          .replace(
            /<meta\s+property="og:description"[\s\S]*?\/>/,
            `<meta property="og:description" content="${escapedDesc}" />`
          )
          .replace(
            /<meta name="twitter:url" content="[^"]*"\s*\/>/,
            `<meta name="twitter:url" content="${canonicalUrl}" />`
          )
          .replace(
            /<meta name="twitter:title" content="[^"]*"\s*\/>/,
            `<meta name="twitter:title" content="${escapedTitle}" />`
          )
          .replace(
            /<meta\s+name="twitter:description"[\s\S]*?\/>/,
            `<meta name="twitter:description" content="${escapedDesc}" />`
          )
          .replace(
            /<script type="application\/ld\+json">[\s\S]*?<\/script>/,
            `<script type="application/ld+json">\n${routeJsonLd}\n    </script>`
          )
          .replace(/<!--ROOT_START-->[\s\S]*?<!--ROOT_END-->/, semanticRootHtml);

        const routeOutDir = path.resolve(distDir, route.path.replace(/^\//, ''));
        fs.mkdirSync(routeOutDir, { recursive: true });
        fs.writeFileSync(path.resolve(routeOutDir, 'index.html'), routeHtml, 'utf-8');
      }
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), productionHardeningPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    build: {
      sourcemap: false,
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
