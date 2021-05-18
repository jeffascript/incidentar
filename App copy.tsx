import React from "react";
import { StyleSheet, Text, View, SafeAreaView, Platform } from "react-native";

export default function App() {
  return (
    <SafeAreaView style={styles.droidSafeArea}>
      <View style={styles.container}>
        <Text>Open up App.tsx to start working on your app!</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fafafa",
    paddingTop: Platform.OS === "android" ? 25 : 0,
  },
  droidSafeArea: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "flex-start",
  },
});
