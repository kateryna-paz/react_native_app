import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import UserInfoSection from "../../../components/profile/UserInfoSection";
import LocationSection from "../../../components/profile/LocationSection";
import PanelsInfoSection from "../../../components/profile/PanelsInfoSection";
import LogoutButton from "../../../components/UI/LogoutButton";
import { useDispatch, useSelector } from "react-redux";
import ErrorText from "../../../components/UI/ErrorText";
import { ActivityIndicator, useTheme } from "react-native-paper";
import MyContainer from "../../../components/UI/MyContainer";
import LoadingScreen from "../../../components/UI/LoadingScreen";

export default function ProfileScreen() {
  const theme = useTheme();
  const {
    user,
    isLoading,
    error: userError,
  } = useSelector((state) => state.auth);

  if (userError) {
    return <ErrorText error={userError} />;
  }
  if (isLoading) {
    return (
      <LoadingScreen
        colorStart={theme.colors.secondaryDark}
        colorEnd={theme.colors.secondaryLight}
        indicatorColor={theme.colors.white}
      />
    );
  }
  return (
    <MyContainer
      colorStart={theme.colors.secondaryDark}
      colorEnd={theme.colors.secondaryLight}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <LogoutButton
          styles={{
            position: "absolute",
            top: 16,
            right: 10,
            borderWidth: 2,
            zIndex: 10,
            borderColor: theme.colors.red,
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
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
});
