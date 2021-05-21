// import { StatusBar } from "expo-status-bar";
import React, { FC, useEffect, useState } from "react";
import { Text, View, LogBox, Platform, ActivityIndicator } from "react-native";
import firebase from "firebase";

import { Provider } from "react-redux";

// import { Provider } from "react-redux";
// import store from "./src/redux/store";

import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import store from "../redux/store";
// import LandingScreen from "./src/components/auth/Landing";
import RegisterScreen from "../screens/Register";
import LoginScreen from "../screens/Login";
import Home from "../screens/Home";
// import AddScreen from "./src/components/main/Add";
// import SaveScreen from "./src/components/main/Save";

import { firebaseConfig } from "../utils/firebase";
import Add from "../screens/Add";
import Save from "../screens/Save";

if (firebase.apps.length === 0) {
  firebase.initializeApp(firebaseConfig);
}

type userFieldOptions = {
  [key: string]: string;
};

export interface IUserState {
  isLoaded: boolean;
  isLoggedIn: boolean;
}

export type NavigatorParamList = {
  Login: undefined; //meaning no params for screen component with name="signup"
  Register: undefined;
  Home: undefined;
  Add: undefined;
  Save: undefined;
  Profile: undefined;
  // Login: { userId: string };
  // Feed: { sort: 'latest' | 'top' } | undefined;
};

const Stack = createStackNavigator<NavigatorParamList>();

const Main: FC = () => {
  const initialState = {
    isLoaded: false,
    isLoggedIn: false,
  };

  const [state, setstate] = useState<IUserState>(initialState);

  useEffect(() => {
    const checkUser = () => {
      firebase.auth().onAuthStateChanged((user) => {
        if (!user) {
          setstate({ ...state, isLoaded: true });
          return;
        }
        setstate({ ...state, isLoaded: true, isLoggedIn: true });
      });
    };

    checkUser();
  }, []);

  //Platform.OS !== "web" && LogBox.ignoreLogs(["Setting a timer"]); //cos it was crashing on web view, so keep it only on mobile screens

  useEffect(() => {
    //cos it was crashing on web view, so keep it only on mobile screens
    (async () => {
      if (Platform.OS !== "web") LogBox.ignoreLogs(["Setting a timer"]);
    })();
  }, []);

  if (!state.isLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#00ff00" />
        <Text> Loading ...</Text>
      </View>
    );
  }

  if (!state.isLoggedIn) {
    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Register"
            component={RegisterScreen}
            options={{ headerShown: false }}
          />
          {/* <Stack.Screen name="Login" component={LoginScreen} /> */}
        </Stack.Navigator>
      </NavigationContainer>
    );
  }

  return (
    <>
      <Provider store={store}>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Home">
            <Stack.Screen
              name="Home"
              component={Home}
              options={{ headerShown: false }}
            />
            <Stack.Screen name="Add" component={Add} />
            <Stack.Screen name="Save" component={Save} />
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>
    </>
  );
};

export default Main;
