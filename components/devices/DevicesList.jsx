import React from "react";
import { View, StyleSheet } from "react-native";
import DeviceCard from "./DeviceCard";
import { usePathname } from "expo-router";
import DeviceDistributionCard from "../distribution/DeviceCard";
import Animated, {
  FadeIn,
  FadeOut,
  LinearTransition,
} from "react-native-reanimated";

export default function DevicesList({
  devices,
  refresh,
  toggleSelect,
  selected,
}) {
  const currentPath = usePathname();

  if (currentPath === "/devices") {
    return (
      <View style={styles.devicesContainer}>
        {devices?.map((device) => {
          return <DeviceCard data={device} key={device.id} refresh={refresh} />;
        })}
      </View>
    );
  }

  if (currentPath === "/energy_distribution/list") {
    return (
      <Animated.View
        style={styles.disrtibutionContainer}
        entering={FadeIn.duration(600).springify()}
        layout={LinearTransition.springify().mass(0.8)}
      >
        {devices?.map((device) => {
          return (
            <Animated.View
              key={device.id}
              entering={FadeIn.delay(100)
                .duration(600)
                .withInitialValues({
                  opacity: 0,
                  transform: [{ scale: 0.8 }, { translateX: 50 }],
                })
                .springify()}
              exiting={FadeOut.duration(500)
                .withInitialValues({
                  opacity: 1,
                  transform: [{ scale: 1 }, { translateX: 0 }],
                })
                .springify()}
              layout={LinearTransition.springify().mass(0.8)}
            >
              <DeviceDistributionCard
                data={device}
                toggleSelect={toggleSelect}
                selected={selected}
              />
            </Animated.View>
          );
        })}
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  devicesContainer: {
    flexWrap: "wrap",
    flexDirection: "row",
    width: "100%",
    justifyContent: "center",
    paddingTop: 20,
  },
  disrtibutionContainer: {
    flexDirection: "column",
    width: "100%",
    paddingHorizontal: 8,
    justifyContent: "center",
  },
});
