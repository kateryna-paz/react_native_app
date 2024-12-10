import { useState } from "react";
import {
  View,
  Button,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { TextInput, useTheme } from "react-native-paper";
import BackButton from "../../../components/UI/BackButton";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../../store/slices/authSlice";
import { ActivityIndicator } from "react-native";
import MyContainer from "../../../components/UI/MyContainer";
import { MyLightTheme } from "../../../assets/theme/global";
import LoadingScreen from "../../../components/UI/LoadingScreen";

const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

export default function Login() {
  const theme = useTheme();
  const dispatch = useDispatch();
  const router = useRouter();
  const { user, isLoading, error } = useSelector((state) => state.auth);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Будь-ласка, введіть електронну пошту та пароль");
      return;
    }
    if (!validateEmail(email)) {
      Alert.alert("Невірна електронна пошта");
      return;
    }
    if (password.length < 6) {
      Alert.alert("Пароль має містити не менше 6 символів");
    }

    try {
      const resultAction = await dispatch(loginUser({ email, password }));

      if (loginUser.rejected.match(resultAction)) {
        Alert.alert("Невірна електронна пошта або пароль");
        console.error("Помилка входу в акаунт:", resultAction.payload);
      } else {
        Alert.alert("Вхід успішний!", "Раді вас бачити знов у SolarManager");
        router.push("/profile");
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      Alert.alert("Щось пішло не так. Спробуйте ще раз.");
    }
  };

  if (isLoading) {
    return (
      <LoadingScreen
        colorStart={theme.colors.primaryDark}
        colorEnd={theme.colors.primaryLight}
        indicatorColor={theme.colors.white}
      />
    );
  }

  return (
    <MyContainer
      colorStart={theme.colors.primaryDark}
      colorEnd={theme.colors.primaryLight}
    >
      <BackButton
        stylesBtn={styles.backButton}
        iconColor={theme.colors.white}
        onPress={() => router.push("/auth")}
      />
      <View style={styles.form}>
        <Text style={styles.title}>Увійти</Text>

        <TextInput
          label="Електронна пошта"
          mode="flat"
          value={email}
          onChangeText={(val) => setEmail(val)}
          style={styles.input}
          keyboardType="email-address"
        />
        <TextInput
          label="Пароль"
          mode="flat"
          secureTextEntry
          value={password}
          onChangeText={(val) => setPassword(val)}
          style={styles.input}
        />
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Увійти</Text>
        </TouchableOpacity>
        <Text style={styles.registerText}>
          Ще не маєте акаунта?{"  "}
          <Text
            style={styles.registerLink}
            onPress={() => router.push("/auth/register")}
          >
            Зареєструватись
          </Text>
        </Text>
      </View>
    </MyContainer>
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
  backButton: {
    position: "absolute",
    top: 20,
    left: 20,
    backgroundColor: MyLightTheme.colors.primaryDark,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: MyLightTheme.colors.white,
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
    fontFamily: "Kurale",
    color: "white",
  },
  input: {
    width: "100%",
    paddingHorizontal: 10,
    fontSize: 16,
    marginBottom: 15,
    backgroundColor: MyLightTheme.colors.background,
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
    color: "white",
    fontFamily: "Kurale",
  },
  registerText: {
    fontSize: 16,
    color: MyLightTheme.colors.textPrimary,
    fontFamily: "SofiaSans",
  },
  registerLink: {
    color: MyLightTheme.colors.primary,
    fontFamily: "SofiaSansBold",
  },
});
