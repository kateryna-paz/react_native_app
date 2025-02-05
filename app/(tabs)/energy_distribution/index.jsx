import { router } from "expo-router";
import {
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import MyContainer from "../../../components/UI/MyContainer";
import { Icon } from "react-native-paper";
import { FONTS, MyLightTheme } from "../../../assets/theme/global";
import { useDispatch, useSelector } from "react-redux";
import LoadingScreen from "../../../components/UI/LoadingScreen";
import { useEffect, useState } from "react";
import { fetchDevices } from "../../../store/slices/devicesSlice";
import ErrorScreen from "../../../components/UI/ErrorScreen";
import SelectDevices from "../../../components/distribution/SelectDevices";
import { setSelectedDevices } from "../../../store/slices/distributeDevicesSlice";
import Header from "../../../components/UI/Header";
import { showToast } from "../../../utils/showToast";

export default function EnergyDistibutionScreen() {
  const dispatch = useDispatch();

  const [refreshing, setRefreshing] = useState(false);

  const { devices, isLoading, error } = useSelector((state) => state.devices);

  const [selectedDevices, setSelectedDevicesLocal] = useState([]);

  const deviceCount = devices?.length || 0;

  const refresh = async () => {
    try {
      setRefreshing(true);
      dispatch(fetchDevices());
    } catch (_) {
      showToast("error", "Упс... Сталася помилка при оновленні даних.");
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    dispatch(fetchDevices());
  }, [dispatch]);

  const toggleSelectDevice = (deviceId) => {
    setSelectedDevicesLocal((prev) =>
      prev.find((dev) => dev.id === deviceId)
        ? prev.filter((dev) => dev.id !== deviceId)
        : [...prev, { ...devices.find((dev) => dev.id === deviceId) }]
    );
  };

  const handleDistribute = async () => {
    if (selectedDevices.length === 0) {
      showToast("error", "Будь ласка, оберіть хоча б один пристрій.");
      return;
    }
    await dispatch(setSelectedDevices(selectedDevices));
    router.push("/energy_distribution/list");
  };

  if (isLoading) {
    return <LoadingScreen title={"Розподіл енергії"} />;
  }

  if (error) {
    return (
      <ErrorScreen
        errorMessage={error}
        onRefresh={refresh}
        refreshing={refreshing}
        title={"Розподіл енергії"}
      />
    );
  }

  return (
    <MyContainer
      colorStart={MyLightTheme.colors.primaryLight}
      colorEnd={MyLightTheme.colors.secondaryLight}
    >
      <Header title={"Розподіл енергії"} />
      <View style={styles.container}>
        {deviceCount === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.text}>
              Додайте спочатку перший пристрій, щоб активувати функцію розподілу
              енергії.
            </Text>
            <Pressable
              style={styles.link}
              onPress={() => {
                router.push("/devices");
              }}
            >
              <Text style={styles.buttonText}>
                Перейти на сторінку Приладів{" "}
              </Text>
              <Icon
                source={"arrow-right-thin"}
                size={20}
                color={MyLightTheme.colors.black}
              />
            </Pressable>
          </View>
        ) : (
          <Text style={styles.text}>
            Оберіть прилади, між якими хочете розподілити енергію
          </Text>
        )}
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
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
          {deviceCount > 0 && (
            <SelectDevices
              devices={devices}
              toggleSelectDevice={toggleSelectDevice}
            />
          )}
        </ScrollView>

        {deviceCount > 0 && (
          <Pressable
            style={[styles.link, styles.button]}
            onPress={handleDistribute}
          >
            <Text
              style={[
                styles.buttonText,
                { color: MyLightTheme.colors.white, textAlign: "center" },
              ]}
            >
              Розподілити енергію
            </Text>
          </Pressable>
        )}
      </View>
    </MyContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginVertical: 12,
  },
  scrollView: {
    flex: 1,
    marginBottom: 10,
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingHorizontal: 16,
  },
  emptyState: {
    alignItems: "center",
    marginTop: 50,
  },
  text: {
    fontSize: 20,
    textAlign: "center",
    color: MyLightTheme.colors.black,
    fontFamily: FONTS.Kurale,
    lineHeight: 28,
    marginBottom: 20,
    marginHorizontal: 10,
  },
  link: {
    marginTop: 20,
    paddingVertical: 16,
    paddingBottom: 14,
    paddingHorizontal: 26,
    borderRadius: 25,
    backgroundColor: MyLightTheme.colors.secondary,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: MyLightTheme.colors.green,
    shadowOffset: { width: 8, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 4,
    elevation: 6,
  },
  buttonText: {
    fontSize: 18,
    color: MyLightTheme.colors.black,
    fontFamily: FONTS.Kurale,
    textAlign: "center",
    paddingBottom: 2,
  },
  button: {
    marginHorizontal: 25,
    justifyContent: "center",
    paddingVertical: 12,
    backgroundColor: MyLightTheme.colors.greenDark,
  },
});
