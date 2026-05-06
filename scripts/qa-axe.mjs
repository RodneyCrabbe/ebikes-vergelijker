import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import fs from 'node:fs/promises';

const baseURL = process.env.QA_BASE_URL || 'https://ebikesvergelijker.nl/';

const routes = [
  { name: 'home', path: '#/' },
  { name: 'e-bike-list', path: '#/e-bikes' },
  { name: 'compare', path: '#/vergelijk' },
  { name: 'reviews', path: '#/reviews' },
  { name: 'appointments', path: '#/afspraak' },
  { name: 'login', path: '#/login' },
  { name: 'register', path: '#/registreer' },
  { name: 'contact', path: '#/contact' },
  { name: 'about', path: '#/over-ons' },
];

const routeUrl = (path) => new URL(path, baseURL).toString();

async function main() {
  await fs.mkdir('reports', { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
  const results = [];

  for (const route of routes) {
    const page = await context.newPage();
    const url = routeUrl(route.path);

    try {
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 });
      await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});

      const axe = await new AxeBuilder({ page }).analyze();
      results.push({
        route: route.name,
        url,
        error: null,
        violations: axe.violations,
        passes: axe.passes.length,
        incomplete: axe.incomplete.length,
        inapplicable: axe.inapplicable.length,
      });
    } catch (error) {
      results.push({
        route: route.name,
        url,
        error: error.message,
        violations: [],
        passes: 0,
        incomplete: 0,
        inapplicable: 0,
      });
    }

    await page.close();
  }

  await browser.close();

  const summary = {
    generatedAt: new Date().toISOString(),
    baseURL,
    routesTested: results.length,
    routesErrored: results.filter((result) => result.error).length,
    totalViolations: results.reduce((sum, result) => sum + result.violations.length, 0),
    results,
  };

  await fs.writeFile('reports/axe-results.json', JSON.stringify(summary, null, 2));
  await fs.writeFile('reports/accessibility-axe.md', toMarkdown(summary));

  console.log(
    JSON.stringify(
      {
        routesTested: summary.routesTested,
        routesErrored: summary.routesErrored,
        totalViolations: summary.totalViolations,
        report: 'reports/accessibility-axe.md',
        raw: 'reports/axe-results.json',
      },
      null,
      2
    )
  );

  if (summary.totalViolations > 0 && process.env.QA_FAIL_ON_A11Y === '1') {
    process.exitCode = 1;
  }
}

function toMarkdown(summary) {
  const lines = [
    '# Axe Accessibility Report',
    '',
    `Generated: ${summary.generatedAt}`,
    '',
    `Base URL: ${summary.baseURL}`,
    '',
    `Routes tested: ${summary.routesTested}`,
    '',
    `Total violation groups: ${summary.totalViolations}`,
    '',
    '## Results',
    '',
  ];

  for (const result of summary.results) {
    lines.push(`### ${result.route}`);
    lines.push('');
    lines.push(`URL: ${result.url}`);
    lines.push('');

    if (result.error) {
      lines.push(`Route error: ${result.error}`);
      lines.push('');
      continue;
    }

    lines.push(`Violation groups: ${result.violations.length}`);
    lines.push('');

    if (result.violations.length === 0) {
      lines.push('No Axe violations detected.');
      lines.push('');
      continue;
    }

    for (const violation of result.violations) {
      lines.push(`- ${violation.id} (${violation.impact || 'unknown'}): ${violation.help}`);
      lines.push(`  - Nodes affected: ${violation.nodes.length}`);
      lines.push(`  - Help: ${violation.helpUrl}`);
    }

    lines.push('');
  }

  lines.push('## Notes');
  lines.push('');
  lines.push('- Axe is automated coverage, not full WCAG certification.');
  lines.push('- Set `QA_BASE_URL` to test another target.');
  lines.push('- Set `QA_FAIL_ON_A11Y=1` to make violations fail CI.');
  lines.push('');

  return `${lines.join('\n')}\n`;
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
