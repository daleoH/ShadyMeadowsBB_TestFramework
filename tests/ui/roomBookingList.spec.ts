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

  // Find all room cards inside the rooms section of the page
  const roomCards = await homePage.findAllRoomCards();
  // Wait until at least one room is rendered
  await expect(roomCards.first()).toBeVisible();
  // Count the number of rooms and print it to the console
  const count = await roomCards.count();
  console.log(`Total rooms displayed: ${count}`);

  // Assert that there's at least one room
  expect(count).toBeGreaterThan(0);

  // Verify each room card has a title and description
  for (let i = 0; i < count; i++) {
    const card = roomCards.nth(i);
    // Title
    await expect(card.locator('.card-title'),`Room ${i + 1} missing title`).toHaveText(/.+/);
    //console.log(`Room ${i + 1} title:`, await card.locator('.card-title').textContent());
    // Description
    await expect(card.locator('p.card-text'), `Room ${i + 1} missing description`).toHaveText(/.+/);
    //console.log(`Room ${i + 1} description:`, await card.locator('p.card-text').textContent());
  }
})
});