import { Page, expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

export async function runAxeScan(page: Page) {
  const results = await new AxeBuilder({ page }).analyze();

  if (results.violations.length > 0) {
    console.log('Accessibility Violations:', results.violations.length);
    for (const violation of results.violations) {
      console.log(`${violation.id} - ${violation.description}`);
      console.log(`Help: ${violation.helpUrl}`);
      violation.nodes.forEach((node, i) => {
        console.log(`  ${i + 1}. ${node.html}`);
      });
    }
  } else {
    console.log('✅ No accessibility violations found.');
  }

  return results;
}

export async function runA11yScan(page: Page, selector: string | string[]) {
  const results = await new AxeBuilder({ page })
    .include(selector)
    .withTags(['wcag2a', 'wcag2aa']) // Include WCAG 2.0 A and AA standards
    .analyze();
  if (results.violations.length > 0) {
    console.log('Accessibility Violations:', results.violations.length);
    for (const violation of results.violations) {
      console.log(`${violation.id} - ${violation.description}`);
      console.log(`Help: ${violation.helpUrl}`);
      violation.nodes.forEach((node, i) => {
        console.log(`  ${i + 1}. ${node.html}`);
      });
    }
  } else {
    console.log('✅ No accessibility violations found.');
  }

  return results;
}