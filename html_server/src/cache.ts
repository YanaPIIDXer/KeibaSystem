import { createHash, randomUUID } from 'node:crypto';
import { mkdir, readFile, rename, rm, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const cacheRoot = fileURLToPath(new URL('../caches/', import.meta.url));

function encodeSegment(segment: string): string {
  // Escape Windows reserved names and preserve case on case-insensitive disks.
  if (/^(con|prn|aux|nul|com[0-9]|lpt[0-9])(?:\.|$)/i.test(segment)) {
    return `%r${segment.replace(/[^a-z0-9_-]/g, escapeCharacter)}`;
  }

  return segment.replace(/[^a-z0-9_.-]|\.$/g, escapeCharacter) || '%e';
}

function escapeCharacter(character: string): string {
  return `%${character.charCodeAt(0).toString(16)}`;
}

export function getCachePath(url: URL, waitForSelector?: string): string {
  const segments = url.pathname.slice(1).split('/').map(encodeSegment);
  const filename = segments.pop()!;
  const plain = url.protocol === 'https:' && !url.username && !url.password &&
    !url.href.includes('?') && !url.href.includes('#') && !waitForSelector;
  const variant = plain ? '' : `%v${createHash('sha256')
    .update(JSON.stringify([url.href, waitForSelector || '']))
    .digest('hex')}`;
  const leaf = filename.endsWith('.html') ? filename.slice(0, -5) : `${filename}%x`;
  const directories = segments.map(segment => segment.endsWith('.html') ? `${segment}%d` : segment);

  return join(cacheRoot, encodeSegment(url.host), ...directories, `${leaf}${variant}.html`);
}

export async function readCachedHtml(path: string): Promise<string | undefined> {
  try {
    return await readFile(path, 'utf8');
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
      console.error('Failed to read HTML cache', error);
    }
  }
}

export async function writeCachedHtml(path: string, html: string): Promise<void> {
  const temporaryPath = join(dirname(path), `${randomUUID()}.tmp`);
  try {
    await mkdir(dirname(path), { recursive: true });
    await writeFile(temporaryPath, html, 'utf8');
    await rename(temporaryPath, path);
  } catch (error) {
    console.error('Failed to write HTML cache', error);
    await rm(temporaryPath, { force: true }).catch(cleanupError => {
      console.error('Failed to remove temporary HTML cache file', cleanupError);
    });
  }
}
