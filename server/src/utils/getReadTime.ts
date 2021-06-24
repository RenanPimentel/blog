export function getReadTime(str: string): number {
  const totalLetters = str.split("").length;
  return Math.round(totalLetters / (5 * 60));
  // why 5? 1 sec for every word with 5 letters
  // why 60? convert sec to min
}
