import server from './server';
import { fetchHtml } from './fetch';
import { Waiter } from './waiter';

interface RequestData {
  url: string;
  waitForSelector?: string;
}

const waiter = new Waiter();

server.post('/', async (req, res) => {
  const request: RequestData = req.body;
  const url = typeof request.url === 'string' ? URL.parse(request.url) : null;
  if (!url || (url.protocol !== 'http:' && url.protocol !== 'https:')) {
    res.status(400).json({ error: 'url must be a valid HTTP or HTTPS URL' });
    return;
  }

  try {
    await waiter.wait();
    const html = await fetchHtml(url.href, request.waitForSelector);
    await waiter.start();
    res.json({ html });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch HTML' });
  }
});

server.listen(3001, () => {
  console.log('Start HTML Server');
});
