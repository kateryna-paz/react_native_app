import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
} from "react-native";
import { useRouter } from "expo-router";

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
            <Text style={styles.title}>Welcome to SolarManager!</Text>
            <Text style={styles.subtitle}>
              Manage and monitor your solar panels with ease.
            </Text>
            <Text style={styles.started}>Let’s get started</Text>
          </View>

          <TouchableOpacity
            style={[styles.button, styles.logInButton]}
            onPress={() => router.push("/auth/login")}
          >
            <Text
              style={{ color: "#1f6228", fontFamily: "Kurale", fontSize: 20 }}
            >
              Log in
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.registerButton]}
            onPress={() => router.push("/auth/register")}
          >
            <Text
              style={{ color: "white", fontFamily: "Kurale", fontSize: 20 }}
            >
              Create an account
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  title: {
    fontSize: 42,
    fontFamily: "Marmelad",
    color: "black",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 20,
    fontFamily: "Kurale",
    color: "#666",
    marginBottom: 50,
  },
  started: {
    fontSize: 24,
    fontFamily: "RobotoSlab",
    color: "#333",
    marginBottom: 30,
    textAlign: "center",
  },
  logInButton: {
    backgroundColor: "#eefbf0",
    borderWidth: 3,
    borderColor: "#1f6228",
    marginBottom: 20,
    marginLeft: 10,
    marginRight: 40,
  },
  registerButton: {
    backgroundColor: "#672ab7",
    borderWidth: 3,
    borderColor: "#360a70",
    marginLeft: 40,
  },
});
