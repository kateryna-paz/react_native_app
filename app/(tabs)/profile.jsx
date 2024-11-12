import { Link, router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default EnergyDestibutionScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Profile</Text>
      <Pressable
        style={styles.link}
        onPress={() => {
          router.push("/devices");
        }}
      >
        <Text> to index.js </Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  link: {
    marginTop: 20,
    padding: 10,
    borderRadius: 5,
    backgroundColor: "#333",
    color: "#fff",
    fontSize: 18,
  },
  text: {
    fontSize: 28,
    lineHeight: 32,
    marginTop: -6,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
