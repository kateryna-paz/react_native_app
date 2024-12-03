import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { setRegisterPanel } from "../../../store/slices/panelSlice";
import { Button, Icon, TextInput } from "react-native-paper";
import MyContainer from "../../../components/UI/MyContainer";
import { fetchPanelTypes } from "../../../store/slices/typesSlice";
import { useDispatch, useSelector } from "react-redux";
import SelectList from "../../../components/UI/SelectList";
import { useRouter } from "expo-router";

export default function panel() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { panelTypes, isTypesLoaded, errorTypes } = useSelector(
    (state) => state.panelTypes
  );

  const savedPanelData = useSelector((state) => state.panel.registerPanel);

  const [panelData, setPanelDataState] = useState(savedPanelData);

  const handleInputChange = (key, value) => {
    setPanelDataState((prev) => ({ ...prev, [key]: value }));
  };

  const handleTypeChange = (typeId) => {
    setPanelDataState((prev) => ({ ...prev, typeId }));
  };

  const handleAddPanel = async () => {
    if (panelData.square <= 0 || panelData.number <= 0 || !panelData.typeId) {
      Alert.alert(
        "Помилка створення нової панелі",
        "Будь ласка, оберіть тип панелей, введіть площу 1 панелі (у м²) та кількість таких панелей."
      );
      return;
    }
    dispatch(setRegisterPanel(panelData));
    router.push("/auth/register/location");
  };

  useEffect(() => {
    dispatch(fetchPanelTypes());
    dispatch(setRegisterPanel(panelData));
  }, [dispatch, panelData]);

  return (
    <MyContainer backgroundImage={require("../../../assets/bg2.jpg")}>
      <Text style={styles.title}>Вітаю, акаунт створено!</Text>
      <Text style={styles.subtitle}>
        Тепер давайте додамо інформацію про сонячну панель
      </Text>
      <View
        style={{
          flexDirection: "column",
          gap: 15,
          alignItems: "center",
          marginHorizontal: 40,
        }}
      >
        <View style={{ width: "100%" }}>
          <SelectList
            title="Оберіть тип панелей"
            items={panelTypes}
            selectedTypeId={panelData.typeId}
            onSelect={handleTypeChange}
          />
        </View>

        <View style={styles.container}>
          <Text style={styles.label}>Введіть площу 1 панелі (у м²):</Text>
          <TextInput
            label="Площа 1 (м²)"
            mode="outlined"
            value={panelData.square.toString() || 0}
            onChangeText={(val) => handleInputChange("square", +val)}
            keyboardType="numeric"
          />
          <Text style={styles.label}>Введіть кількість панелей:</Text>
          <TextInput
            label="Кількість"
            mode="outlined"
            value={panelData.number.toString() || 0}
            onChangeText={(val) => handleInputChange("number", +val)}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.button,
              {
                width: "28%",
                borderWidth: 2,
                borderColor: "#672ab7",
                backgroundColor: "#f5f5f5",
              },
            ]}
            onPress={() => router.back()}
          >
            <Icon source="arrow-left-thin" size={24} color="#672ab7" />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, { width: "80%" }]}
            onPress={handleAddPanel}
          >
            <Text style={styles.buttonText}>Далі</Text>
            <Icon source="arrow-right-thin" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </MyContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    backgroundColor: "#f6efff",
    paddingBottom: 20,
    paddingTop: 5,
    marginBottom: 5,
    width: "100%",
    paddingHorizontal: 40,
    justifyContent: "center",
    borderRadius: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 4,
    elevation: 4,
  },
  title: {
    fontSize: 32,
    marginBottom: 8,
    fontFamily: "Kurale",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 20,
    marginBottom: 20,
    fontFamily: "Kurale",
    color: "#333",
    textAlign: "center",
  },
  label: {
    fontFamily: "Kurale",
    fontSize: 16,
    paddingTop: 15,
    paddingBottom: 5,
  },
  input: {
    width: "100%",
    paddingHorizontal: 10,
    fontSize: 16,
    marginBottom: 15,
    backgroundColor: "#f5f5f5",
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 20,
  },
  button: {
    height: 50,
    backgroundColor: "#672ab7",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    marginTop: 5,
    marginBottom: 10,
    flexDirection: "row",
    gap: 10,
  },
  buttonText: {
    fontSize: 18,
    color: "#fff",
    fontFamily: "Kurale",
    lineHeight: 24,
  },
});