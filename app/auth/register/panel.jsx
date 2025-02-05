import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Icon } from "react-native-paper";
import MyContainer from "../../../components/UI/MyContainer";
import SelectList from "../../../components/UI/SelectList";
import { FONTS, MyLightTheme } from "../../../assets/theme/global";
import { usePanelForm } from "../../../hooks/auth/usePanelForm";
import { Controller } from "react-hook-form";
import { NumericInput } from "../../../components/UI/NumericInput";

export default function PanelScreen() {
  const {
    control,
    errors,
    handleSubmit,
    handleTypeChange,
    formValues,
    panelTypes,
    handleSkip,
  } = usePanelForm();

  return (
    <MyContainer
      colorStart={MyLightTheme.colors.primaryLight}
      colorEnd={MyLightTheme.colors.secondaryLight}
      style={{ flex: 1, justifyContent: "center" }}
    >
      <Text style={styles.title}>Додайте інформацію про сонячну панель</Text>

      <View style={styles.mainContainer}>
        <View style={styles.container}>
          <View style={{ marginBottom: 6, height: 55 }}>
            <SelectList
              title="Оберіть тип панелей"
              items={panelTypes}
              selectedTypeId={formValues.typeId}
              onSelect={handleTypeChange}
            />
            {errors.typeId && (
              <Text style={styles.errorText}>{errors.typeId.message}</Text>
            )}
          </View>

          <Text style={styles.label}>Введіть потужність панелі (Вт):</Text>

          <Controller
            control={control}
            name="power"
            render={({ field: { onChange, value } }) => (
              <NumericInput
                value={value}
                onChange={onChange}
                error={!!errors.power}
                errorMessage={errors.power?.message}
                styleErrorText={styles.errorText}
                styleInputContainer={styles.inputContainer}
                styleInput={styles.input}
              />
            )}
          />

          <Text style={styles.label}>Введіть кількість панелей:</Text>
          <Controller
            control={control}
            name="number"
            render={({ field: { onChange, value } }) => (
              <NumericInput
                value={value}
                onChange={onChange}
                error={!!errors.number}
                errorMessage={errors.number?.message}
                styleErrorText={styles.errorText}
                styleInputContainer={styles.inputContainer}
                styleInput={styles.input}
              />
            )}
          />
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.skipButton]}
            onPress={handleSkip}
          >
            <Text style={styles.skipButtonText}>Пропустити</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.nextButton]}
            onPress={handleSubmit}
          >
            <Text style={styles.buttonText}>Далі</Text>
            <Icon
              source="arrow-right-thin"
              size={24}
              color={MyLightTheme.colors.white}
            />
          </TouchableOpacity>
        </View>
      </View>
    </MyContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    backgroundColor: MyLightTheme.colors.white,
    paddingBottom: 20,
    paddingTop: 30,
    marginBottom: 5,
    width: "110%",
    paddingHorizontal: 42,
    justifyContent: "center",
    borderRadius: 15,
    shadowColor: MyLightTheme.colors.black,
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 4,
    elevation: 4,
  },
  title: {
    fontSize: 24,
    marginBottom: 8,
    marginTop: 70,
    marginHorizontal: 16,
    fontFamily: FONTS.Kurale,
    textAlign: "center",
    color: MyLightTheme.colors.black,
  },
  label: {
    fontFamily: FONTS.Kurale,
    fontSize: 16,
    paddingTop: 15,
    paddingBottom: 5,
  },
  inputContainer: {
    width: "100%",
    height: 55,
    marginBottom: 5,
  },
  input: {
    height: 40,
    backgroundColor: MyLightTheme.colors.white,
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 20,
    marginTop: 6,
  },
  button: {
    height: 50,
    backgroundColor: MyLightTheme.colors.primary,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    marginTop: 5,
    marginBottom: 10,
    flexDirection: "row",
    gap: 10,
  },
  buttonText: {
    fontSize: 18,
    color: MyLightTheme.colors.white,
    fontFamily: FONTS.Kurale,
    lineHeight: 24,
  },
  errorText: {
    color: MyLightTheme.colors.red,
    fontSize: 12.5,
    marginTop: 5,
    fontFamily: FONTS.SofiaSans,
  },
  mainContainer: {
    flexDirection: "column",
    gap: 15,
    alignItems: "center",
    marginHorizontal: 40,
    marginVertical: 20,
  },
  nextButton: {
    width: "55%",
  },
  skipButton: {
    width: "45%",
    backgroundColor: MyLightTheme.colors.white,
    borderColor: MyLightTheme.colors.primary,
    borderWidth: 2,
  },

  skipButtonText: {
    fontSize: 18,
    color: MyLightTheme.colors.primary,
    fontFamily: FONTS.Kurale,
    lineHeight: 24,
  },
});
