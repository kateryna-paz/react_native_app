export const getErrorMessage = (error, customError) => {
  if (error.response?.data) {
    return error.response.data.message;
  }
  if (customError) {
    return customError;
  }
  return "Виникла невідома помилка";
};
