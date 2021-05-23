import React, { useEffect, useState } from "react";
import { FlatList, Text, TouchableHighlight, View } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { Chip, Avatar, ListItem } from "react-native-elements";
import tailwind from "tailwind-rn";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllUsers } from "../redux/allUsers.slice";
import { fetchPosts } from "../redux/posts.slice";
import { RootState } from "../redux/store";
import Button from "../components/button";

const Posts: React.FC = (props: any) => {
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

  if (postsCount === 0 || posts.length === 0) {
    return (
      <View>
        <Text> No Post to show at the moment....</Text>
      </View>
    );
  }

  const keyExtractor = (_, index) => index.toString();

  const renderItem = ({ item }) => (
    <ListItem
      bottomDivider
      Component={TouchableHighlight}
      onPress={() =>
        props.navigation.navigate("Comments", {
          uid: item.id,
          posterUid: item.posterUid,
        })
      }
    >
      <Avatar
        rounded
        title={item.title.charAt(0)}
        activeOpacity={0.2}
        containerStyle={{ backgroundColor: "#BDBDBD" }}
      />
      <ListItem.Content>
        <ListItem.Title>Created by : {item.postCreator.name}</ListItem.Title>
        <ListItem.Subtitle>{item.title}</ListItem.Subtitle>
        <ListItem.Subtitle>
          Status:<Text style={tailwind("text-red-400 ")}> {item.status} </Text>
        </ListItem.Subtitle>
        <ListItem.Subtitle>
          <Text style={tailwind("text-indigo-800")}>
            {" "}
            {new Date(item.creation.seconds * 1000)
              .toISOString()
              .substr(11, 8)}{" "}
          </Text>
        </ListItem.Subtitle>
      </ListItem.Content>
      <ListItem.Chevron />
    </ListItem>
  );

  return (
    <View style={tailwind("flex-1")}>
      {/* <Chip
        title="refresh"
        onPress={() => dispatch(fetchPosts())}
        style={tailwind("m-3 flex justify-center items-center")}
      /> */}
      <View style={tailwind("flex justify-center items-center")}>
        <Button onPress={() => dispatch(fetchPosts())} title="refresh" />
      </View>
      <FlatList
        keyExtractor={keyExtractor}
        data={posts}
        renderItem={renderItem}
        refreshing={false}
        onRefresh={() => dispatch(fetchPosts())}
      />

      {/* <Button onPress={() => dispatch(fetchPosts())} title="refresh" /> */}
    </View>
  );
};

export default Posts;
