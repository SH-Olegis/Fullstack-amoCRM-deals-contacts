import { readFileSync } from 'fs';

export default (pathToFile) => {
  return JSON.parse(readFileSync(pathToFile, 'utf-8'));
};
