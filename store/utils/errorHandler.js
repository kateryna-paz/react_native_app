export const getErrorMessage = (error, customError) => {
  if (error.response?.data) {
    return error.response.data.message;
  }
  if (customError) {
    return customError;
  }
  console.log("getError message: ", error);
  return " Виникла невідома помилка. Перевірте з'єднання з інтернетом";
};
