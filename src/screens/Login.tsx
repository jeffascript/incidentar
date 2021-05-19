import React, { useState } from "react";
import { Text, View, Button, TouchableOpacity, Alert } from "react-native";
import tailwind from "tailwind-rn";
import { StackNavigationProp } from "@react-navigation/stack";
import { NavigatorParamList } from "../navigation/Main";
import Input from "../components/input";
import StyledButton from "../components/button";

type LoginNavProp = StackNavigationProp<NavigatorParamList, "Login">;

interface ILoginRouter {
  navigation: LoginNavProp;
}

interface IUserState {
  email: string;
  password: string;
}

export interface LoginProps extends ILoginRouter {}

const Login: React.FC<LoginProps> = (props) => {
  const initialState = {
    email: "",
    password: "",
  };

  const [userState, setUserState] = useState<IUserState>(initialState);

  const signIn = async () => {
    Alert.alert("hello");
  };

  return (
    <View style={tailwind("flex-1 items-center justify-center")}>
      <Text> Login Screen</Text>

      <Input
        placeholder="Username"
        onChangeText={(text) => setUserState({ ...userState, email: text })}
      />

      <Input
        placeholder="Password"
        onChangeText={(text) => setUserState({ ...userState, email: text })}
        secureTextEntry
      />

      <StyledButton title="Sign In" onPress={signIn} />

      <View style={tailwind("flex-row my-2.5 justify-center items-center")}>
        <Text> Don't have an Account yet?</Text>
        <TouchableOpacity
          style={tailwind("  mx-1")}
          onPress={() => props.navigation.navigate("Register")}
        >
          <Text style={tailwind("text-indigo-500")}> Sign Up Here</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Login;
