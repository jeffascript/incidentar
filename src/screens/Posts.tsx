import React, { useEffect, useState } from "react";
import { Button, Text, View } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllUsers } from "../redux/allUsers.slice";
import { RootState } from "../redux/store";

const Posts = () => {
  const [statePosts, setStatePosts] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const dispatch = useDispatch();
  const {
    user: { currentUser, userDataError, loadingUserStatus },
    allUsers: { users, loadingUsersStatus, usersLoadedCount },
    allPosts: { posts, postsCount, postsDataError, postsStatus },
  } = useSelector((state: RootState) => state);

  const refreshBtn = () => {
    setRefresh(refresh || true);
    setTimeout(() => {
      setRefresh(refresh === true ? false : refresh);
    }, 50);
  };

  useEffect(() => {
    dispatch(fetchAllUsers());
  }, [refresh]);

  //   useEffect(() => {
  //     if (usersLoadedCount === users.length) {
  //       // for (let i = 0; i < users.length; i++) {
  //       // //   const user = users.find((el) => el.uid === followingArray[i]); //find the uid from followingArray reduxstate that matches the uid from the users reduxstate
  //       // //   if (user !== undefined) {
  //       // //     //since find will return undefined if no result
  //       // //     thisPosts = [...thisPosts, ...user.posts];
  //       // //   }

  //       // }
  //       // thisPosts.sort((a, b) => a.creation - b.creation);
  //       // setStatePosts(thisPosts);

  //       const allPosts = users.map((user) => user.posts);

  //       console.log({ allPosts });
  //     }
  //   }, [usersLoadedCount]);

  //   if (statePosts.length === 0) {
  //     return <Text>No post ..</Text>;
  //   }

  //   if (loadingUsersStatus === "loading") {
  //     return (
  //       <View>
  //         <ActivityIndicator size="large" color="#00ff00" />
  //         <Text> New Posts are available...</Text>
  //         <Button onPress={() => dispatch(fetchAllUsers())} title="refresh" />
  //       </View>
  //     );
  //   }

  return (
    <View>
      {users && users.length > 0
        ? users.map((a) => (
            <>
              {/* <View key={a.uid}>
                {" "}
                <Text>userName: {a.name}</Text> */}
              {a.posts && a.posts.length > 0
                ? a.posts.map((i) => (
                    <View key={i.id}>
                      <Text>
                        {" "}
                        userposts by {a.name}: {i.title} ; status: {i.status}
                      </Text>
                    </View>
                  ))
                : null}
              {/* </View>{" "} */}
            </>
          ))
        : null}

      <Button onPress={() => refreshBtn()} title="refresh" />
    </View>
  );
};

export default Posts;
