import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import { panelSchema } from "../../utils/validation.schemas";
import { useForm } from "react-hook-form";
import { addPanel } from "../../store/slices/panelSlice";
import { useEffect } from "react";
import { fetchPanelTypes } from "../../store/slices/typesSlice";
import { showToast } from "../../utils/showToast";

export const usePanelForm = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { panelTypes } = useSelector((state) => state.panelTypes);

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    trigger,
  } = useForm({
    mode: "all",
    reValidateMode: "onChange",
    resolver: yupResolver(panelSchema),
    defaultValues: {
      power: null,
      number: null,
      typeId: null,
    },
  });

  const formValues = watch();
  const isFormFilled =
    formValues.power !== null &&
    formValues.number !== null &&
    formValues.typeId !== null;

  const onSubmit = async (data) => {
    if (isFormFilled) {
      try {
        const isValid = await trigger();

        if (isValid) {
          const panelResult = await dispatch(
            addPanel({
              ...data,
              power: Number(data.power),
              number: Number(data.number),
            })
          ).unwrap();

          if (!panelResult || panelResult?.error) {
            showToast("error", panelResult?.error || "Виникла помилка");
            return;
          }

          showToast("success", "Нова панель успішно додана!");
          router.push("/auth/register/location");
        }
      } catch (error) {
        showToast("error", "Виникла помилка при валідації даних");
      }
    } else {
      await trigger();
    }
  };

  const handleSkip = () => {
    router.push("/auth/register/location");
  };

  const handleTypeChange = (typeId) => {
    setValue("typeId", typeId);
  };

  useEffect(() => {
    dispatch(fetchPanelTypes());
  }, [dispatch]);

  return {
    control,
    errors,
    handleSubmit: handleSubmit(onSubmit),
    handleTypeChange,
    formValues,
    panelTypes,
    handleSkip,
  };
};
