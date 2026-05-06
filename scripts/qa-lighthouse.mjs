import lighthouse from 'lighthouse';
import * as chromeLauncher from 'chrome-launcher';
import fs from 'node:fs/promises';

const baseURL = process.env.QA_BASE_URL || 'https://ebikesvergelijker.nl/';
const routes = [
  { name: 'home', path: '#/' },
  { name: 'e-bike-list', path: '#/e-bikes' },
  { name: 'compare', path: '#/vergelijk' },
  { name: 'reviews', path: '#/reviews' },
  { name: 'contact', path: '#/contact' },
];

const routeUrl = (path) => new URL(path, baseURL).toString();

async function main() {
  await fs.mkdir('reports/lighthouse', { recursive: true });

  const chrome = await chromeLauncher.launch({
    chromeFlags: ['--headless=new', '--disable-gpu', '--no-sandbox'],
  });

  const results = [];

  try {
    for (const route of routes) {
      const url = routeUrl(route.path);
      const runnerResult = await lighthouse(url, {
        port: chrome.port,
        output: ['json', 'html'],
        logLevel: 'error',
        onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
      });

      if (!runnerResult) {
        throw new Error(`Lighthouse returned no result for ${url}`);
      }

      const jsonReport = Array.isArray(runnerResult.report)
        ? runnerResult.report[0]
        : runnerResult.report;
      const htmlReport = Array.isArray(runnerResult.report)
        ? runnerResult.report[1]
        : runnerResult.report;

      await fs.writeFile(`reports/lighthouse/${route.name}.json`, jsonReport);
      await fs.writeFile(`reports/lighthouse/${route.name}.html`, htmlReport);

      const categories = runnerResult.lhr.categories;
      results.push({
        route: route.name,
        url,
        performance: score(categories.performance),
        accessibility: score(categories.accessibility),
        bestPractices: score(categories['best-practices']),
        seo: score(categories.seo),
        reportJson: `reports/lighthouse/${route.name}.json`,
        reportHtml: `reports/lighthouse/${route.name}.html`,
      });
    }
  } finally {
    try {
      await chrome.kill();
    } catch (error) {
      console.warn(`Warning: Chrome cleanup failed: ${error.message}`);
    }
  }

  const summary = {
    generatedAt: new Date().toISOString(),
    baseURL,
    routesTested: results.length,
    results,
  };

  await fs.writeFile('reports/lighthouse-summary.json', JSON.stringify(summary, null, 2));
  await fs.writeFile('reports/lighthouse-summary.md', toMarkdown(summary));

  console.log(
    JSON.stringify(
      {
        routesTested: summary.routesTested,
        report: 'reports/lighthouse-summary.md',
        raw: 'reports/lighthouse-summary.json',
      },
      null,
      2
    )
  );

  const minPerformance = Number(process.env.QA_MIN_LIGHTHOUSE_PERFORMANCE || 0);
  if (
    minPerformance > 0 &&
    results.some((result) => Number(result.performance) < minPerformance)
  ) {
    process.exitCode = 1;
  }
}

function score(category) {
  return Math.round((category?.score ?? 0) * 100);
}

function toMarkdown(summary) {
  const lines = [
    '# Lighthouse Summary',
    '',
    `Generated: ${summary.generatedAt}`,
    '',
    `Base URL: ${summary.baseURL}`,
    '',
    '| Route | Performance | Accessibility | Best Practices | SEO |',
    '| --- | ---: | ---: | ---: | ---: |',
  ];

  for (const result of summary.results) {
    lines.push(
      `| ${result.route} | ${result.performance} | ${result.accessibility} | ${result.bestPractices} | ${result.seo} |`
    );
  }

  lines.push('');
  lines.push('## Reports');
  lines.push('');

  for (const result of summary.results) {
    lines.push(`- ${result.route}: ${result.reportHtml}, ${result.reportJson}`);
  }

  lines.push('');
  lines.push('## Notes');
  lines.push('');
  lines.push('- Set `QA_BASE_URL` to test another target.');
  lines.push('- Set `QA_MIN_LIGHTHOUSE_PERFORMANCE` to fail when any route falls below a minimum performance score.');
  lines.push('');

  return `${lines.join('\n')}\n`;
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
