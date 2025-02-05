import LottieView from "lottie-react-native";

export const AnimatedIcon = () => {
  return (
    <LottieView
      source={require("../../assets/img/work.json")}
      autoPlay
      loop
      style={{ width: 310, height: 310 }}
    />
  );
};
