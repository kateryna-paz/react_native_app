import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { TextInput } from "react-native-paper";
import BackButton from "../../../components/UI/BackButton";
import MyContainer from "../../../components/UI/MyContainer";
import { FONTS, MyLightTheme } from "../../../assets/theme/global";
import LoadingScreen from "../../../components/UI/LoadingScreen";
import { useLogin } from "../../../hooks/auth/useLogin";
import { Controller } from "react-hook-form";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useRef } from "react";

export default function Login() {
  const { control, errors, isLoading, onSubmit, goRegister } = useLogin();
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
          iconColor={MyLightTheme.colors.primary}
        />
        <View style={styles.form}>
          <Text style={styles.title}>Увійти</Text>

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

          <TouchableOpacity style={styles.button} onPress={onSubmit}>
            <Text style={styles.buttonText}>Увійти</Text>
          </TouchableOpacity>
          <Text style={styles.registerText}>
            Ще не маєте акаунта?{"  "}
            <Text style={styles.registerLink} onPress={() => goRegister()}>
              Зареєструватись
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
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 36,
    marginBottom: 20,
    fontFamily: FONTS.Kurale,
    color: MyLightTheme.colors.black,
  },
  inputContainer: {
    width: "100%",
    paddingHorizontal: 2,
    height: 72,
    marginBottom: 15,
  },
  input: {
    fontSize: 16,
    backgroundColor: MyLightTheme.colors.white,
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
    backgroundColor: MyLightTheme.colors.greenDark,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    marginTop: 5,
    marginBottom: 10,
  },
  buttonText: {
    fontSize: 18,
    color: MyLightTheme.colors.white,
    fontFamily: FONTS.Kurale,
  },
  registerText: {
    fontSize: 16,
    color: MyLightTheme.colors.textPrimary,
    fontFamily: FONTS.SofiaSans,
  },
  registerLink: {
    color: MyLightTheme.colors.primary,
    fontFamily: FONTS.SofiaSansBold,
  },
});
