import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from "react-native";
import MyContainer from "./MyContainer";

export default function ErrorDisplay({
  colorStart,
  colorEnd,
  errorMessage,
  onRefresh,
  refreshing,
  theme,
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
        <View
          style={[
            { backgroundColor: theme.colors.background },
            styles.container,
          ]}
        >
          <Text
            style={{
              color: theme.colors.text,
              fontSize: 26,
              marginTop: 10,
              textAlign: "center",
              fontFamily: "SofiaSansBold",
            }}
          >
            Помилка
          </Text>
          <Text
            style={{
              color: theme.colors.red,
              fontSize: 18,
              marginTop: 10,
              marginHorizontal: 4,
              fontFamily: "SofiaSans",
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
    borderRadius: 20,
    padding: 14,
    marginHorizontal: 16,
    marginBottom: 110,
    flex: 1,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 10,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
  },
});
