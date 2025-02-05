import React from "react";
import { View, Text, StyleSheet } from "react-native";
import PanelCard from "./PanelCard";
import { ActivityIndicator, IconButton } from "react-native-paper";
import DialogCreation from "../UI/DialogCreation";
import ErrorText from "../UI/ErrorText";
import ReductPanelCard from "./ReductCardPanel";
import { FONTS, MyLightTheme } from "../../assets/theme/global";
import CustomAlert from "../UI/CustomAlert";
import { usePanelsInfo } from "../../hooks/profile/usePanelsInfo";

export default function PanelsInfoSection({ user }) {
  const {
    panels,
    panelTypes,
    panelData,
    setPanelData,
    showAlert,
    openAddDialog,
    isLoading,
    isError,
    error,
    errorTypes,
    handleConfirm,
    handleAddPanel,
    refresh,
    closeAddDialog,
    openAddPanelDialog,
  } = usePanelsInfo({ user });

  if (isLoading || isError) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Сонячні панелі</Text>
        <View style={{ alignItems: "center" }}>
          {(errorTypes || error) && <ErrorText error={isError} />}
          {isLoading && !isError && (
            <ActivityIndicator
              style={{ marginTop: 30, marginBottom: 20 }}
              size="small"
              color={MyLightTheme.colors.primary}
            />
          )}
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Сонячні панелі</Text>
      <View style={{ alignItems: "center" }}>
        {!error && !isLoading && panels && panels.length === 0 && (
          <Text
            style={{
              textAlign: "center",
              fontFamily: FONTS.Marmelad,
              color: MyLightTheme.colors.textSecondary,
              fontSize: 16,
              marginTop: 10,
              marginBottom: 10,
            }}
          >
            Жодної панелі ще не додано.
          </Text>
        )}

        {panels &&
          panels.map((panel) => (
            <PanelCard
              key={panel.id}
              id={panel.id}
              power={panel.power}
              number={panel.number}
              typeId={panel.typeId}
              type={panel.type}
              panelTypes={panelTypes}
              refresh={refresh}
            />
          ))}
        {panels && !errorTypes && (
          <IconButton
            icon="plus"
            mode="contained"
            containerColor={MyLightTheme.colors.secondaryDark}
            iconColor={MyLightTheme.colors.white}
            style={{ marginTop: 10 }}
            size={30}
            onPress={openAddPanelDialog}
          />
        )}
        <DialogCreation
          visible={openAddDialog}
          hideDialog={closeAddDialog}
          saveChanges={handleAddPanel}
          title="Додати нову панель"
        >
          <ReductPanelCard
            panelTypes={panelTypes}
            panelData={panelData}
            setPanelData={setPanelData}
          />
        </DialogCreation>
        <CustomAlert
          title={"Помилка створення нової панелі"}
          showAlert={showAlert}
          onConfirm={handleConfirm}
          message={
            "Будь ласка, оберіть тип панелей, введіть потужність 1 панелі (у Вт) та кількість таких панелей."
          }
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 10,
    marginVertical: 8,
    paddingBottom: 8,
  },
  title: {
    fontFamily: FONTS.Marmelad,
    fontSize: 26,
    marginLeft: 10,
    marginBottom: 6,
  },
});
