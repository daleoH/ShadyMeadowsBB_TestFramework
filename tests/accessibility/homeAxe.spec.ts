import { test, expect } from '@playwright/test';
import { runAxeScan, runA11yScan } from '../../utils/axeHelper';
import { HomePage } from '../page-objects/HomePage';

test.describe('review rooms tests', () => {
    let homePage: HomePage;

  test.beforeEach(async ({ page, browserName }) => {
    test.skip(browserName !== 'chromium', 'Accessibility tests are only stable in Chromium');
    homePage = new HomePage(page);
    await homePage.navigateToHome();
  });

  test.afterEach(async ({ page }) => {
    await page.close();
  });
test('Home page accessibility check', async ({ page }) => {
  await runAxeScan(page);
});

test('Accessibility scan on key sections', async ({ page }) => {
  await runA11yScan(page, '#navbarNav');
  await runA11yScan(page, '#contact');
  await runA11yScan(page, '#location');
  await runA11yScan(page, '#rooms');
 });

 test('Accessibility scan after opening the react date picker', async ({ page }) => {
  await homePage.checkIn.click();

  await runA11yScan(page, '.react-datepicker-popper');
 });

  test('Accessibility scan after clicking book room', async ({ page }) => {
  await homePage.bookRoomButton();

  await runAxeScan(page);
 });
})