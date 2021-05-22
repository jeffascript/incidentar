import React, { FC, useEffect } from "react";
import { Text, View } from "react-native";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import firebase from "firebase";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";

import { fetchUser } from "../redux/user.slice";
import Posts from "./Posts";
import Profile from "./Profile";

const Tab = createMaterialBottomTabNavigator();

export interface HomeProps {}

const EmptyScreen = () => {
  return null;
};

const Home: FC<HomeProps> = (props) => {
  const dispatch = useDispatch();
  const { currentUser, userDataError, loadingUserStatus } = useSelector(
    (state: RootState) => state.user
  );

  useEffect(() => {
    dispatch(fetchUser());
  }, []);

  console.log({ currentUser });

  if (loadingUserStatus === "loading") {
    return (
      <View>
        <Text>Loading user ....</Text>
      </View>
    );
  }

  if (userDataError) {
    return (
      <View>
        <Text>Error Loading user .... {userDataError}</Text>
      </View>
    );
  }

  return (
    <>
      {currentUser && (
        // <View>
        //   <Text> {currentUser.email}</Text>
        //   <Text> {currentUser.name}</Text>
        //   <Text> {currentUser.role}</Text>
        // </View>

        <Tab.Navigator
          initialRouteName="Posts"
          labeled={true}
          activeColor="#fafafa"
          barStyle={{
            backgroundColor: "indigo",
            paddingBottom: 0,
          }}
          //   shifting={true}
        >
          <Tab.Screen
            name="Posts"
            component={Posts}
            options={{
              tabBarIcon: ({ color }) => (
                <MaterialCommunityIcons name="home" color={color} size={26} />
              ),
            }}
          />
          {/* 
          <Tab.Screen
            name="Search"
            component={SearchScreen}
            options={{
              tabBarIcon: ({ color }) => (
                <MaterialCommunityIcons
                  name="account-search"
                  color={color}
                  size={26}
                />
              ),
            }}
          /> */}

          <Tab.Screen
            name="Post New Incident"
            component={EmptyScreen}
            listeners={({ navigation }) => ({
              tabPress: (event) => {
                event.preventDefault();
                navigation.navigate("Add");
              },
            })}
            options={{
              tabBarIcon: ({ color }) => (
                <MaterialCommunityIcons
                  name="plus-circle"
                  color={color}
                  size={26}
                />
              ),
            }}
          />

          <Tab.Screen
            name="Profile"
            component={Profile}
            listeners={({ route, navigation }) => ({
              title: "Profile",
              tabPress: (event) => {
                event.preventDefault();
                navigation.navigate("Profile", {
                  uid: firebase.auth().currentUser.uid,
                });
              },
            })}
            options={{
              tabBarLabel: "My Profile",
              tabBarIcon: ({ color }) => (
                <MaterialCommunityIcons
                  name="account-circle"
                  color={color}
                  size={26}
                />
              ),
            }}
          />
        </Tab.Navigator>
      )}
    </>
  );
};

export default Home;
