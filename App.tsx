import React from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Platform,
  StatusBar,
} from "react-native";

import MainScreen from "./src/navigation/Main";

export default function App() {
  return (
    <SafeAreaView style={styles.droidSafeArea}>
      {/* <View style={styles.container}>
        <Text>Open up App.tsx to start working on your app!</Text>
      </View> */}
      <MainScreen />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  droidSafeArea: {
    flex: 1,
    backgroundColor: "#fafafa",

    // paddingTop: Platform.OS === "android" ? 25 : 0,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
    backgroundColor: "#ffff",
    alignItems: "center",
    justifyContent: "flex-start",
  },
});
