export function getReadTime(str: string): number {
  const totalLetters = str.split("").length;
  return Math.round(totalLetters / (5 * 60));
}
