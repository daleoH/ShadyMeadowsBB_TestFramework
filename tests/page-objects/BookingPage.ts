import { Page, Locator } from '@playwright/test';

export class BookingPage {
  readonly page: Page;
  readonly checkinDate: Locator;
  readonly checkoutDate: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly emailInput: Locator;
  readonly phoneInput: Locator;
  readonly reserveButton: Locator;
  readonly bookingForm: Locator;
  readonly confirmationMessage: Locator;
  readonly roomDescription: Locator;

  constructor(page: Page) {
    this.page = page;
    this.checkinDate = page.locator('div').filter({ hasText: /^Check In$/ }).getByRole('textbox');
    this.checkoutDate = page.locator('div').filter({ hasText: /^Check Out$/ }).getByRole('textbox');
    this.firstNameInput = page.getByRole('textbox', { name: 'Firstname' });
    this.lastNameInput = page.getByRole('textbox', { name: 'Lastname' });
    this.emailInput = page.getByRole('textbox', { name: 'Email' });
    this.phoneInput = page.getByRole('textbox', { name: 'Phone' });
    this.reserveButton = page.getByRole('button', { name: 'Reserve Now' });
    this.bookingForm = page.getByRole('form', { name: 'Booking Form' });
    this.confirmationMessage = page.getByRole('heading', { name: 'Booking Confirmed' })
    this.roomDescription = page.locator('.room-description');
  }

  async fillBookingForm(bookingData: {
    // checkin: string;
    // checkout: string;
    firstname: string;
    lastname: string;
    email: string;
    phone: string;
  }) {
    // await this.checkinDate.fill(bookingData.checkin);
    // await this.checkoutDate.fill(bookingData.checkout);
    await this.firstNameInput.fill(bookingData.firstname);
    await this.lastNameInput.fill(bookingData.lastname);
    await this.emailInput.fill(bookingData.email);
    await this.phoneInput.fill(bookingData.phone);
  }

  async fillCheckinCheckoutDates(checkin: string, checkout: string) {
    await this.checkinDate.fill(checkin);
    await this.checkoutDate.fill(checkout);
  }

  async submitBooking() {
    await this.reserveButton.click();
  }
}