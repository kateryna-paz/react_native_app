import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from "react-native";
import MyContainer from "./MyContainer";
import { FONTS, MyLightTheme } from "../../assets/theme/global";
import Header from "./Header";
import AnimatedErrorIcon from "./AnimatedErrorIcon";

export default function ErrorDisplay({
  colorStart = MyLightTheme.colors.primaryLight,
  colorEnd = MyLightTheme.colors.secondaryLight,
  errorMessage,
  onRefresh,
  refreshing,
  title,
}) {
  return (
    <MyContainer colorStart={colorStart} colorEnd={colorEnd}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {title && <Header title={title} />}
        <View style={styles.container}>
          <AnimatedErrorIcon />
          <Text
            style={{
              color: MyLightTheme.colors.red,
              fontSize: 18,
              marginTop: 10,
              marginHorizontal: 4,
              fontFamily: FONTS.SofiaSans,
              textAlign: "center",
            }}
          >
            {errorMessage}
          </Text>
        </View>
      </ScrollView>
    </MyContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 14,
    marginHorizontal: 16,
    flex: 1,
    shadowColor: MyLightTheme.colors.black,
    display: "flex",
    alignItems: "center",
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
  },
});
