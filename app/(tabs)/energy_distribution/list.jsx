import { RefreshControl, ScrollView, StyleSheet, View } from "react-native";
import MyContainer from "../../../components/UI/MyContainer";
import { MyLightTheme } from "../../../assets/theme/global";
import LoadingScreen from "../../../components/UI/LoadingScreen";
import DevicesList from "../../../components/devices/DevicesList";
import ErrorScreen from "../../../components/UI/ErrorScreen";
import BackButton from "../../../components/UI/BackButton";
import Header from "../../../components/UI/Header";
import AnimatedText from "../../../components/distribution/AnimatedText";
import { useListDistribute } from "../../../hooks/distribute/useListDistribute";

export default function DistributionScreen() {
  const {
    selectedDevices,
    unselectedDevices,
    isLoading,
    error,
    refreshing,
    refresh,
    handleToggleSelectDevice,
  } = useListDistribute();

  if (error) {
    return (
      <ErrorScreen
        errorMessage={error}
        onRefresh={refresh}
        refreshing={refreshing}
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
      <Header title={"Розподіл енергії"} />
      <BackButton
        stylesBtn={{
          position: "absolute",
          zIndex: 10,
          top: 12,
          left: 12,
          backgroundColor: MyLightTheme.colors.transparent,
          shadowColor: MyLightTheme.colors.transparent,
          elevation: 0,
        }}
        iconColor={MyLightTheme.colors.primary}
      />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
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
        <AnimatedText text={"Працюючі прилади"} />

        <View style={styles.container}>
          {selectedDevices?.length > 0 ? (
            <DevicesList
              devices={selectedDevices}
              toggleSelect={handleToggleSelectDevice}
              selected
            />
          ) : (
            <AnimatedText style={styles.smallText} text={"Таких немає"} />
          )}

          <AnimatedText text={"Непрацюючі прилади"} />

          {unselectedDevices?.length > 0 ? (
            <DevicesList
              devices={unselectedDevices}
              toggleSelect={handleToggleSelectDevice}
            />
          ) : (
            <AnimatedText style={styles.smallText} text={"Таких немає"} />
          )}
        </View>
      </ScrollView>
    </MyContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  smallText: {
    fontSize: 16,
    color: MyLightTheme.colors.textSecondary,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
  },
});
