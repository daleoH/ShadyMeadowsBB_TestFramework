import { test, expect } from '@playwright/test';
import { BookingPage } from '../page-objects/BookingPage';
import { generateBookingDates, formatDateRangeToISOString } from '../../utils/dateHelper';
import { HomePage } from '../page-objects/HomePage';
import { faker }  from '@faker-js/faker';

test.describe('User booking a room tests', () => {
    let bookingPage: BookingPage;
    let homePage: HomePage;

test.beforeEach(async ({ page, }) => {
    // Initialize page objects
    homePage = new HomePage(page)
    bookingPage = new BookingPage(page);
    // Navigate to the home page
    await homePage.navigateToHome();
  });

  test('Submit a valid booking and verify confirmation message', async ({ page }) => {

    //Arrange
    // Generate random dates
    const { checkInDate, checkOutDate } = generateBookingDates(30, 7);
    const expectedRange = formatDateRangeToISOString(checkInDate, checkOutDate);

    // Act 
    // Select the randomised date range
    await bookingPage.selectDateRange(checkInDate, checkOutDate);
    //check rooms that are available
    await homePage.checkAvailabilityButton.click();
    await page.waitForLoadState('networkidle');
    //click on first available room to book
    await homePage.bookRoomButton();
    await page.getByRole('button', { name: 'Reserve Now' }).click();
    // Fill booking form
    const bookingData = {
      firstname: faker.person.firstName(),
      lastname: faker.person.lastName(),
      email: faker.internet.email(),
      phone: faker.phone.number({ style: 'international' }),
    };
    // Fill the booking form with random data
    await bookingPage.fillBookingForm(bookingData);
    await bookingPage.reserveBooking();

    //Assertions
    // Verify booking confirmation
    await expect(bookingPage.confirmationMessage).toBeVisible();
    await expect(page.locator('text=Booking Confirmed')).toBeVisible();
    //retrieve the date range in the confirmation message
    const actualDateRange = await bookingPage.getConfirmationDateRange();
    // Assert that the displayed date range matches the expected range
    await expect(actualDateRange).toBe(expectedRange);  
  });

  test('Submit a booking with missing required fields and verify validation errors ', async ({ page }) => {
    
   // Arrange
    const { checkInDate, checkOutDate } = generateBookingDates(30, 7);
   //Act
// Select the randomised date range
    await bookingPage.selectDateRange(checkInDate, checkOutDate);
    //check rooms that are available
    await homePage.checkAvailabilityButton.click();
    await homePage.roomCards.scrollIntoViewIfNeeded
    await page.waitForLoadState('networkidle');
    //click on first available room to book
    await homePage.bookRoomButton();
    await page.getByRole('button', { name: 'Reserve Now' }).click();
    // clicking reserve without filling the form
    await bookingPage.reserveBooking();
    await page.waitForLoadState('networkidle');
   //Assert
   await expect(page.getByText('must not be empty').nth(0)).toBeVisible();
   await expect(page.getByText('must not be empty').nth(1)).toBeVisible();
   await expect(page.getByText('size must be between 11 and')).toBeVisible();
   await expect(page.getByText('Lastname should not be blank')).toBeVisible();
   await expect(page.getByText('size must be between 3 and 18')).toBeVisible();
   await expect(page.getByText('Firstname should not be blank')).toBeVisible();
   await expect(page.getByText('size must be between 3 and 30')).toBeVisible();
  });
  
  test('Submit a booking with incorrect email format and verify validation error ', async ({ page }) => {
    
   // Arrange
    const { checkInDate, checkOutDate } = generateBookingDates(30, 7);
   //Act
// Select the randomised date range
    await bookingPage.selectDateRange(checkInDate, checkOutDate);
    //check rooms that are available
    await homePage.checkAvailabilityButton.click();
    await homePage.roomCards.scrollIntoViewIfNeeded
    await page.waitForLoadState('networkidle');
    //click on first available room to book
    await homePage.bookRoomButton();
    await page.getByRole('button', { name: 'Reserve Now' }).click();
    // clicking reserve without filling the form
    const bookingData = {
      firstname: faker.person.firstName(),
      lastname: faker.person.lastName(),
      email: 'invalid-email.com', // Invalid email format
      phone: faker.phone.number({ style: 'international' }),
    };
    // Fill the booking form with invalid email
    await bookingPage.fillBookingForm(bookingData);
    // Attempt to reserve the booking
    await bookingPage.reserveBooking();
    await page.waitForLoadState('networkidle');
   //Assert
   await expect(page.getByText('must be a well-formed email address')).toBeVisible();
  });

  test.afterEach(async ({ page }) => {
    await page.close();
  });
});