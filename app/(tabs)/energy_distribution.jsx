import { Link, router, useNavigation } from "expo-router";
import MapView, { Callout, Marker, PROVIDER_GOOGLE } from "react-native-maps";
import {
  Alert,
  Button,
  Image,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useState } from "react";

export default function EnergyDistibutionScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Energy Distribution</Text>
      <Pressable
        style={styles.link}
        onPress={() => {
          router.push("/");
        }}
      >
        <Text> to index.js </Text>
      </Pressable>
    </View>
  );
}

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
