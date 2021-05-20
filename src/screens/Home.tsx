import React, { FC, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";

import { fetchUser } from "../redux/user.slice";

export interface HomeProps {}

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
        <View>
          <Text> {currentUser.email}</Text>
          <Text> {currentUser.name}</Text>
          <Text> {currentUser.role}</Text>
        </View>
      )}
    </>
  );
};

export default Home;
