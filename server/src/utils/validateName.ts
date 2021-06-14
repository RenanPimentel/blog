type FieldError = { field: "username"; reason: string };

export function validateName(username?: string): FieldError | void {
  if (!username || username.length < 5) {
    return {
      field: "username",
      reason: "Too short username",
    };
  }
  if (
    !username
      ?.split("")
      .every(letter => /[a-z]|[A-Z]|[0-9]|_|\!|\?/.test(letter))
  ) {
    return {
      field: "username",
      reason: "Invalid characters in username",
    };
  }
}
