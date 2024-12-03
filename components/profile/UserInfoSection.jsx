import React, { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import UserAvatar from "./UserAvatar";

export default function UserInfoSection({ user }) {
  return (
    <View style={styles.container}>
      <UserAvatar size={96} />
      <View style={styles.info}>
        <Text
          style={{
            fontFamily: "SofiaSansBold",
            fontSize: 28,
            marginLeft: 14,
          }}
        >
          {user ? user?.name : "Guest"}
        </Text>
        <Text
          style={{
            fontFamily: "Marmelad",
            fontSize: 17,
            color: "#555",
          }}
        >
          {user ? user?.email : "email@gmail.com"}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 14,
    display: "flex",
    flexDirection: "row",
    alignItems: "bottom",
    backgroundColor: "#f5f5f5",
    paddingVertical: 16,
    borderRadius: 8,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 4,
    elevation: 4,
  },
  info: {
    marginLeft: 16,
    marginBottom: 14,
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
    gap: 6,
  },
});
