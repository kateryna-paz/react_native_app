import { useState } from "react";
import { View, Text, StyleSheet, Alert, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { TextInput, Button, ActivityIndicator, Icon } from "react-native-paper";
import BackButton from "../../../components/UI/BackButton";
import { useDispatch, useSelector } from "react-redux";
import { setRegisterUserData } from "../../../store/slices/authSlice";
import MyContainer from "../../../components/UI/MyContainer";

const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

export default function RegisterScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const dispatch = useDispatch();
  const { isLoading, error } = useSelector((state) => state.auth);

  const handleRegister = async () => {
    if (!validateEmail(email)) {
      Alert.alert("Невірна електронна пошта");
      return;
    }
    if (password.length < 6) {
      Alert.alert("Пароль має містити не менше 6 символів");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Паролі не співпадають");
      return;
    }

    try {
      const resultAction = await dispatch(
        setRegisterUserData({ name, email, password })
      ).unwrap();
      router.push("/auth/register/panel");
    } catch (err) {
      Alert.alert("Помилка реєстрації:", err.message || "Щось пішло не так");
    }
  };

  if (isLoading) {
    return (
      <MyContainer backgroundImage={require("../../../assets/bg2.jpg")}>
        <ActivityIndicator
          size={60}
          color="#360a70"
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        />
      </MyContainer>
    );
  }

  return (
    <MyContainer backgroundImage={require("../../../assets/bg2.jpg")}>
      <BackButton
        stylesBtn={styles.backButton}
        onPress={() => router.push("/auth")}
      />
      <View style={styles.form}>
        <Text style={styles.title}>Створити акаунт</Text>
        <TextInput
          placeholder="Ім'я"
          value={name}
          onChangeText={setName}
          style={styles.input}
        />
        <TextInput
          placeholder="Електронна пошта"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          keyboardType="email-address"
        />
        <TextInput
          placeholder="Пароль"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
        />
        <TextInput
          placeholder="Підтвердження паролю"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          style={styles.input}
        />
        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Далі</Text>
          <Icon source="arrow-right-thin" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.loginText}>
          Вже маєте акаунт?{"  "}
          <Text
            style={styles.loginLink}
            onPress={() => router.push("/auth/login")}
          >
            Увійти
          </Text>
        </Text>
      </View>
    </MyContainer>
  );
}

const styles = StyleSheet.create({
  backButton: {
    position: "absolute",
    top: 20,
    left: 20,
    backgroundColor: "#f5f5f5",
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#672ab7",
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
    fontFamily: "Kurale",
  },
  input: {
    width: "100%",
    marginBottom: 15,
    backgroundColor: "#f5f5f5",
  },
  button: {
    width: "100%",
    height: 50,
    backgroundColor: "#672ab7",
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
    color: "#fff",
    fontFamily: "Kurale",
    lineHeight: 24,
  },
  loginText: {
    fontSize: 16,
    color: "#444",
    fontFamily: "SofiaSans",
  },
  loginLink: {
    color: "#1f6228",
    fontFamily: "SofiaSansBold",
  },
});
