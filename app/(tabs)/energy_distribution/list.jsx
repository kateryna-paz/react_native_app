import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import MyContainer from "../../../components/UI/MyContainer";
import { FONTS, MyLightTheme } from "../../../assets/theme/global";
import { useDispatch, useSelector } from "react-redux";
import LoadingScreen from "../../../components/UI/LoadingScreen";
import { useEffect, useState } from "react";
import { fetchDevices } from "../../../store/slices/devicesSlice";
import DevicesList from "../../../components/devices/DevicesList";
import ErrorScreen from "../../../components/UI/ErrorScreen";
import BackButton from "../../../components/UI/BackButton";
import { showToast } from "../../../utils/showToast";
import { useRouter } from "expo-router";

export default function DistibutionScreen() {
  const dispatch = useDispatch();
  const router = useRouter();

  const [refreshing, setRefreshing] = useState(false);

  const { devices, isLoading, error } = useSelector((state) => state.devices);
  const { selectedDevices } = useSelector((state) => state.distributeDevices);

  const refresh = async () => {
    try {
      setRefreshing(true);
      dispatch(fetchDevices());
    } catch (err) {
      showToast("error", "Упс... Сталася помилка при оновленні даних.");
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    dispatch(fetchDevices());
  }, [dispatch]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (error) {
    return (
      <ErrorScreen
        errorMessage={error}
        onRefresh={refresh}
        refreshing={refreshing}
      />
    );
  }
  return (
    <MyContainer
      colorStart={MyLightTheme.colors.primaryLight}
      colorEnd={MyLightTheme.colors.secondaryLight}
    >
      <BackButton
        stylesBtn={{
          position: "absolute",
          zIndex: 10,
          top: 12,
          left: 16,
          backgroundColor: MyLightTheme.colors.transparent,
          shadowColor: MyLightTheme.colors.transparent,
          elevation: 0,
        }}
        iconColor={MyLightTheme.colors.primary}
        onPress={() => router.push("/energy_distribution")}
      />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refresh}
            enabled={true}
            progressViewOffset={50}
            progressBackgroundColor={MyLightTheme.colors.secondaryLight}
            tintColor={MyLightTheme.colors.secondaryLight}
            titleColor={MyLightTheme.colors.secondaryLight}
            refreshingProp={0.4}
          />
        }
      >
        <View style={styles.container}>
          <Text style={styles.text}>Працюючі прилади</Text>
          {devices && devices.length > 0 && (
            <DevicesList devices={selectedDevices} refresh={refresh} />
          )}
        </View>
      </ScrollView>
    </MyContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 110,
  },
  text: {
    fontSize: 20,
    textAlign: "center",
    color: MyLightTheme.colors.black,
    fontFamily: FONTS.Kurale,
    lineHeight: 28,
    marginBottom: 20,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
  },
});
