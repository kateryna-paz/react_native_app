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
import { TextInput } from "react-native-paper";
import BackButton from "../../../components/UI/BackButton";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../../store/slices/authSlice";
import { ActivityIndicator } from "react-native";

const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

export default function Login() {
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
      <View style={styles.container}>
        <ImageBackground
          source={require("../../../assets/bg2.jpg")}
          style={styles.image}
        >
          <ActivityIndicator
            size={60}
            color="#360a70"
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          />
        </ImageBackground>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../../../assets/bg2.jpg")}
        style={styles.image}
      >
        <BackButton
          stylesBtn={styles.backButton}
          onPress={() => router.push("/auth")}
          iconColor={"white"}
        />
        <View style={styles.form}>
          <Text style={styles.title}>Login</Text>

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
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
          <Text style={styles.registerText}>
            Don't have an account?{" "}
            <Text
              style={styles.registerLink}
              onPress={() => router.push("/auth/register")}
            >
              Sign Up
            </Text>
          </Text>
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
  backButton: {
    position: "absolute",
    top: 40,
    left: 20,
    backgroundColor: "#672ab7",
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "white",
  },
  form: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    marginBottom: 20,
    color: "black",
    fontFamily: "RobotoSlab",
  },
  input: {
    width: "100%",
    fontFamily: "Marmelad",
    paddingHorizontal: 10,
    fontSize: 16,
    marginBottom: 15,
  },
  button: {
    width: "100%",
    height: 50,
    backgroundColor: "#1f6228",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    marginBottom: 20,
  },
  buttonText: {
    fontSize: 18,
    color: "#fff",
    fontFamily: "Marmelad",
  },
  registerText: {
    fontSize: 16,
    color: "#333",
    fontFamily: "RobotoSlab",
  },
  registerLink: {
    color: "#1f6228",
    fontFamily: "RobotoSlabBold",
  },
});
