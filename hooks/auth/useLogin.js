import { useForm } from "react-hook-form";
import { loginSchema } from "../../utils/validation.schemas";
import { useDispatch, useSelector } from "react-redux";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "expo-router";
import { loginUser } from "../../store/slices/authSlice";
import { showToast } from "../../utils/showToast";

export const useLogin = () => {
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
    resolver: yupResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleLogin = async (data) => {
    try {
      await dispatch(
        loginUser({
          email: data.email,
          password: data.password,
        })
      ).unwrap();

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
