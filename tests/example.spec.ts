import { test, expect } from '@playwright/test';
import {readFileSync} from "fs";
import {writeFileSync} from "node:fs";

import {chromium} from "playwright";

import v8toIstanbul from "v8-to-istanbul";

test('green scenario, can upload, edit and download', async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.coverage.startJSCoverage();
  await page.coverage.startCSSCoverage();
  await page.goto('http://127.0.0.1:3000/');
  // Step 2: Upload a file
  const mockFileContent = JSON.stringify([
    {
      "_id": "6775e62dbc79cec4d03ecae8",
      "index": 777,
      "guid": "91813100-dadd-4d82-a97d-5ca3abda5fdf",
      "isActive": true,
      "balance": "$1,842.26",
      "picture": "http://placehold.it/32x32",
      "age": 36,
      "eyeColor": "green",
      "name": "Barrett Walsh",
      "gender": "male",
      "company": "SONGLINES",
      "email": "barrettwalsh@songlines.com",
      "phone": "+1 (946) 512-3558",
      "address": "210 Ira Court, Sanders,Arizona, 3154",
      "about": "Sit proident amet nisi consequat adipisicing exercitation amet voluptate esse commodo ex sit. Sint aliqua nisi laborum mollit. Laboris elit minim dolor tempor sit fugiat veniam. Elit excepteur exercitation nisi sit cupidatat veniam. Mollit ad anim enim eiusmod quis ullamco consequat aute.\r\n",
      "registered": "2015-1028T04:00:15 -03:00",
      "latitude": -30.3114,
      "longitude": -85.012756
    },
    {
      "_id": "6775e62d503a59e48d7b96c9",
      "index": 1,
      "guid": "68af4d70-cb2b-4b4b-8e63-e54b7d309132",
      "isActive": true,
      "balance": "$3,737.33",
      "picture": "http://placehold.it/32x32",
      "age": 35,
      "eyeColor": "brown",
      "name": "Richmond Holder",
      "gender": "male",
      "company": "FOSSIEL",
      "email": "richmondholder@fossiel.com",
      "phone": "+1 (904) 529-3668",
      "address": "966 Rockaway Avenue, Indio,Virginia, 8236",
      "about": "Sit sit voluptate fugiat laborum exercitation enim mollit do. Nostrud aute tempor do adipisicing ex dolore. Fugiat id tempor id ullamco eiusmod pariatur ut qui sunt.\r\n",
      "registered": "2016-0811T11:56:01 -03:00",
      "latitude": -23.012957,
      "longitude": 65.731622
    },
  ]);
  const mockFile = Buffer.from(mockFileContent);

  const fileInput = await page.locator('input[type="file"]');
  await fileInput.setInputFiles({
    name: 'items.json',
    mimeType: 'application/json',
    buffer: mockFile,
  });

  // Step 3: Wait for lazy-loaded list
  await expect(page.locator('text=index').first()).toBeVisible();

  // Step 4: Edit an index field
  const indexField = page.locator('input[type="number"]').first();
  await indexField.fill('5');

  const [download] = await Promise.all([
    page.waitForEvent('download'), // Wait for the download to start
    page.getByRole('button', { name: /Download JSON/i }).click()
    // page.click('text=Download Changes'), // Click the download button
  ]);

  // Step 6: Validate the downloaded file content
  const downloadPath = await download.path();
  console.log(downloadPath);
  const downloadedContent = readFileSync(downloadPath, 'utf-8');
  expect(JSON.parse(downloadedContent)).toEqual([
    {
      "_id": "6775e62dbc79cec4d03ecae8",
      "index": 5,
      "guid": "91813100-dadd-4d82-a97d-5ca3abda5fdf",
      "isActive": true,
      "balance": "$1,842.26",
      "picture": "http://placehold.it/32x32",
      "age": 36,
      "eyeColor": "green",
      "name": "Barrett Walsh",
      "gender": "male",
      "company": "SONGLINES",
      "email": "barrettwalsh@songlines.com",
      "phone": "+1 (946) 512-3558",
      "address": "210 Ira Court, Sanders,Arizona, 3154",
      "about": "Sit proident amet nisi consequat adipisicing exercitation amet voluptate esse commodo ex sit. Sint aliqua nisi laborum mollit. Laboris elit minim dolor tempor sit fugiat veniam. Elit excepteur exercitation nisi sit cupidatat veniam. Mollit ad anim enim eiusmod quis ullamco consequat aute.\r\n",
      "registered": "2015-1028T04:00:15 -03:00",
      "latitude": -30.3114,
      "longitude": -85.012756
    },
    {
      "_id": "6775e62d503a59e48d7b96c9",
      "index": 1,
      "guid": "68af4d70-cb2b-4b4b-8e63-e54b7d309132",
      "isActive": true,
      "balance": "$3,737.33",
      "picture": "http://placehold.it/32x32",
      "age": 35,
      "eyeColor": "brown",
      "name": "Richmond Holder",
      "gender": "male",
      "company": "FOSSIEL",
      "email": "richmondholder@fossiel.com",
      "phone": "+1 (904) 529-3668",
      "address": "966 Rockaway Avenue, Indio,Virginia, 8236",
      "about": "Sit sit voluptate fugiat laborum exercitation enim mollit do. Nostrud aute tempor do adipisicing ex dolore. Fugiat id tempor id ullamco eiusmod pariatur ut qui sunt.\r\n",
      "registered": "2016-0811T11:56:01 -03:00",
      "latitude": -23.012957,
      "longitude": 65.731622
    },
  ]);
  // Stop collecting coverage
  const jsCoverage = await page.coverage.stopJSCoverage();
  const cssCoverage = await page.coverage.stopCSSCoverage();

  // for (const entry of jsCoverage) {
  //   const converter = v8toIstanbul('', 0, { source: entry.source });
  //   await converter.load();
  //   converter.applyCoverage(entry.functions);
  //   console.log(JSON.stringify(converter.toIstanbul()));
  // }
  // Save coverage data
  writeFileSync('coverage/js-coverage.json', JSON.stringify(jsCoverage));
  writeFileSync('coverage/css-coverage.json', JSON.stringify(cssCoverage));
  await browser.close();
});

