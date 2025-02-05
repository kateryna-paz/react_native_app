import { Controller } from "react-hook-form";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { TextInput, Icon } from "react-native-paper";
import BackButton from "../../../components/UI/BackButton";
import MyContainer from "../../../components/UI/MyContainer";
import { FONTS, MyLightTheme } from "../../../assets/theme/global";
import LoadingScreen from "../../../components/UI/LoadingScreen";
import { useRegister } from "../../../hooks/auth/useRegister";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useRef } from "react";

export default function RegisterScreen() {
  const { control, errors, isLoading, onSubmit, goLogIn } = useRegister();
  const scrollRef = useRef(null);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <KeyboardAwareScrollView
      keyboardShouldPersistTaps="handled"
      ref={scrollRef}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollView}
    >
      <MyContainer
        colorStart={MyLightTheme.colors.primaryLight}
        colorEnd={MyLightTheme.colors.secondaryLight}
      >
        <BackButton
          stylesBtn={styles.backButton}
          iconColor={MyLightTheme.colors.primaryDark}
        />
        <View style={styles.form}>
          <Text style={styles.title}>Створити акаунт</Text>

          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, value } }) => (
              <View style={styles.inputContainer}>
                <TextInput
                  placeholder="Ім'я"
                  value={value}
                  onChangeText={onChange}
                  style={styles.input}
                  error={!!errors.name}
                />
                {errors.name && (
                  <Text style={styles.errorText}>{errors.name.message}</Text>
                )}
              </View>
            )}
          />

          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, value } }) => (
              <View style={styles.inputContainer}>
                <TextInput
                  placeholder="Електронна пошта"
                  value={value}
                  onChangeText={onChange}
                  style={styles.input}
                  keyboardType="email-address"
                  error={!!errors.email}
                />
                {errors.email && (
                  <Text style={styles.errorText}>{errors.email.message}</Text>
                )}
              </View>
            )}
          />

          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, value } }) => (
              <View style={styles.inputContainer}>
                <TextInput
                  placeholder="Пароль"
                  value={value}
                  onChangeText={onChange}
                  secureTextEntry
                  style={styles.input}
                  error={!!errors.password}
                />
                {errors.password && (
                  <Text style={styles.errorText}>
                    {errors.password.message}
                  </Text>
                )}
              </View>
            )}
          />

          <Controller
            control={control}
            name="confirmPassword"
            render={({ field: { onChange, value } }) => (
              <View style={styles.inputContainer}>
                <TextInput
                  placeholder="Підтвердження паролю"
                  value={value}
                  onChangeText={onChange}
                  secureTextEntry
                  style={styles.input}
                  error={!!errors.confirmPassword}
                />
                {errors.confirmPassword && (
                  <Text style={styles.errorText}>
                    {errors.confirmPassword.message}
                  </Text>
                )}
              </View>
            )}
          />

          <TouchableOpacity style={styles.button} onPress={onSubmit}>
            <Text style={styles.buttonText}>Далі</Text>
            <Icon source="arrow-right-thin" size={24} color="#fff" />
          </TouchableOpacity>

          <Text style={styles.loginText}>
            Вже маєте акаунт?{" "}
            <Text style={styles.loginLink} onPress={() => goLogIn()}>
              Увійти
            </Text>
          </Text>
        </View>
      </MyContainer>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flexGrow: 1,
  },
  backButton: {
    position: "absolute",
    top: 14,
    left: 8,
    backgroundColor: MyLightTheme.colors.transparent,
    borderWidth: 0,
    shadowColor: MyLightTheme.colors.transparent,
  },
  form: {
    flex: 1,
    marginTop: 100,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    marginBottom: 30,
    fontFamily: FONTS.Kurale,
    color: MyLightTheme.colors.black,
  },
  inputContainer: {
    width: "100%",
    height: 72,
    marginBottom: 15,
  },
  input: {
    width: "100%",
    backgroundColor: MyLightTheme.colors.white,
    color: MyLightTheme.colors.primary,
  },
  errorText: {
    color: MyLightTheme.colors.red,
    fontSize: 12.5,
    marginTop: 5,
    marginLeft: 4,
    fontFamily: FONTS.SofiaSans,
  },
  button: {
    width: "100%",
    height: 50,
    backgroundColor: MyLightTheme.colors.primary,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    marginTop: 30,
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
  loginText: {
    fontSize: 16,
    color: MyLightTheme.colors.textSecondary,
    fontFamily: FONTS.SofiaSans,
  },
  loginLink: {
    color: MyLightTheme.colors.greenDark,
    fontFamily: FONTS.SofiaSansBold,
  },
});
