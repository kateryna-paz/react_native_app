import LottieView from "lottie-react-native";
import React from "react";

export default function AnimatedErrorIcon() {
  return (
    <LottieView
      source={require("../../assets/img/error.json")}
      autoPlay
      loop
      style={{ width: 300, height: 300, marginLeft: 20 }}
    />
  );
}
