import { View, Text, StyleSheet } from "react-native";
import { IconButton } from "react-native-paper";
import DialogCreation from "../UI/DialogCreation";
import DeletePanelDialog from "../UI/DeletePanelDialog";
import ReductPanelCard from "./ReductCardPanel";
import { FONTS, MyLightTheme } from "../../assets/theme/global";
import CustomAlert from "../UI/CustomAlert";
import { usePanelCard } from "../../hooks/profile/usePanelCard";

export default function PanelCard({
  id,
  power,
  number,
  typeId,
  type,
  refresh,
  panelTypes,
}) {
  const {
    panelData,
    setPanelData,
    reductOpen,
    deleteOpen,
    showAlert,
    handleReductPanel,
    handleDeleteDialog,
    handleConfirm,
    handleSaveChanges,
    handleDelete,
    closeReductDialog,
    closeDeleteDialog,
  } = usePanelCard({ id, power, number, typeId, refresh });

  return (
    <View style={styles.container}>
      {reductOpen && (
        <DialogCreation
          visible={reductOpen}
          hideDialog={closeReductDialog}
          saveChanges={handleSaveChanges}
          title={"Редагування панелі"}
        >
          <ReductPanelCard
            panelTypes={panelTypes}
            panelData={panelData}
            setPanelData={setPanelData}
          />
        </DialogCreation>
      )}

      {deleteOpen && (
        <DeletePanelDialog
          visible={deleteOpen}
          hideDialog={closeDeleteDialog}
          deletePanel={handleDelete}
          panelData={panelData}
          panelTypes={panelTypes}
        />
      )}

      <View style={styles.headerContainer}>
        <Text style={styles.typeText}>{type}</Text>
        <IconButton
          icon={"pencil"}
          mode="outlined"
          size={20}
          iconColor={MyLightTheme.colors.secondaryDark}
          style={styles.actionButton}
          onPress={handleReductPanel}
        />
        <IconButton
          icon={"delete"}
          mode="outlined"
          size={20}
          iconColor={MyLightTheme.colors.primary}
          style={styles.actionButton}
          onPress={handleDeleteDialog}
        />
      </View>

      <View style={styles.infoContainer}>
        <View style={styles.infoBox}>
          <Text style={styles.infoValue}>{power} Вт</Text>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoValue}>{number} шт</Text>
        </View>
      </View>
      <CustomAlert
        message={"Введіть коректні значення площі та кількості панелей."}
        showAlert={showAlert}
        onConfirm={handleConfirm}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    backgroundColor: MyLightTheme.colors.white,
    gap: 2,
    alignItems: "center",
    marginHorizontal: 4,
    marginVertical: 10,
    paddingBottom: 15,
    paddingHorizontal: 5,
    borderRadius: 10,
    paddingVertical: 4,
    borderColor: MyLightTheme.colors.primary,
    shadowColor: MyLightTheme.colors.black,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 5,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginLeft: 14,
    marginRight: 4,
  },
  typeText: {
    flex: 1,
    marginLeft: 4,
    fontFamily: FONTS.Kurale,
    fontSize: 20,
    color: MyLightTheme.colors.primaryDark,
  },
  actionButton: {
    borderWidth: 0,
    width: 28,
  },
  infoContainer: {
    flexDirection: "row",
    gap: 5,
    alignItems: "center",
    paddingHorizontal: 10,
  },
  infoBox: {
    width: "47%",
    borderRadius: 26,
    borderBottomWidth: 2,
    borderColor: MyLightTheme.colors.primaryDark,
    paddingBottom: 8,
    paddingTop: 2,
  },
  infoValue: {
    fontFamily: FONTS.Kurale,
    fontSize: 22,
    textAlign: "center",
    color: MyLightTheme.colors.greenDark,
  },
});
