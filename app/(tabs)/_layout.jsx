import { Tabs } from "expo-router";
import MyTabBar from "../../components/TabBar";
import { StyleSheet } from "react-native";
import { shadow, useTheme } from "react-native-paper";

export default () => {
  const theme = useTheme();
  return (
    <Tabs
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.secondaryDark,
          shadowColor: "transparent",
          elevation: 0,
        },
      }}
      tabBar={(props) => <MyTabBar {...props} />}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Головна",
          headerTitleAlign: "center",
          headerTitleStyle: styles.header,
        }}
      />
      <Tabs.Screen
        name="energy_distribution"
        options={{
          title: "Розподіл",
          headerTitleAlign: "center",
          headerTitleStyle: styles.header,
        }}
      />
      <Tabs.Screen
        name="devices"
        options={{
          title: "Прилади",
          headerTitleAlign: "center",
          headerTitleStyle: styles.header,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Профіль",
          headerTitleAlign: "center",
          headerTitleStyle: styles.header,
        }}
      />
    </Tabs>
  );
};

const styles = StyleSheet.create({
  header: {
    fontFamily: "Kurale",
    fontSize: 26,
    color: "white",
  },
});
