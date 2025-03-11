import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import MyContainer from "../../../components/UI/MyContainer";
import { IconButton } from "react-native-paper";
import { FONTS, MyLightTheme } from "../../../assets/theme/global";
import LoadingScreen from "../../../components/UI/LoadingScreen";
import ErrorScreen from "../../../components/UI/ErrorScreen";
import DialogCreation from "../../../components/UI/DialogCreation";
import ReductDeviceCard from "../../../components/devices/ReductDeviceCard";
import DevicesList from "../../../components/devices/DevicesList";
import Header from "../../../components/UI/Header";
import CustomAlert from "../../../components/UI/CustomAlert";
import { useDevices } from "../../../hooks/devices/useDevices";

export default function DevicesScreen() {
  const {
    devices,
    isLoading,
    error,
    deviceData,
    setDeviceData,
    refreshing,
    openAddDialog,
    setOpenAddDialog,
    showAlert,
    setShowAlert,
    handleAddDevice,
    refresh,
  } = useDevices();

  if (isLoading) {
    return <LoadingScreen title={"Прилади"} />;
  }

  if (error) {
    return (
      <ErrorScreen
        errorMessage={error}
        onRefresh={refresh}
        refreshing={refreshing}
        title={"Прилади"}
      />
    );
  }

  return (
    <MyContainer
      colorStart={MyLightTheme.colors.primaryLight}
      colorEnd={MyLightTheme.colors.secondaryLight}
    >
      <Header title={"Прилади"} />
      <View style={styles.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
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
            />
          }
        >
          {devices.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.text}>
                Додайте інформацію про перший пристрій, натиснувши на кнопку
                нижче.
              </Text>
            </View>
          ) : (
            <DevicesList devices={devices} refresh={refresh} />
          )}
        </ScrollView>
        <View style={styles.addButtonContainer}>
          <IconButton
            icon="plus"
            mode="contained"
            containerColor={MyLightTheme.colors.primary}
            iconColor={MyLightTheme.colors.white}
            size={40}
            onPress={() => setOpenAddDialog(true)}
          />
        </View>
      </View>

      <CustomAlert
        showAlert={showAlert}
        onConfirm={() => setShowAlert(false)}
        showCancelButton={false}
        message="Будь ласка, введіть ім'я та потужність приладу, також оберіть його пріоритет при розподілені енергії."
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
    </MyContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: -22,
  },
  scrollView: {
    flex: 1,
    marginBottom: 100,
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
    marginBottom: 20,
  },
  addButtonContainer: {
    position: "absolute",
    bottom: 20,
    right: 20,
    left: 20,
    alignItems: "center",
  },
});
