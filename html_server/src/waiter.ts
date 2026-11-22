export class Waiter {
  private isWaiting = false;
  constructor () {
  }

  async start (): Promise<void> {
    await this.wait();
    this.isWaiting = true;
    setTimeout(() => {
      this.isWaiting = false;
    }, 2000);
  }

  wait (): Promise<void> {
    return new Promise<void>((resolve) => {
      if (!this.isWaiting) { return resolve(); }
      
      const h = setInterval(() => {
        if (!this.isWaiting) {
          clearInterval(h);
          resolve();
        }
      }, 100);
    });
  }
}
