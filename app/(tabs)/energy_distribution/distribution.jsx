import { router } from "expo-router";
import {
  Alert,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import MyContainer from "../../../components/UI/MyContainer";
import { Icon, useTheme } from "react-native-paper";
import { MyLightTheme } from "../../../assets/theme/global";
import { useDispatch, useSelector } from "react-redux";
import LoadingScreen from "../../../components/UI/LoadingScreen";
import { useEffect, useState } from "react";
import { fetchDevices } from "../../../store/slices/devicesSlice";
import DevicesList from "../../../components/devices/DevicesList";
import ErrorScreen from "../../../components/UI/ErrorScreen";

export default function DistibutionScreen() {
  const theme = useTheme();
  const dispatch = useDispatch();

  const [refreshing, setRefreshing] = useState(false);

  const { devices, isLoading, error } = useSelector((state) => state.devices);
  const deviceCount = devices?.length || 0;

  const refresh = async () => {
    try {
      setRefreshing(true);
      dispatch(fetchDevices());
    } catch (err) {
      Alert.alert("Упс... Сталася помилка при оновленні даних.", `${err}`);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    dispatch(fetchDevices());
  }, [dispatch]);

  if (isLoading) {
    return (
      <LoadingScreen
        colorStart={theme.colors.secondaryDark}
        colorEnd={theme.colors.secondaryLight}
        indicatorColor={theme.colors.white}
      />
    );
  }

  if (error) {
    return (
      <ErrorScreen
        colorStart={theme.colors.secondaryDark}
        colorEnd={theme.colors.secondaryLight}
        theme={theme}
        errorMessage={error}
        onRefresh={refresh}
        refreshing={refreshing}
      />
    );
  }
  return (
    <MyContainer
      colorStart={theme.colors.secondaryDark}
      colorEnd={theme.colors.secondaryLight}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refresh}
            enabled={true}
            progressViewOffset={50}
            progressBackgroundColor={theme.colors.secondaryLight}
            tintColor={theme.colors.secondaryLight}
            titleColor={theme.colors.secondaryLight}
            refreshingProp={0.4}
          />
        }
      >
        {deviceCount === 0 && (
          <View style={styles.container}>
            <Text style={styles.text}>
              Ви ще не додали жодного пристрою до свого списку. 😿 {"\n\n"}{" "}
              Додайте перший пристрій, щоб активувати функцію розподілу енергії
              між ними.
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
              <Icon source={"arrow-right-thin"} size={20} color="black" />
            </Pressable>
          </View>
        )}

        <View style={styles.container}>
          <Text style={styles.text}>Працюючі прилади</Text>
          {devices && devices.length > 0 && (
            <DevicesList devices={devices} refresh={refresh} />
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
    color: MyLightTheme.colors.white,
    fontFamily: "Kurale",
    lineHeight: 28,
    marginBottom: 20,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  link: {
    marginTop: 20,
    paddingVertical: 16,
    paddingBottom: 14,
    paddingHorizontal: 26,
    borderRadius: 25,
    backgroundColor: MyLightTheme.colors.green,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  buttonText: {
    fontSize: 18,
    color: MyLightTheme.colors.black,
    fontFamily: "Kurale",
    textAlign: "center",
    paddingBottom: 2,
  },
});