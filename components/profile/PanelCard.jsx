import { View, Text, Alert } from "react-native";
import { IconButton, TextInput, useTheme } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import { changePanel, deletePanel } from "../../store/slices/panelSlice";
import { useSelector, useDispatch } from "react-redux";
import DialogCreation from "../UI/DialogCreation";
import DeletePanelDialog from "../UI/DeletePanelDialog";
import { useState } from "react";
import ReductPanelCard from "./ReductCardPanel";

export default function PanelCard({
  id,
  power,
  number,
  typeId,
  type,
  refresh,
  panelTypes,
}) {
  const [panelData, setPanelData] = useState({
    power: power || 0,
    number: number || 0,
    typeId: typeId || null,
  });
  const [reductOpen, setReductOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const theme = useTheme();

  const dispatch = useDispatch();

  const handleReductPanel = () => {
    setReductOpen((vis) => !vis);
  };
  const handleDeleteDialog = () => {
    setDeleteOpen((vis) => !vis);
  };

  const handleSaveChanges = () => {
    if (panelData.power <= 0 || panelData.number <= 0 || !panelData.typeId) {
      Alert.alert("Введіть коректні значення площі та кількості панелей.");
      return;
    }

    dispatch(changePanel({ id, ...panelData }))
      .unwrap()
      .then(() => Alert.alert("Дані успішно оновлені"))
      .catch(() => Alert.alert("Помилка при оновленні даних"));

    setReductOpen(false);
    refresh();
  };

  const handleDelete = async () => {
    console.log(id);
    await dispatch(deletePanel({ id }))
      .unwrap()
      .then(() => Alert.alert("Панель успішно видалена"))
      .catch(() => Alert.alert("Помилка при видаленні панелі"));
    setDeleteOpen(false);
    refresh();
  };

  return (
    <View
      style={{
        flexDirection: "column",
        gap: 10,
        alignItems: "center",
        marginHorizontal: 14,
        marginVertical: 10,
        paddingTop: 6,
        paddingBottom: 15,
        paddingHorizontal: 15,
        borderRadius: 12,
      }}
    >
      {reductOpen && (
        <DialogCreation
          visible={reductOpen}
          hideDialog={() => setReductOpen(false)}
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
          hideDialog={() => setDeleteOpen(false)}
          deletePanel={handleDelete}
          panelData={panelData}
          panelTypes={panelTypes}
        />
      )}
      <LinearGradient
        colors={[theme.colors.green, theme.colors.greenDark]}
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
          borderRadius: 10,
        }}
      />
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          alignItems: "center",
          marginLeft: 4,
        }}
      >
        <Text
          style={{
            flex: 1,
            fontFamily: "Kurale",
            fontSize: 22,
            color: "white",
          }}
        >
          {type}
        </Text>
        <IconButton
          icon={"pencil"}
          mode="outlined"
          size={20}
          iconColor={theme.colors.secondary}
          style={{
            borderRadius: 10,
            borderWidth: 2,
            borderColor: theme.colors.secondary,
          }}
          onPress={handleReductPanel}
        />

        <IconButton
          icon={"delete"}
          mode="outlined"
          size={20}
          iconColor={theme.colors.primary}
          style={{
            borderRadius: 10,
            borderWidth: 2,
            borderColor: theme.colors.primary,
          }}
          onPress={handleDeleteDialog}
        />
      </View>
      <View
        style={{
          flexDirection: "row",
          gap: 15,
          alignItems: "center",
        }}
      >
        <View
          style={{
            width: "47%",
            borderRadius: 10,
            borderWidth: 3,
            borderColor: "white",
            padding: 8,
          }}
        >
          <Text
            style={{
              fontFamily: "Kurale",
              fontSize: 30,
              textAlign: "center",
              color: "white",
              lineHeight: 40,
            }}
          >
            {power} Вт
          </Text>
          <Text
            style={{
              fontFamily: "Kurale",
              fontSize: 14,
              textAlign: "center",
              color: "white",
            }}
          >
            Потужність
          </Text>
        </View>

        <View
          style={{
            width: "47%",
            borderRadius: 10,
            borderWidth: 3,
            borderColor: "white",
            padding: 8,
          }}
        >
          <Text
            style={{
              fontFamily: "Kurale",
              fontSize: 30,
              textAlign: "center",
              color: "white",
              lineHeight: 40,
            }}
          >
            {number}
          </Text>
          <Text
            style={{
              fontFamily: "Kurale",
              fontSize: 14,
              textAlign: "center",
              color: "white",
            }}
          >
            Панелей
          </Text>
        </View>
      </View>
    </View>
  );
}
