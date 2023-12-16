import { promises as fs } from 'fs';

export async function readJsonFile(filePath: string) {
  const data = await fs.readFile(filePath, 'utf8');

  return JSON.parse(data);
}

export async function writeJsonFile(filePath: string, data: any) {
  const jsonData = JSON.stringify(data, null, 2);

  await fs.writeFile(filePath, jsonData, 'utf8');
}