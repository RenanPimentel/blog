export function getReadTime(str: string): number {
  const wpm = 250;
  const totalWords = str.replace(/\W+/g, "").split(/\s+/g).length;
  return Math.ceil(totalWords / wpm);
}
