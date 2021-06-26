export function getReadTime(str: string): number {
  const wpm = 250;
  const totalWords = str.split(/\s+/g).length;
  return Math.ceil(totalWords / wpm);
}
