import { ncp } from 'ncp';
import path from 'path';
import { promisify } from 'util';

const pathToEnvExample = require.resolve('../.env.example');
const pathToEnv = path.join(pathToEnvExample, '../.env');

(async () => {
  await promisify(ncp)(pathToEnvExample, pathToEnv, {
    clobber: false,
  });
})();
