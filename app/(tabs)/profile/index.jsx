import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import UserInfoSection from "../../../components/profile/UserInfoSection";
import LocationSection from "../../../components/profile/LocationSection";
import PanelsInfoSection from "../../../components/profile/PanelsInfoSection";
import LogoutButton from "../../../components/UI/LogoutButton";
import { useDispatch, useSelector } from "react-redux";
import ErrorText from "../../../components/UI/ErrorText";
import { ActivityIndicator } from "react-native-paper";
import MyContainer from "../../../components/UI/MyContainer";

export default function ProfileScreen() {
  const {
    user,
    isLoading,
    error: userError,
  } = useSelector((state) => state.auth);

  if (userError) {
    return <ErrorText error={userError} />;
  }
  if (isLoading) {
    <ActivityIndicator
      size={60}
      color="#360a70"
      style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
    />;
  }
  return (
    <MyContainer backgroundImage={require("../../../assets/bg2.jpg")}>
      <ScrollView contentContainerStyle={styles.container}>
        <LogoutButton
          styles={{
            position: "absolute",
            top: 16,
            right: 10,
            borderWidth: 2,
            zIndex: 10,
            borderColor: "#ba0b0b",
          }}
        />
        <UserInfoSection user={user} />
        <LocationSection />
        <PanelsInfoSection user={user} />
      </ScrollView>
    </MyContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 14,
    paddingBottom: 100,
  },
});
