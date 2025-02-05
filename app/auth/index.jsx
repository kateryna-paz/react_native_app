import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
} from "react-native";
import { useRouter } from "expo-router";
import { FONTS, MyLightTheme } from "../../assets/theme/global";

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../../assets/bg.jpg")}
        style={styles.image}
      >
        <View style={{ padding: 30 }}>
          <View>
            <Text style={styles.title}>Вітаємо у SolarManager!</Text>
            <Text style={styles.subtitle}>
              Керуйте та контролюйте свої сонячні панелі з легкістю.
            </Text>
          </View>

          <TouchableOpacity
            style={[styles.button, styles.logInButton]}
            onPress={() => router.push("/auth/login")}
          >
            <Text
              style={{
                color: MyLightTheme.colors.greenDark,
                fontFamily: FONTS.Kurale,
                fontSize: 20,
              }}
            >
              Увійти
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.registerButton]}
            onPress={() => router.push("/auth/register")}
          >
            <Text
              style={{
                color: MyLightTheme.colors.white,
                fontFamily: FONTS.Kurale,
                fontSize: 20,
              }}
            >
              Зареєструватись
            </Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
  },
  image: {
    flex: 1,
    justifyContent: "center",
  },
  button: {
    width: "auto",
    height: 56,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: MyLightTheme.colors.black,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  title: {
    fontSize: 42,
    fontFamily: FONTS.Marmelad,
    color: MyLightTheme.colors.black,
    marginBottom: 50,
  },
  subtitle: {
    fontSize: 22,
    fontFamily: FONTS.Kurale,
    color: MyLightTheme.colors.primaryDark,
    marginBottom: 60,
    textAlign: "center",
  },
  logInButton: {
    backgroundColor: MyLightTheme.colors.white,
    borderWidth: 3,
    borderColor: MyLightTheme.colors.greenDark,
    marginBottom: 20,
    marginLeft: 10,
    marginRight: 40,
  },
  registerButton: {
    backgroundColor: MyLightTheme.colors.primary,
    borderWidth: 3,
    borderColor: MyLightTheme.colors.primaryDark,
    marginLeft: 40,
  },
});
