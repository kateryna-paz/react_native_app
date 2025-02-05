export class AuthError extends Error {
  constructor(message = "Користувач не визначений") {
    super(message);
    this.name = "AuthError";
  }
}

export const ensureAuthenticated = (getState) => {
  const userId = getState().auth.user?.id;
  if (!userId) {
    throw new AuthError();
  }
  return userId;
};
