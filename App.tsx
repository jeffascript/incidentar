import React from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Platform,
  StatusBar,
} from "react-native";

// import { StatusBar as ExpoStatusBar } from "expo-status-bar";

import MainScreen from "./src/navigation/Main";

export default function App() {
  return (
    <View style={styles.droidSafeArea}>
      {/* <ExpoStatusBar style="dark" /> */}
      {/* <View style={styles.container}>
        <Text>Open up App.tsx to start working on your app!</Text>
      </View> */}
      <MainScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  droidSafeArea: {
    flex: 1,
    backgroundColor: "indigo",

    //paddingTop: StatusBar.currentHeight,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 44,
    marginBottom: 0,
  },
  container: {
    flex: 1,
    backgroundColor: "#ffff",
    alignItems: "center",
    justifyContent: "flex-start",
  },
});
