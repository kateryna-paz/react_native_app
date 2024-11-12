import { Tabs } from "expo-router";
import MyTabBar from "../../components/NavBar";

export default () => {
  return (
    <Tabs tabBar={(props) => <MyTabBar {...props} />}>
      <Tabs.Screen
        name="home"
        options={{
          title: "Головна",
          headerTitleAlign: "center",
          headerTitleStyle: {
            fontFamily: "Kurale",
            fontSize: 26,
          },
        }}
      />
      <Tabs.Screen
        name="energy_distribution"
        options={{
          title: "Розподіл",
          headerTitleAlign: "center",
          headerTitleStyle: {
            fontFamily: "Kurale",
            fontSize: 26,
          },
        }}
      />
      <Tabs.Screen
        name="devices"
        options={{
          title: "Прилади",
          headerTitleAlign: "center",
          headerTitleStyle: {
            fontFamily: "Kurale",
            fontSize: 26,
          },
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Профіль",
          headerTitleAlign: "center",
          headerTitleStyle: {
            fontFamily: "Kurale",
            fontSize: 26,
          },
        }}
      />
    </Tabs>
  );
};
