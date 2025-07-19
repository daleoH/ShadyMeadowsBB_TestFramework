import { test, expect } from '@playwright/test';
import { HomePage } from '../page-objects/HomePage';
import { BookingPage } from '../page-objects/BookingPage';

test.describe('Hotel Booking UI Tests', () => {
  let homePage: HomePage;
  let bookingPage: BookingPage;

  test.beforeEach(async ({ page,  }) => {
    homePage = new HomePage(page)
    bookingPage = new BookingPage(page);
    await homePage.navigateToHome();
  });
  

  test('should display hotel information correctly', async ({ page }) => {
    await expect(homePage.roomName).toBeVisible();
    await expect(homePage.roomDescription).toBeVisible();
    //await expect(homePage.roomCards).toHaveCount(3); // Assuming 3 rooms
    
    // Verify first room has price displayed
    const price = await homePage.getFirstRoomPrice();
    expect(price).toMatch(/£\d+/);
  });

  test('should complete successful booking workflow', async ({ page }) => {
    // Click book button for first room
    //await homePage.bookFirstRoom();
    
    //Fill in checking dates

    const checkinCheckoutData = {
      checkin: '10/11/2025',
      checkout: '11/11/2025',
    };
    await bookingPage.fillCheckinCheckoutDates(checkinCheckoutData.checkin, checkinCheckoutData.checkout);

    await page.getByRole('button', { name: 'Check Availability' }).click();

    //Click the first room
    await homePage.bookFirstRoom();

    await page.getByRole('button', { name: 'Reserve Now' }).click();

    // Fill booking form
    const bookingData = {
      firstname: 'John',
      lastname: 'Doe',
      email: 'john.doe@example.com',
      phone: '01234567890'
    };
    
    await bookingPage.fillBookingForm(bookingData);
    await bookingPage.submitBooking();
    
    // Verify booking confirmation
    await expect(bookingPage.confirmationMessage).toBeVisible();
    await expect(page.locator('text=Booking Confirmed')).toBeVisible();
  });

  test('should show validation errors for invalid booking data', async ({ page }) => {
    await homePage.bookFirstRoom();
    
    // Submit form with invalid data
    const invalidData = {
      checkin: '2025-08-03', // checkout before checkin
      checkout: '2025-08-01',
      firstname: '',
      lastname: 'Doe',
      email: 'invalid-email',
      phone: '123' // too short
    };
    
    await bookingPage.fillBookingForm(invalidData);
    await bookingPage.submitBooking();
    
    // Verify validation errors
    await expect(page.locator('.error-message')).toBeVisible();
    await expect(page.locator('text=must not be empty')).toBeVisible();
  });

  test('should handle date range validation', async ({ page }) => {
    await homePage.bookFirstRoom();
    
    // Test past dates
    const pastDateData = {
      checkin: '2024-10-01',
      checkout: '2024-10-02',
      firstname: 'John',
      lastname: 'Doe',
      email: 'john@example.com',
      phone: '01234567890'
    };
    
    await bookingPage.fillBookingForm(pastDateData);
    await bookingPage.submitBooking();
    
    await expect(page.locator('text=must be in the future')).toBeVisible();
  });
});