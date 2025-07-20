import { Page } from '@playwright/test';

export async function loginAsAdmin(page: Page) {
  await page.goto('https://automationintesting.online/');
  await page.getByRole('link', { name: 'Admin', exact: true }).click();
  await page.getByRole('textbox', { name: 'Username' }).fill('admin');
  await page.getByRole('textbox', { name: 'Password' }).fill('password');
  await page.getByRole('button', { name: 'Login' }).click();
}