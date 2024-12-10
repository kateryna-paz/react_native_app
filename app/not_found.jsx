import { Link } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { MyLightTheme } from "../assets/theme/global";

export default function NotFoundScreen() {
  return (
    <View>
      <Text style={styles.text}>
        Sorry, the page you are looking for could not be found.
      </Text>
      <Link href="/home" styles={styles.link}>
        Go to Home {"->"}{" "}
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 28,
    lineHeight: 32,
    marginBottom: 5,
  },
  link: {
    marginTop: 20,
    padding: 10,
    borderRadius: 5,
    backgroundColor: MyLightTheme.colors.textPrimary,
    color: MyLightTheme.colors.textOnPrimary,
    fontSize: 18,
  },
});
