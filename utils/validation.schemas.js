import * as yup from "yup";

export const registerSchema = yup.object().shape({
  name: yup
    .string()
    .required("Ім'я обов'язкове")
    .min(2, "Ім'я має містити мінімум 2 символи"),
  email: yup
    .string()
    .required("Email обов'язковий")
    .email("Невірний формат email"),
  password: yup
    .string()
    .required("Пароль обов'язковий")
    .min(6, "Пароль має містити мінімум 6 символів"),
  confirmPassword: yup
    .string()
    .required("Підтвердження паролю обов'язкове")
    .oneOf([yup.ref("password"), null], "Паролі не співпадають"),
});

export const loginSchema = yup.object().shape({
  email: yup.string().required("Email обов'язковий"),
  password: yup.string().required("Пароль обов'язковий"),
});

export const panelSchema = yup.object().shape({
  number: yup
    .number()
    .typeError("Кількість повинна бути виражена числом")
    .required("Кількість панелей обов'язкова")
    .min(1, "Кількість не може бути менша за 1"),
  power: yup
    .number()
    .typeError("Потужність повинна бути виражена числом")
    .required("Потужність панелі обов'язкова")
    .min(0, "Потужність панелі не може бути менша за 0"),
  typeId: yup.string().required("Тип панелі обов'язковий"),
});
