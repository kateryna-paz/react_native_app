import React, { useEffect } from "react";
import { View, Text, Alert } from "react-native";
import { IconButton, TextInput } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import { fetchPanelTypes } from "../../store/slices/typesSlice";
import { changePanel, deletePanel } from "../../store/slices/panelSlice";
import { useSelector, useDispatch } from "react-redux";
import PanelDialog from "../UI/PanelDialog";
import DeletePanelDialog from "../UI/DeletePanelDialog";

export default function PanelCard({
  id,
  square,
  number,
  typeId,
  type,
  refresh,
  panelTypes,
}) {
  const [panelData, setPanelData] = React.useState({
    square: square || 0,
    number: number || 0,
    typeId: typeId || null,
  });
  const [reductOpen, setReductOpen] = React.useState(false);
  const [deleteOpen, setDeleteOpen] = React.useState(false);

  const dispatch = useDispatch();

  const handleReductPanel = () => {
    setReductOpen((vis) => !vis);
  };
  const handleDeleteDialog = () => {
    setDeleteOpen((vis) => !vis);
  };

  const handleSaveChanges = () => {
    if (panelData.square <= 0 || panelData.number <= 0 || !panelData.typeId) {
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

  const handleDelete = () => {
    console.log(id);
    dispatch(deletePanel({ id }))
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
        marginHorizontal: 20,
        marginTop: 20,
        marginBottom: 10,
        paddingTop: 6,
        paddingBottom: 15,
        paddingHorizontal: 15,
        borderRadius: 12,
      }}
    >
      {reductOpen && (
        <PanelDialog
          visible={reductOpen}
          hideDialog={() => setReductOpen(false)}
          saveChanges={handleSaveChanges}
          panelData={panelData}
          setPanelData={setPanelData}
          panelTypes={panelTypes}
          title={"Редагування панелі"}
        />
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
        colors={["#2EB84E", "#1f6228"]}
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
          iconColor="#83CFFF"
          style={{ borderRadius: 10, borderWidth: 2, borderColor: "#83CFFF" }}
          onPress={handleReductPanel}
        />

        <IconButton
          icon={"delete"}
          mode="outlined"
          size={20}
          iconColor="#00120B"
          style={{ borderRadius: 10, borderWidth: 2, borderColor: "#00120B" }}
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
            {square} м²
          </Text>
          <Text
            style={{
              fontFamily: "Kurale",
              fontSize: 14,
              textAlign: "center",
              color: "white",
            }}
          >
            Площа 1 панелі
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
