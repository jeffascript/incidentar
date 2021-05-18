import React, { FC } from "react";
import { StyleSheet, Text, View } from "react-native";

export interface HomeProps {}

const Home: FC<HomeProps> = (props) => {
  return (
    <View>
      <Text> Home</Text>
    </View>
  );
};

export default Home;
