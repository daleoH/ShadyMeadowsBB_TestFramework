import { test, expect } from '@playwright/test';
import { runAxeScan, runA11yScan } from '../../utils/axeHelper';
import { HomePage } from '../page-objects/HomePage';

test('Home page accessibility check', async ({ page }) => {
  const homePage = new HomePage(page);
  await homePage.navigateToHome();

  await runAxeScan(page);
});

test('Accessibility scan on key sections', async ({ page }) => {
  const homePage = new HomePage(page);
  await homePage.navigateToHome();

  await runA11yScan(page, '#navbarNav');
  await runA11yScan(page, '#contact');
  await runA11yScan(page, '#location');
  await runA11yScan(page, '#rooms');
 });

 test('Accessibility scan after opening the react date picker', async ({ page }) => {
  const homePage = new HomePage(page);
  await homePage.navigateToHome();
  await homePage.checkIn.click();

  await runA11yScan(page, '.react-datepicker-popper');
 });

  test('Accessibility scan after clicking book room', async ({ page }) => {
  const homePage = new HomePage(page);
  await homePage.navigateToHome();
  await homePage.bookRoomButton();

  await runAxeScan(page);
 });