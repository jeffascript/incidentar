import React, { useEffect, useState } from "react";
import { Button, Text, View } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllUsers } from "../redux/allUsers.slice";
import { fetchPosts } from "../redux/posts.slice";
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
    dispatch(fetchPosts());
  }, []);

  //   useEffect(() => {
  //     // dispatch(fetchAllUsers());
  //     dispatch(fetchPosts());
  //   }, [refresh]);

  return (
    <View>
      {posts && posts.length > 0
        ? posts.map((post) => (
            <>
              <View key={post.id}>
                <Text>
                  userposts by {post.postCreator.name}: {post.title} ::: status:{" "}
                  {post.status}
                </Text>
              </View>
            </>
          ))
        : null}

      <Button onPress={() => dispatch(fetchPosts())} title="refresh" />
    </View>
  );
};

export default Posts;
