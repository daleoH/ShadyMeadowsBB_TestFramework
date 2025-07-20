import { Page, Locator } from '@playwright/test';

export class BookingPage {
  readonly page: Page;
  readonly checkinDate: Locator;
  readonly checkoutDate: Locator;
  readonly datePicker: Locator;
  readonly currentMonth: Locator;
  readonly nextMonthButton: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly emailInput: Locator;
  readonly phoneInput: Locator;
  readonly reserveButton: Locator;
  readonly bookingForm: Locator;
  readonly confirmationMessage: Locator;
  readonly roomDescription: Locator;
  readonly confirmationDateRange: Locator;

  constructor(page: Page) {
    this.page = page;
    this.checkinDate = page.locator('div').filter({ hasText: /^Check In$/ }).getByRole('textbox');
    this.checkoutDate = page.locator('div').filter({ hasText: /^Check Out$/ }).getByRole('textbox');
    this.datePicker = page.locator('.react-datepicker');
    this.currentMonth = page.locator('.react-datepicker__current-month');
    this.nextMonthButton = page.locator('.react-datepicker__navigation--next');
    this.firstNameInput = page.getByRole('textbox', { name: 'Firstname' });
    this.lastNameInput = page.getByRole('textbox', { name: 'Lastname' });
    this.emailInput = page.getByRole('textbox', { name: 'Email' });
    this.phoneInput = page.getByRole('textbox', { name: 'Phone' });
    this.reserveButton = page.getByRole('button', { name: 'Reserve Now' });
    this.bookingForm = page.getByRole('form', { name: 'Booking Form' });
    this.confirmationMessage = page.getByRole('heading', { name: 'Booking Confirmed' })
    this.roomDescription = page.locator('.room-description');
    this.confirmationDateRange = page.locator('.col-lg-4 .card-body > p.text-center.pt-2 > strong');
  }

  async fillBookingForm(bookingData: {
    firstname: string;
    lastname: string;
    email: string;
    phone: string;
  }) {
    await this.firstNameInput.fill(bookingData.firstname);
    await this.lastNameInput.fill(bookingData.lastname);
    await this.emailInput.fill(bookingData.email);
    await this.phoneInput.fill(bookingData.phone);
  }

  async openCheckInDatePicker() {
    await this.checkinDate.click();
    await this.datePicker.waitFor({ state: 'visible' });
  }

  async openCheckOutDatePicker() {
    await this.checkoutDate.click();
    await this.datePicker.waitFor({ state: 'visible' });
  }
// Select a date from the date picker, find the correct month and navigate to the target date
  async selectDateFromDatePicker(targetDate: Date) {
    // Get current month/year shown in datepicker
    const currentMonthText = await this.currentMonth.textContent();
    if (!currentMonthText) {
      throw new Error('Could not retrieve current month text from date picker.');
    }
    const [currentMonthName, currentYear] = currentMonthText.split(' ');
    
    const targetMonth = targetDate.getMonth(); // 0-11
    const targetYear = targetDate.getFullYear();
    const currentMonth = new Date(`${currentMonthName} 1, ${currentYear}`).getMonth();
    // Calculate months to navigate
    let monthsToNavigate = (targetYear - parseInt(currentYear)) * 12 + (targetMonth - currentMonth);
    // Navigate to correct month
    while (monthsToNavigate > 0) {
      await this.nextMonthButton.click();
      await this.page.waitForTimeout(200);
      monthsToNavigate--;
    }
    // Select the day
    const dayNumber = targetDate.getDate();
    await this.page.locator('.react-datepicker__day', { hasText: new RegExp(`^${dayNumber}$`) })
      await this.page.locator('.react-datepicker__day', { hasText: new RegExp(`^${dayNumber}$`) })
    .and(this.page.locator('.react-datepicker__day:not(.react-datepicker__day--outside-month)'))
    .click();
  }
  //open date picker and select check-in dates
  async selectCheckInDate(date: Date) {
    await this.openCheckInDatePicker();
    await this.selectDateFromDatePicker(date);
  }
  //open date picker and select check-out dates
  async selectCheckOutDate(date: Date) {
    await this.openCheckOutDatePicker();
    await this.selectDateFromDatePicker(date);
  }
  // Select a checkin and checkout date range for booking
  async selectDateRange(checkInDate: Date, checkOutDate: Date) {
    await this.selectCheckInDate(checkInDate);
    await this.selectCheckOutDate(checkOutDate);
  }
// Get the date range from the confirmation message
    async getConfirmationDateRange(): Promise<string> {
    const dateRangeText = await this.confirmationDateRange.textContent();
    if (!dateRangeText) {
      throw new Error('Could not find date range in confirmation page');
    }
    return dateRangeText.trim();
  }
  // Reserve the booking button
    async reserveBooking() {
    await this.reserveButton.click();
  }
}