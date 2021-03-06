import React, { useState } from "react";
import { Text, View, Button, TouchableOpacity, Alert } from "react-native";
import tailwind from "tailwind-rn";
import { StackNavigationProp } from "@react-navigation/stack";
import firebase from "firebase";

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
  errorText: string;
}

export interface LoginProps extends ILoginRouter {}

const Login: React.FC<LoginProps> = (props) => {
  const initialState = {
    email: "",
    password: "",
    errorText: "",
  };

  const [userState, setUserState] = useState<IUserState>(initialState);

  const signIn = async () => {
    try {
      const { email, password } = userState;
      const resp = await firebase
        .auth()
        .signInWithEmailAndPassword(email, password);
      //   if (!resp.user) {
      //     console.log("not done");
      //   }
      console.log({ resp });
    } catch (err) {
      console.log({ err });
      setUserState({ ...userState, errorText: err.message });
    }
  };

  return (
    <View style={tailwind("flex-1 items-center justify-center")}>
      <Text> Login Screen</Text>

      <Input
        placeholder="Email"
        onChangeText={(text) => setUserState({ ...userState, email: text })}
      />

      <Input
        placeholder="Password"
        onChangeText={(text) => setUserState({ ...userState, password: text })}
        secureTextEntry
      />
      {userState.errorText ? (
        <Text style={tailwind("text-red-800 font-light")}>
          {userState.errorText}
        </Text>
      ) : null}

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
