export function validateName(name?: string): FieldError | null {
  if (!name || name.length < 5) {
    return {
      field: "username",
      reason: "Username length must be greater than 5",
    };
  }

  if (
    !name?.split("").every(letter => /[a-z]|[A-Z]|[0-9]|_|\!|\?/.test(letter))
  ) {
    return {
      field: "username",
      reason: "Invalid characters in username",
    };
  }

  return null;
}
