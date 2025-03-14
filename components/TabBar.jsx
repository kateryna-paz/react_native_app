import React, { useState, useEffect } from "react";
import { View, StyleSheet, Keyboard } from "react-native";
import TabBarButton from "./TabBarButton";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { usePathname } from "expo-router";
import { MyLightTheme } from "../assets/theme/global";

export default function MyTabBar({ state, descriptors, navigation }) {
  const currentPath = usePathname();
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  const [dimensions, setDimensions] = useState({
    height: 20,
    width: 62,
  });

  const buttonWidth = dimensions.width / state.routes.length;

  const tabPositionX = useSharedValue(6);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: tabPositionX.value }],
  }));

  const pathToIndexMap = {
    "/home": 0,
    "/energy_distribution": 1,
    "/energy_distribution/list": 1,
    "/devices": 2,
    "/profile": 3,
  };

  useEffect(() => {
    const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
      setKeyboardVisible(true);
    });
    const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardVisible(false);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  useEffect(() => {
    const targetIndex = pathToIndexMap[currentPath];
    if (targetIndex !== undefined) {
      tabPositionX.value = withSpring(buttonWidth * targetIndex + 5, {
        duration: 1700,
      });
    }
  }, [currentPath, buttonWidth, pathToIndexMap]);

  const onTabbarLayout = (e) => {
    setDimensions({
      height: e.nativeEvent.layout.height,
      width: e.nativeEvent.layout.width - 18,
    });
  };

  if (isKeyboardVisible || currentPath === "/profile/map") {
    return null;
  }

  return (
    <View onLayout={onTabbarLayout} style={styles.tabbar}>
      <Animated.View
        style={[
          animatedStyle,
          {
            position: "absolute",
            backgroundColor: MyLightTheme.colors.primary,
            marginHorizontal: 14,
            borderRadius: 30,
            height: dimensions.height - 16,
            width: buttonWidth - 20,
          },
        ]}
      />
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
              ? options.title
              : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          navigation.navigate(route.name, route.params);
        };

        const onLongPress = () => {
          navigation.emit({
            type: "tabLongPress",
            target: route.key,
          });
        };

        return (
          <TabBarButton
            key={route.key}
            onPress={onPress}
            onLongPress={onLongPress}
            isFocused={isFocused}
            routeName={route.name}
            color={isFocused ? MyLightTheme.colors.white : "grey"}
            label={label}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  tabbar: {
    position: "absolute",
    bottom: 20,
    marginHorizontal: 30,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 10,
    backgroundColor: MyLightTheme.colors.white,
    borderRadius: 35,
    shadowColor: MyLightTheme.colors.black,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
});
