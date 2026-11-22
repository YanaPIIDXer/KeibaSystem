import { chromium, type Browser } from 'playwright';

const MAX_ATTEMPTS = 3;
const NAVIGATION_TIMEOUT = 30_000;
const SELECTOR_TIMEOUT = 10_000;

class NonRetryableError extends Error {}

export async function fetchHtml(
  url: string,
  waitForSelector?: string
): Promise<string> {
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    let browser: Browser | undefined;

    try {
      browser = await chromium.launch();

      const page = await browser.newPage();

      const response = await page.goto(url, {
        timeout: NAVIGATION_TIMEOUT,
        waitUntil: 'load',
      });

      if (!response) {
        throw new NonRetryableError(
          `No HTTP response: ${url}`
        );
      }

      if (!response.ok()) {
        const status = response.status();

        const message = `Unexpected upstream status: ${status}`;

        // リトライしても改善しにくいエラー
        if (
          status >= 400 &&
          status < 500 &&
          status !== 408 &&
          status !== 429
        ) {
          throw new NonRetryableError(message);
        }

        throw new Error(message);
      }

      if (waitForSelector) {
        await page.waitForSelector(waitForSelector, {
          timeout: SELECTOR_TIMEOUT,
        });
      }

      return await page.content();

    } catch (error) {
      // リトライ対象外、または最大試行回数に到達
      if (
        error instanceof NonRetryableError ||
        attempt === MAX_ATTEMPTS
      ) {
        throw error;
      }

    } finally {
      await browser?.close();
    }

    // ブラウザ終了後にバックオフ
    const delay = 500 * 2 ** (attempt - 1);

    await new Promise<void>((resolve) => {
      setTimeout(resolve, delay);
    });
  }

  throw new Error('Failed to fetch HTML');
}
