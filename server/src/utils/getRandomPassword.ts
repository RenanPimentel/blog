const getRandom = (array: any[]) =>
  array[Math.floor(Math.random() * array.length)];

export function getRandomPassword(): string {
  const possible = "abcdefghijklmnopqrstuvwxyz 0123456789!@#$&*_+=-".split("");
  let newPassword = "";

  for (let i = 0; i < 20; i++) {
    newPassword += getRandom(possible);
  }

  return newPassword;
}
