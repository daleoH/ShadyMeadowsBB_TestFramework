import { test } from '@playwright/test';
import { loginAsAdmin } from '../../utils/adminLogin';
import { AdminRoomPage } from '../page-objects/AdminPageManagement';

test.describe('review rooms tests', () => {
    let adminRoomPage: AdminRoomPage;

  test.beforeEach(async ({ page }) => {
    adminRoomPage = new AdminRoomPage(page);
    await loginAsAdmin(page);
  });

  test.afterEach(async ({ page }) => {
    await page.close();
  });

test('Admin can reate a room', async ({ page }) => {
//   await loginAsAdmin(page);
   //const roomPage = new AdminRoomPage(page);

  const roomName = await adminRoomPage.createRoom();
  await adminRoomPage.openRoom(roomName);
});

test('Admin can create a room and edit the room price', async ({ page }) => {
  //await loginAsAdmin(page);
  //const roomPage = new AdminRoomPage(page);

  const roomName = await adminRoomPage.createRoom();
  await adminRoomPage.openRoom(roomName);
  await adminRoomPage.editRoomPrice('150');
})
});