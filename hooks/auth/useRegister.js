import { useForm } from "react-hook-form";
import { registerSchema } from "../../utils/validation.schemas";
import { useDispatch, useSelector } from "react-redux";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "expo-router";
import { registerUser } from "../../store/slices/authSlice";
import { showToast } from "../../utils/showToast";

export const useRegister = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.auth);

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    setError,
    getValues,
  } = useForm({
    mode: "all",
    reValidateMode: "onChange",
    resolver: yupResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const handleRegistration = async (data) => {
    try {
      const userResult = await dispatch(
        registerUser({
          name: data.name,
          email: data.email,
          password: data.password,
        })
      ).unwrap();

      if (!userResult || userResult?.error) {
        showToast(
          "error",
          userResult?.error || "Помилка реєстрації користувача"
        );
      }

      showToast("success", "Акаунт успішно створено");

      router.push("/auth/register/panel");
    } catch (error) {
      if (typeof error === "string") {
        setError("email", {
          message: error,
        });
      } else {
        showToast("error", "Упс... , щось пішло не так");
      }
    }
  };

  const goLogIn = () => {
    router.push("/auth/login");
  };

  const onSubmit = handleSubmit(handleRegistration);

  const isFormValid =
    watch("name") &&
    watch("email") &&
    watch("password") &&
    watch("confirmPassword") &&
    Object.keys(errors).length === 0;

  return {
    control,
    errors,
    isLoading,
    isFormValid,
    onSubmit,
    getValues,
    goLogIn,
  };
};
