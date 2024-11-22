import { Pressable, StyleSheet, Text, View } from "react-native";
import UserInfoSection from "../../../components/profile/UserInfoSection";
import LocationSection from "../../../components/profile/LocationSection";
import PanelsInfoSection from "../../../components/profile/PanelsInfoSection";

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <UserInfoSection />
      <LocationSection />
      <PanelsInfoSection />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
});
