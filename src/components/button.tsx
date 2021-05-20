import React from "react";
import { Text, View, TouchableOpacity } from "react-native";
import tailwind from "tailwind-rn";

export interface ButtonProps {
  title: string;
  onPress: () => void;
}

const Button: React.FC<ButtonProps> = (props) => {
  return (
    <View style={tailwind("bg-indigo-700 px-5 py-2 rounded-full my-2.5")}>
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
