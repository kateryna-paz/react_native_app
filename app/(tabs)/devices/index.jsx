import { Alert, StyleSheet, Text, View } from "react-native";
import MyContainer from "../../../components/UI/MyContainer";
import { Icon, IconButton, useTheme } from "react-native-paper";
import { MyLightTheme } from "../../../assets/theme/global";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { addDevice, fetchDevices } from "../../../store/slices/devicesSlice";
import LoadingScreen from "../../../components/UI/LoadingScreen";
import ErrorScreen from "../../../components/UI/ErrorScreen";
import DeviceCard from "../../../components/devices/DeviceCard";
import { importances } from "../../../constants/importanceDevices";
import DialogCreation from "../../../components/UI/DialogCreation";
import ReductDeviceCard from "../../../components/devices/ReductDeviceCard";
import DevicesList from "../../../components/devices/DevicesList";

export default function DevicesScreen() {
  const theme = useTheme();
  const dispatch = useDispatch();

  const { devices, isLoading, error } = useSelector((state) => state.devices);

  const [deviceData, setDeviceData] = useState({
    name: "",
    power: "",
    importanceId: null,
  });

  const [refreshing, setRefreshing] = useState(false);

  const [openAddDialog, setOpenAddDialog] = useState(false);

  const handleAddDevice = async () => {
    if (
      deviceData.name === "" ||
      deviceData.power <= 0 ||
      !deviceData.importanceId
    ) {
      Alert.alert(
        "Помилка створення нового приладу",
        "Будь ласка, оберіть тип важливість цього приладу при розподілені енергії, введіть його ім'я та потужність."
      );
      return;
    }
    await dispatch(
      addDevice({
        ...deviceData,
        importance: importances
          .find((imp) => imp.id === deviceData.importanceId)
          .type.toLocaleLowerCase(),
      })
    )
      .unwrap()
      .then(() => Alert.alert("Новий прилад успішно додано!"))
      .catch((err) =>
        Alert.alert("Упс... Сталася помилка при відправленні даних.", `${err}`)
      );

    setDeviceData({ name: "", power: "", importanceId: null });
    setOpenAddDialog(false);
    await refresh();
  };

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
      <View style={styles.container}>
        {!isLoading && !error && devices?.length === 0 && (
          <Text style={styles.text}>
            Додайте інформацію про перший пристрій, натиснувши на кнопку нижче.
          </Text>
        )}
        {devices && devices.length > 0 && (
          <DevicesList devices={devices} refresh={refresh} />
        )}
        <IconButton
          icon="plus"
          mode="contained"
          containerColor={theme.colors.primary}
          iconColor="white"
          style={{ marginTop: 10 }}
          size={40}
          onPress={() => {
            setOpenAddDialog(true);
          }}
        />
        <DialogCreation
          visible={openAddDialog}
          hideDialog={() => setOpenAddDialog(false)}
          title="Додати новий прилад"
          saveChanges={handleAddDevice}
        >
          <ReductDeviceCard
            deviceData={deviceData}
            setDeviceData={setDeviceData}
          />
        </DialogCreation>
      </View>
    </MyContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 110,
  },
  devicesContainer: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    width: "100%",
    gap: 12,
  },
  text: {
    fontSize: 20,
    textAlign: "center",
    color: MyLightTheme.colors.white,
    fontFamily: "Kurale",
    lineHeight: 28,
    marginBottom: 20,
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
