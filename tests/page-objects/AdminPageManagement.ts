import { expect, Locator, Page } from '@playwright/test';

export class AdminRoomPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async createRoom(roomPrice: string = '100'): Promise<string> {
    const roomName = `${Math.floor(1000 + Math.random() * 9000)}`;

    await this.page.getByTestId('roomName').fill(roomName);
    await this.page.locator('#type').selectOption('Twin');
    await this.page.locator('#accessible').selectOption('true');
    await this.page.locator('#roomPrice').fill(roomPrice);
    await this.page.getByRole('checkbox', { name: 'WiFi' }).check();
    await this.page.getByRole('checkbox', { name: 'TV' }).check();
    await this.page.getByRole('button', { name: 'Create' }).click();
    //await this.page.waitForLoadState('networkidle');

    await expect(this.page.locator(`text=${roomName}`)).toBeVisible();
    return roomName;
  }

  async openRoom(roomName: string) {
    const roomNumber = await expect(this.page.locator(`text=${roomName}`)).toBeVisible();
    await this.page.locator(`text=${roomName}`).click();
    //await this.page.waitForLoadState('networkidle');
    await expect(this.page.getByRole('heading', { name: `Room: ${roomName}` })).toBeVisible();
  }

  async editRoomPrice(newPrice: string) {
    await this.page.getByRole('button', { name: 'Edit' }).click();
    await expect(this.page.getByRole('button', { name: 'Update' })).toBeVisible();
    await this.page.getByRole('textbox', { name: 'Room price:' }).fill(newPrice);
    await this.page.getByRole('button', { name: 'Update' }).click();
    //await this.page.waitForLoadState('networkidle');
    await expect(this.page.getByText('Room price:')).toHaveText(`Room price: ${newPrice}`);
  }
}