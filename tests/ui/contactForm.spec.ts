import { test, expect } from '@playwright/test';
import { HomePage } from '../page-objects/HomePage';

test.describe('Contact Form Tests', () => {
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    await homePage.navigateToHome();
  });

  test('should submit contact form successfully', async ({ page }) => {
    const contactData = {
      name: 'Test User',
      email: 'test@example.com',
      phone: '01234567890',
      subject: 'Test Automation Inquiry',
      message: 'This is a test message for automation testing.'
    };

    await homePage.fillContactForm(contactData);
    await homePage.submitContact();

    await expect(page.locator('text=Thanks for getting in touch')).toBeVisible();
  });

  test('should validate required fields in contact form', async ({ page }) => {
    // Submit empty form
    await homePage.submitContact();
    
    // Check for validation messages for all required fields
    await expect(page.getByText('Email may not be blank')).toBeVisible();
    await expect(page.getByText('Phone may not be blank')).toBeVisible()
    await expect(page.getByText('Subject may not be blank')).toBeVisible();
    await expect(page.getByText('Name may not be blank')).toBeVisible();   
    await expect(page.getByText('Message may not be blank')).toBeVisible();
  });


  test('should validate email field when incorrect format', async ({ page }) => {
    const contactData = {
      name: 'Test User',
      email: 'test.example.com', // Invalid email format
      phone: '01234567890',
      subject: 'Test Automation Inquiry',
      message: 'This is a test message for automation testing.'
    };
    await homePage.fillContactForm(contactData);
    await homePage.submitContact();
    
    // Check for validation messages for all required fields
    await expect(page.getByText('must be a well-formed email address')).toBeVisible();
    await expect(page.getByText('Phone may not be blank')).not.toBeVisible()
    await expect(page.getByText('Subject may not be blank')).not.toBeVisible();
    await expect(page.getByText('Name may not be blank')).not.toBeVisible();   
    await expect(page.getByText('Message may not be blank')).not.toBeVisible();
  });

test.afterEach(async ({ page }) => {
    await page.close();
  });
});