import { test, expect, request as playwrightRequest} from '@playwright/test';

test('create room via API and view in the UI', async ({ page, context, request }) => {
  // UI login first
  await page.goto('https://automationintesting.online/admin');
  await page.getByRole('textbox', { name: 'Username' }).fill('admin');
  await page.getByRole('textbox', { name: 'Password' }).fill('password');
  await page.getByRole('button', { name: 'Login' }).click();

 // Ensure we are logged in
    await expect(page.getByRole('button', { name: 'Logout' })).toBeVisible();

    // Wait for the admin page to load
    await expect(page.locator('text=Rooms')).toBeVisible();

    // Save storage state to a file
  const storageFile = 'storageState.json';
  await context.storageState({ path: storageFile });

  // Create a new API context with the storage state
  const apiContext = await playwrightRequest.newContext({
    storageState: storageFile,
  });

const randomNumber = Math.floor(1000 + Math.random() * 9000);
const roomName = `${randomNumber}`;
  // Call API to create room
  const response = await apiContext.post(
    'https://automationintesting.online/api/room',
    {
      data: {
        roomName: `${roomName}`,
        type: 'Single',
        accessible: true,
        roomImage: 'https://automationintesting.online/images/room1.jpg',
        roomSize: 1,
        roomCapacity: 2,
        roomDescription: 'Test Room via API',
        description: 'Test Room via API',
        features: ['WiFi', 'TV'],
        roomPrice: 300,
      },
    }
  );

  expect(response.ok()).toBeTruthy();

//   const room = await response.json();
//   console.log('Created room:', room);
 //verify the room creation by checking the response or querying the UI
  await page.goto('https://automationintesting.online/admin/rooms');
  await expect(page.locator(`text=${roomName}`)).toBeVisible();
  await apiContext.dispose();
  await context.close();
  await page.close();
});