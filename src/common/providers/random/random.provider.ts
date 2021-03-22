export class RandomProvider {
  constructor(private readonly values = 'qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM0123456789') {}

  getRandomString(length = 10): string {
    return Array.from({ length })
      .fill(null)
      .map(() => this.values[this.getRandomNumber(0, this.values.length)])
      .join('');
  }

  getRandomNumber(min = 0, max = 100): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}

export default new RandomProvider();
