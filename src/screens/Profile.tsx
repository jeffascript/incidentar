import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import firebase from "firebase";
import tailwind from "tailwind-rn";

import { RootState } from "../redux/store";
import { clearData, fetchUser, UserData } from "../redux/user.slice";
import Button from "../components/button";

const Profile: React.FC = (props: any) => {
  const [user, setUser] = useState<UserData>(null);

  const dispatch = useDispatch();
  const { currentUser, userDataError, loadingUserStatus } = useSelector(
    (state: RootState) => state.user
  );

  //   useEffect(() => {
  //     dispatch(fetchUser());
  //   }, []);

  useEffect(() => {
    const setUserAndPost = async () => {
      if (props.route.params.uid === firebase.auth().currentUser.uid) {
        setUser(currentUser);
      }
    };

    setUserAndPost();
  }, [props.route.params.uid]);

  console.log({ currentUser });

  const onLogout = () => {
    firebase.auth().signOut();
    dispatch(clearData());
  };

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
      {user && (
        <View
          style={tailwind(
            "flex-1 items-start justify-start mx-4 my-2 text-lg font-bold"
          )}
        >
          <Text>Email: {user.email}</Text>
          <Text>Full name: {user.name}</Text>
          <Text>Role: {user.role}</Text>

          <Button title="Logout" onPress={onLogout} />
        </View>
      )}
    </>
  );
};

export default Profile;
