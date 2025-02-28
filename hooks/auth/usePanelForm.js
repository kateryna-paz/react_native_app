import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "expo-router";
import { panelSchema } from "../../utils/validation.schemas";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { showToast } from "../../utils/showToast";
import usePanelTypesStore from "../../store/panelTypesStore";
import usePanelsStore from "../../store/panelsStore";

export const usePanelForm = () => {
  const router = useRouter();
  const { panelTypes, fetchPanelTypes } = usePanelTypesStore();

  const { addPanel } = usePanelsStore();

  useEffect(() => {
    fetchPanelTypes();
  }, [fetchPanelTypes]);

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
          await addPanel({
            ...data,
            power: Number(data.power),
            number: Number(data.number),
          });

          showToast("success", "Нова панель успішно додана!");

          router.push("/auth/register/location");

          setValue("typeId", null);
          setValue("number", null);
          setValue("power", null);
        }
      } catch (error) {
        showToast("error", "Виникла помилка при створенні панелі");
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
