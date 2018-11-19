import jest from 'jest';
import {testAsync, checkEvents} from '../lib/event';

test('Testing async functions with Jest', async () => {
  const data = await testAsync();
  expect(data).toBe(true);
});
