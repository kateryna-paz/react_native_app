export class AuthError extends Error {
  constructor(message = "Користувач не визначений") {
    super(message);
    this.name = "AuthError";
  }
}

export const ensureAuthenticated = (getState) => {
  const { user, isLoading } = getState();

  if (isLoading) {
    return null;
  }

  if (!user?.id) {
    throw new AuthError();
  }

  return user.id;
};
