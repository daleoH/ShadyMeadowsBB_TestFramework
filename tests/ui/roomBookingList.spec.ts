import { test, expect } from '@playwright/test';
import { HomePage } from '../page-objects/HomePage';

test.describe('review rooms tests', () => {
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    await homePage.navigateToHome();
  });

  test.afterEach(async ({ page }) => {
    await page.close();
  });
test('Verify at least one room in the rooms section is present on the UI without checking availability', async ({ page }) => {
  // Act
  // Find all room cards inside the rooms section of the page
  const roomCards = await homePage.findAllRoomCards();
  // Wait until at least one room is rendered
  await expect(roomCards.first()).toBeVisible();
  // Count the number of rooms and print it to the console
  const roomCount = await roomCards.count();
  console.log(`Total rooms displayed: ${roomCount}`);
  // Assert that there's at least one room
  expect(roomCount).toBeGreaterThan(0);
  // Assert
  // Verify each room card has a title and description and book now button
  for (let i = 0; i < roomCount; i++) {
    const card = roomCards.nth(i);
    await expect(card.locator('.card-title'),`Room ${i + 1} missing title`).toHaveText(/.+/);
    await expect(card.locator('p.card-text'), `Room ${i + 1} missing description`).toHaveText(/.+/);
    await expect(card.locator('text=Book Now'), `Room ${i + 1} missing book button`).toBeVisible();
  }
})

test('Verify all rooms have a price', async ({ page }) => {

  // Find all room cards inside the rooms section of the page
  const roomCards = await homePage.findAllRoomCards();
  // Wait until at least one room is rendered
  await expect(roomCards.first()).toBeVisible();
  // Count the number of rooms and print it to the console
  const roomCount = await roomCards.count();
  console.log(`Total rooms displayed: ${roomCount}`);
  // Assert that there's at least one room
  expect(roomCount).toBeGreaterThan(0);

  // Verify each room card has a title and description
for (let i = 0; i < roomCount; i++) {
  const card = roomCards.nth(i);
  
  const priceElement = card.locator('text=/£\\d+ per night/');
  await expect(priceElement, `Room ${i + 1} price not visible`).toBeVisible();
  console.log(`Room ${i + 1} price is visible`);
  console.log(`Room ${i + 1} price: ${await priceElement.textContent()}`);
  const priceText = await priceElement.innerText(); // e.g., "£120 per night"
  console.log(`Room ${i + 1} price text: ${priceText}`);
  // Extract the numeric value from the price text
  const match = priceText.match(/£(\d+)/);
  const price = match ? parseInt(match[1], 10) : 0;
  expect(price, `Room ${i + 1} has invalid or missing price`).toBeGreaterThan(0);
}
})
});