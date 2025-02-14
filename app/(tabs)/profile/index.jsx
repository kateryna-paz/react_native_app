import { ScrollView, StyleSheet } from "react-native";
import UserInfoSection from "../../../components/profile/UserInfoSection";
import LocationSection from "../../../components/profile/LocationSection";
import PanelsInfoSection from "../../../components/profile/PanelsInfoSection";
import LogoutButton from "../../../components/UI/LogoutButton";
import MyContainer from "../../../components/UI/MyContainer";
import LoadingScreen from "../../../components/UI/LoadingScreen";
import ErrorScreen from "../../../components/UI/ErrorScreen";
import Header from "../../../components/UI/Header";
import { MyLightTheme } from "../../../assets/theme/global";
import useAuthStore from "../../../store/authStore";
import { useState } from "react";
import { showToast } from "../../../utils/showToast";

export default function ProfileScreen() {
  const { user, isLoading, error: userError } = useAuthStore();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    try {
      setRefreshing(true);
    } catch (error) {
      showToast("error", "Не вдалося оновити дані.");
    } finally {
      setRefreshing(false);
    }
  };

  if (userError) {
    return (
      <ErrorScreen
        errorMessage={userError}
        onRefresh={onRefresh}
        refreshing={refreshing}
        title={"Профіль"}
      />
    );
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
