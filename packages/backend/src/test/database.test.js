import jest from 'jest';
import { dbQueryPromise, db } from '../lib/database';
import getConnection from './checkDb';

test('checks if database connection was successful', () => {
  expect(getConnection()).not.toBe(null);
});
