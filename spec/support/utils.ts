import { readFile, readFileSync } from 'fs';
import * as path from 'path';

export function getTestFile(filePath: string): string {
  return path.join(__dirname, '../../../spec/data', filePath);
}

export function readTestFile(filePath: string, encoding: string = 'utf8'): string {
  return readFileSync(getTestFile(filePath), { encoding: encoding });
}
