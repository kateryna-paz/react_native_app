import { useForm } from "react-hook-form";
import { loginSchema } from "../../utils/validation.schemas";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "expo-router";
import { showToast } from "../../utils/showToast";
import useAuthStore from "../../store/authStore";

export const useLogin = () => {
  const router = useRouter();
  const { isLoading, loginUser } = useAuthStore();

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
    resolver: yupResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleLogin = async (data) => {
    try {
      await loginUser(data.email, data.password);

      router.push("/profile");
    } catch (error) {
      if (error === "Пароль невірний") {
        setError("password", {
          message: error,
        });
        return;
      }
      if (typeof error === "string") {
        setError("email", {
          message: error,
        });
      } else {
        showToast("error", "Щось пішло не так. Спробуйте пізніше.");
      }
    }
  };

  const goRegister = () => {
    router.push("/auth/register");
  };

  const onSubmit = handleSubmit(handleLogin);

  const isFormValid =
    watch("email") && watch("password") && Object.keys(errors).length === 0;

  return {
    control,
    errors,
    isLoading,
    isFormValid,
    onSubmit,
    getValues,
    goRegister,
  };
};
