import { ScrollView, StyleSheet } from "react-native";
import UserInfoSection from "../../../components/profile/UserInfoSection";
import LocationSection from "../../../components/profile/LocationSection";
import PanelsInfoSection from "../../../components/profile/PanelsInfoSection";
import LogoutButton from "../../../components/UI/LogoutButton";
import { useSelector } from "react-redux";
import ErrorText from "../../../components/UI/ErrorText";
import MyContainer from "../../../components/UI/MyContainer";
import LoadingScreen from "../../../components/UI/LoadingScreen";
import Header from "../../../components/UI/Header";
import { MyLightTheme } from "../../../assets/theme/global";

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
    return <LoadingScreen />;
  }
  return (
    <MyContainer
      colorStart={MyLightTheme.colors.primaryLight}
      colorEnd={MyLightTheme.colors.secondaryLight}
    >
      <LogoutButton
        styles={{
          position: "absolute",
          top: 10,
          right: 2,
          borderWidth: 0,
          zIndex: 10,
        }}
      />
      <Header title={"Профіль"} />

      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
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
  },
});
