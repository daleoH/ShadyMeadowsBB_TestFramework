import { Page, Locator } from '@playwright/test';

export class HomePage {
  readonly page: Page;
  readonly checkIn: Locator;
  readonly checkOut: Locator;
  readonly checkAvailabilityButton: Locator;
  readonly roomTitle: Locator;
  readonly roomDescription: Locator;
  readonly roomCards: Locator;
  readonly bookThisRoomButton: Locator;
  readonly contactName: Locator;
  readonly contactEmail: Locator;
  readonly contactPhone: Locator;
  readonly contactSubject: Locator;
  readonly contactMessage: Locator;
  readonly submitContactButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.checkAvailabilityButton = page.getByRole('button', { name: 'Check Availability' });
    this.checkIn = page.locator('div', { hasText: /^Check In$/ }).getByRole('textbox');
    this.checkOut = page.locator('div', { hasText: /^Check Out$/ }).getByRole('textbox');
    this.roomTitle = page.locator('.card-title');
    this.roomDescription = page.locator('.card-text');
    this.roomCards = page.locator('#rooms .col-md-6.col-lg-4');
    this.bookThisRoomButton = page.locator('#rooms .col-md-6.col-lg-4').getByRole('link', { name: 'Book now' });
    this.contactName = page.getByTestId('ContactName')
    this.contactEmail = page.getByTestId('ContactEmail')
    this.contactPhone = page.getByTestId('ContactPhone')
    this.contactSubject = page.getByTestId('ContactSubject')
    this.contactMessage = page.getByTestId('ContactDescription')
    this.submitContactButton = page.getByRole('button', { name: 'Submit' });
  }

  async navigateToHome() {
    await this.page.goto('/');
  }

  async getFirstRoomPrice() {
    return await this.roomCards.first().locator('.room-price').textContent();
  }

  async getRoomTitle() {
    return await this.roomCards.first().locator('.card-title').textContent();
  }

  async getRoomeDescription() {
    return await this.roomCards.first().locator('.room-price').textContent();
  }

  async bookRoomButton() {
    await this.bookThisRoomButton.first().click();
  }
  async findAllRoomCards() {
    return this.roomCards;
  }

  async fillContactForm(contactData: {
    name: string;
    email: string;
    phone: string;
    subject: string;
    message: string;
  }) {
    await this.contactName.fill(contactData.name);
    await this.contactEmail.fill(contactData.email);
    await this.contactPhone.fill(contactData.phone);
    await this.contactSubject.fill(contactData.subject);
    await this.contactMessage.fill(contactData.message);
  }

  async submitContact() {
    await this.submitContactButton.click();
  }
}