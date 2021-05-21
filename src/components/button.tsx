import React from "react";
import { Text, View, TouchableOpacity, StyleSheet } from "react-native";
import tailwind from "tailwind-rn";

export interface ButtonProps {
  title: string;
  onPress: () => void;
}

const Button: React.FC<ButtonProps> = (props) => {
  return (
    <View style={tailwind("bg-purple-800 px-5 py-1.5 rounded-full my-2.5")}>
      <TouchableOpacity
        //   title="Login"
        onPress={props.onPress}
        //   style={tailwind("text-white font-semibold text-lg")}
      >
        <Text style={tailwind("text-white font-semibold text-lg")}>
          {props.title}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default Button;
