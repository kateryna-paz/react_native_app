import { BaseToast, ErrorToast } from "react-native-toast-message";
import { MyLightTheme } from "../assets/theme/global";

export const toastConfig = {
  success: (props) => (
    <BaseToast
      {...props}
      style={{
        borderLeftColor: MyLightTheme.colors.green,
        top: -20,
      }}
      text1Style={{
        fontSize: 14,
        fontWeight: "bold",
      }}
      text2Style={{
        fontSize: 12,
      }}
    />
  ),
  error: (props) => (
    <ErrorToast
      {...props}
      style={{ borderLeftColor: MyLightTheme.colors.accent, top: -20 }}
      text1Style={{
        fontSize: 14,
        fontWeight: "bold",
      }}
      text2Style={{
        fontSize: 12,
      }}
    />
  ),
  info: (props) => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: MyLightTheme.colors.secondary, top: -20 }}
      text1Style={{
        fontSize: 14,
        fontWeight: "bold",
      }}
      text2Style={{
        fontSize: 12,
      }}
    />
  ),
};
