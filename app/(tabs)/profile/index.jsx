import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import UserInfoSection from "../../../components/profile/UserInfoSection";
import LocationSection from "../../../components/profile/LocationSection";
import PanelsInfoSection from "../../../components/profile/PanelsInfoSection";
import LogoutButton from "../../../components/UI/LogoutButton";
import { useDispatch } from "react-redux";

export default function ProfileScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <LogoutButton
        styles={{
          position: "absolute",
          top: 14,
          right: 14,
          borderWidth: 3,
          borderColor: "#ba0b0b",
        }}
      />
      <UserInfoSection />
      <LocationSection />
      <PanelsInfoSection />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    paddingBottom: 90,
  },
});
