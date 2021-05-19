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
  name: string;
  email: string;
  password: string;
  errorText?: string;
}

export interface LoginProps extends ILoginRouter {}

const Login: React.FC<LoginProps> = (props) => {
  const initialState = {
    name: "",
    email: "",
    password: "",
    errorText: "",
  };

  const [userState, setUserState] = useState<IUserState>(initialState);

  const signUp = async () => {
    try {
      const { email, password, name } = userState;
      const resp = await firebase
        .auth()
        .createUserWithEmailAndPassword(email, password);
      console.log({ resp });

      if (resp.user) {
        await firebase
          .firestore()
          .collection("users")
          .doc(firebase.auth().currentUser.uid) // resp.user.uid
          .set({
            name,
            email,
            role: "user",
          });
      }
    } catch (err) {
      console.log({ err });
      setUserState({ ...userState, errorText: err.message });
    }
  };

  return (
    <View style={tailwind("flex-1 items-center justify-center")}>
      <Text> Sign Up Screen</Text>

      <Input
        placeholder="Name"
        onChangeText={(text) => setUserState({ ...userState, name: text })}
      />

      <Input
        placeholder="Username"
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

      <StyledButton title="Sign Up" onPress={signUp} />

      <View style={tailwind("flex-row my-2.5 justify-center items-center")}>
        <Text> Already Have an Account?</Text>
        <TouchableOpacity
          style={tailwind("text-indigo-400 mx-1")}
          onPress={() => props.navigation.navigate("Login")}
        >
          <Text style={tailwind("text-indigo-500 ")}> Login Here</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Login;
