import React, { FC, useEffect, useState } from "react";
import { RouteProp } from "@react-navigation/core";
import { StackNavigationProp } from "@react-navigation/stack";
import { FlatList, Text, View } from "react-native";
import { Badge, Avatar, ListItem } from "react-native-elements";
import tailwind from "tailwind-rn";
import firebase from "firebase";

import { useSelector } from "react-redux";

import { NavigatorParamList } from "../navigation/Main";
import { RootState } from "../redux/store";
import { IPosts } from "../redux/posts.slice";
import Input from "../components/input";
import Button from "../components/button";

type CommentsNavProp = RouteProp<NavigatorParamList, "Comments">;
type CommentsNavigator = StackNavigationProp<NavigatorParamList, "Comments">;
interface ICommentsRouter {
  route: CommentsNavProp;
  navigation: CommentsNavigator;
}

interface AddCommentState {
  title?: string;
  postComment: string;
  status?: string;
}

export interface CommentsProps extends ICommentsRouter {}

const Comments: FC<CommentsProps> = (props) => {
  const [currentPost, setCurrentPost] = useState<IPosts>(null);

  const initialState = {
    postComment: "",
    // status: Status.new,
  };

  const [newComment, setNewComment] = useState<AddCommentState>(initialState);

  console.log(props.route.params); //post uid check

  const {
    user: { currentUser, userDataError, loadingUserStatus },
    allUsers: { users, loadingUsersStatus, usersLoadedCount },
    allPosts: { posts, postsCount, postsDataError, postsStatus },
  } = useSelector((state: RootState) => state);

  useEffect(() => {
    const findPostById = () => {
      if (props.route.params.uid) {
        const newpost = posts.filter(
          (post) => post.id === props.route.params.uid
        );
        const [first] = newpost; // alternatively : newpost[0]
        setCurrentPost(first);
      }
    };
    findPostById();
  }, [props.route.params.uid, props.route.params.posterUid]);

  const submitNewComment = async () => {
    await firebase
      .firestore()
      .collection("posts")
      .doc(props.route.params.posterUid) //id of the user who posted
      .collection("userPosts")
      .doc(props.route.params.uid) //id of the post params.uid
      .collection("comments")
      .add({
        ...newComment,
        creation: firebase.firestore.Timestamp.now(),
        currentUser,
      })
      .then(() => {
        console.log("done");

        // setTimeout(() => {
        //   dispatch(fetchAllUsers());
        // }, 50);
        // dispatch(fetchUsersPostsOnly(firebase.auth().currentUser.uid));
        //dispatch(fetchAllUsers()); //refetch with current posts
        //dispatch(fetchPosts());
        // props.navigation.dispatch(StackActions.popToTop()); //used since it is a stack navigator, https://reactnavigation.org/docs/navigation-prop
        // props.navigation.navigate("Home", { refresh: true });
        //props.navigation.dispatch(StackActions.push("Posts"));
      });
  };

  if (!currentPost) {
    return (
      <View>
        <Text>Comments loading ....</Text>
      </View>
    );
  }

  const keyExtractor = (_, index) => index.toString();

  const renderItem = ({ item }) => (
    <ListItem>
      <Avatar
        rounded
        size="small"
        title={item.postCreator.name.charAt(0)}
        containerStyle={{ backgroundColor: "#BDBDBD" }}
      />
      <ListItem.Content>
        <ListItem.Title> </ListItem.Title>
        <ListItem.Subtitle>
          <Text style={tailwind("text-green-700 font-bold")}>
            {item.postCreator.name}
          </Text>{" "}
          {item.title}{" "}
        </ListItem.Subtitle>
        <ListItem.Subtitle>
          <Text style={tailwind("text-gray-300")}>
            {" "}
            {new Date(item.creation.seconds * 1000)
              .toISOString()
              .substr(11, 8)}{" "}
          </Text>
        </ListItem.Subtitle>
      </ListItem.Content>
    </ListItem>
  );

  return (
    <View style={tailwind("flex-1 ")}>
      <ListItem bottomDivider>
        <Avatar
          rounded
          size="large"
          title={currentPost.title.charAt(0)}
          activeOpacity={0.2}
          containerStyle={{ backgroundColor: "#BDBDBD" }}
        />
        <ListItem.Content>
          <ListItem.Title>
            Created by :{" "}
            <Text style={tailwind(" font-bold")}>
              {" "}
              {currentPost.postCreator.name}
            </Text>
          </ListItem.Title>
          <ListItem.Subtitle>{currentPost.title}</ListItem.Subtitle>
          <ListItem.Subtitle>
            <Text style={tailwind("text-red-400 ")}>
              {/* Status: {currentPost.status}{" "} */}
            </Text>

            <Text style={tailwind("text-indigo-800")}>
              {" "}
              {new Date(currentPost.creation.seconds * 1000)
                .toISOString()
                .substr(11, 8)}{" "}
            </Text>
          </ListItem.Subtitle>
        </ListItem.Content>
        <View>
          {/* <Avatar
            rounded
            source={{
              uri: "https://randomuser.me/api/portraits/men/41.jpg",
            }}
            size="large"
          /> */}

          <Badge
            status="success"
            value={currentPost.status}
            containerStyle={{ position: "absolute", top: -4, right: -4 }}
            badgeStyle={tailwind("w-14 ")}
          />
        </View>
      </ListItem>

      <View>
        <Input
          placeholder="Add comments here...."
          onChangeText={(text) =>
            setNewComment({ ...newComment, postComment: text })
          }
          textarea={true}
        />
        <Button title="submit" onPress={submitNewComment} />
      </View>

      {/* comments starts here */}

      <View style={tailwind("flex-1 ")}>
        <FlatList
          keyExtractor={keyExtractor}
          data={posts}
          renderItem={renderItem}
        />
      </View>
    </View>
  );
};

export default Comments;
