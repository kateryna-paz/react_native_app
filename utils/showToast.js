import Toast from "react-native-toast-message";

export const showToast = (type, message, duration = 4000) => {
  Toast.show({
    type,
    text1: message,
    visibilityTime: duration,
  });
};
