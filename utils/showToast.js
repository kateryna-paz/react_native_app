import Toast from "react-native-toast-message";

export const showToast = (type, message, text2, duration = 4000) => {
  Toast.show({
    type,
    text1: message,
    text2: text2,
    visibilityTime: duration,
  });
};
