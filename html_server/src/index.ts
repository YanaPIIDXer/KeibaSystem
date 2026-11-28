import server from './server';
import { fetchHtml } from './fetch';
import { Waiter } from './waiter';
import { getCachePath, readCachedHtml, writeCachedHtml } from './cache';
import type { HtmlRequestData } from 'common/network/Html';

const waiter = new Waiter();
const pendingFetches = new Map<string, Promise<string>>();

async function fetchAndCacheHtml(url: URL, cachePath: string, waitForSelector?: string, useCache?: boolean): Promise<string> {
  if (useCache) {
    const cachedHtml = await readCachedHtml(cachePath);
    if (cachedHtml !== undefined) {
      return cachedHtml;
    }
  }

  await waiter.wait();
  const html = await fetchHtml(url.href, waitForSelector);
  await waiter.start();
  await writeCachedHtml(cachePath, html);
  return html;
}

server.post('/', async (req, res) => {
  const request: HtmlRequestData = req.body;
  const url = typeof request.url === 'string' ? URL.parse(request.url) : null;
  if (!url || (url.protocol !== 'http:' && url.protocol !== 'https:')) {
    res.status(400).json({ error: 'url must be a valid HTTP or HTTPS URL' });
    return;
  }

  try {
    const cachePath = getCachePath(url, request.waitForSelector);
    let pendingFetch = pendingFetches.get(cachePath);
    if (!pendingFetch) {
      pendingFetch = fetchAndCacheHtml(url, cachePath, request.waitForSelector, request.useCache)
        .finally(() => pendingFetches.delete(cachePath));
      pendingFetches.set(cachePath, pendingFetch);
    }

    const html = await pendingFetch;
    res.json({ html });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch HTML' });
  }
});

server.listen(3001, () => {
  console.log('Start HTML Server');
});
