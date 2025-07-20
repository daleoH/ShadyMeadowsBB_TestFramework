import { test, expect, request } from '@playwright/test';

//Was hoping to use this for API tests, but it seems to be unusable as token looks to be
//used and passed in via cookies and not in the header
test('Login API returns a token', async () => {
  const context = await request.newContext();

  const response = await context.post('https://automationintesting.online/api/auth/login', {
    data: {
      username: 'admin',
      password: 'password'
    }
  });

  expect(response.ok()).toBeTruthy(); // status code is 200
  const body = await response.json();
  console.log('Response Body:', body);
  expect(body.token).toBeTruthy(); // token is present
  console.log('Token:', body.token);
});