import fs from 'fs/promises';

import {_pm} from '../logger';
import {InputSource} from '../types';

/**
 * Gets a Buffer from various input sources
 * @param input - The input source (URL, base64 data URI, file path, or Buffer)
 * @returns Buffer containing the file data
 */
export async function getBufferFromInput(input: InputSource): Promise<Buffer> {
  if (typeof input === 'string') {
    try {
      if (input.startsWith('http')) {
        const response = await fetch(input);
        if (!response.ok) {
          throw new Error(
            `Failed to fetch file: ${response.status} ${response.statusText}`,
          );
        }
        return Buffer.from(await response.arrayBuffer());
      } else if (input.startsWith('data:')) {
        return Buffer.from(input.split(',')[1], 'base64');
      } else {
        return await fs.readFile(input);
      }
    } catch (error: unknown) {
      throw new Error(`Failed to read input: ${_pm(error)}`);
    }
  }

  if (!input?.length) {
    throw new Error('Empty or invalid input');
  }

  return input;
}
