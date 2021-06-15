export function getReadTime(str: string): number {
  // const words = str.split(" ");
  const totalLetters = str.split("").length;
  return Math.round(totalLetters / (5 * 60));
}
