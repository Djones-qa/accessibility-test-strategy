/**
 * Pa11y CLI accessibility audit script.
 * Runs WCAG 2.1 AA audits against all pages and generates HTML reports.
 * Exits with code 1 if any violations are found (CI gate).
 */
import pa11y, { Pa11yIssue } from 'pa11y';
import * as fs from 'fs';
import * as path from 'path';

interface AuditTarget {
  name: string;
  url: string;
}

const TARGETS: AuditTarget[] = [
  { name: 'checkout', url: 'http://localhost:3000/checkout.html' },
  { name: 'products', url: 'http://localhost:3000/products.html' },
  { name: 'home', url: 'http://localhost:3000/index.html' },
];

const REPORTS_DIR = path.join(process.cwd(), 'pa11y-reports');

const PA11Y_OPTIONS = {
  standard: 'WCAG2AA' as const,
  timeout: 30000,
  wait: 1000,
  chromeLaunchConfig: {
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  },
};

async function runAudit(target: AuditTarget): Promise<number> {
  console.log(`\n🔍 Auditing: ${target.name} (${target.url})`);

  try {
    const results = await pa11y(target.url, PA11Y_OPTIONS);

    const errors = results.issues.filter((i) => i.type === 'error');
    const warnings = results.issues.filter((i) => i.type === 'warning');
    const notices = results.issues.filter((i) => i.type === 'notice');

    console.log(`  ✅ Errors:   ${errors.length}`);
    console.log(`  ⚠️  Warnings: ${warnings.length}`);
    console.log(`  ℹ️  Notices:  ${notices.length}`);

    if (errors.length > 0) {
      console.log('\n  ❌ Accessibility Errors:');
      errors.forEach((issue: Pa11yIssue, idx: number) => {
        console.log(`\n  [${idx + 1}] ${issue.code}`);
        console.log(`      Message: ${issue.message}`);
        console.log(`      Context: ${issue.context}`);
        console.log(`      Selector: ${issue.selector}`);
      });
    }

    // Generate HTML report
    const reportPath = path.join(REPORTS_DIR, `${target.name}-report.json`);
    fs.writeFileSync(reportPath, JSON.stringify(results, null, 2), 'utf-8');
    console.log(`  📄 Report saved: ${reportPath}`);

    return errors.length;
  } catch (err) {
    console.error(`  ❌ Failed to audit ${target.url}:`, err);
    return 1;
  }
}

async function main(): Promise<void> {
  console.log('🚀 Pa11y WCAG 2.1 AA Accessibility Audit');
  console.log('==========================================');

  // Ensure reports directory exists
  if (!fs.existsSync(REPORTS_DIR)) {
    fs.mkdirSync(REPORTS_DIR, { recursive: true });
  }

  let totalErrors = 0;

  for (const target of TARGETS) {
    const errorCount = await runAudit(target);
    totalErrors += errorCount;
  }

  console.log('\n==========================================');
  console.log(`📊 Audit Complete — Total Errors: ${totalErrors}`);

  if (totalErrors > 0) {
    console.log('❌ Accessibility gate FAILED. Fix violations before merging.');
    process.exit(1);
  } else {
    console.log('✅ All pages pass WCAG 2.1 AA accessibility audit.');
    process.exit(0);
  }
}

main().catch((err) => {
  console.error('Unexpected error:', err);
  process.exit(1);
});
