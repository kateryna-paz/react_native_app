import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import UserInfoSection from "../../../components/profile/UserInfoSection";
import LocationSection from "../../../components/profile/LocationSection";
import PanelsInfoSection from "../../../components/profile/PanelsInfoSection";

export default function ProfileScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
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
