import {
  createSlice,
  createAsyncThunk,
  SerializedError,
} from "@reduxjs/toolkit";
import firebase from "firebase";
import store, { AppDispatch, RootState } from "./store";

import { UserData } from "./user.slice";

type creation = {
  nanoseconds: number;
  seconds: number;
};

export interface Comment {
  creation: creation;
  commentedBy: UserData;
  postComment: string;
}

export interface CommentsArr {
  commentId: string;
  commentData: Comment;
  parentPostUid?: string;
  parentPostWasMadeBy: UserData;
}

interface ICommentsState {
  comments: CommentsArr[]; // alternatively:  firebase.firestore.DocumentData
  commentsStatus: "idle" | "loading";
  commentsCount: number;
  commentsDataError: string | null | SerializedError;
}

/**
 * fetch all Users id in the collection with onSnapshot,
 * foreach of the ids above--> attach a fetchUserWithData from
 * above will be attached with fetchUsersPosts in order to get the posts for that user
 */

let listenerUnsubscribeList3 = [];
export const fetchUsersCommentsOnly = (
  userUid: string,
  postUid: string,
  userData: UserData
) => {
  //   console.log("comment slice ", { userUid, postUid, userData });
  return async (dispatch: AppDispatch) => {
    dispatch(fetchCommentsPending());
    const unsubscribe = firebase
      .firestore()
      .collection("posts")
      .doc(userUid) //id of the user who posted
      .collection("userPosts")
      .doc(postUid) //id of the post params.uid
      .collection("comments")
      .orderBy("creation", "asc")
      .onSnapshot(
        (snapshot) => {
          //   console.log({ snapshotComment: snapshot });

          snapshot.docs.map((doc) => {
            const data = doc.data();
            const id = doc.id;
            const postedBy = { ...userData, uid: userUid };

            const found = store
              .getState()
              .allComments.comments.some((comment) => comment.commentId === id);
            console.log({ found });
            if (!found) {
              dispatch(
                fetchCommentsSuccess({
                  commentId: id,
                  commentData: data,
                  parentPostUid: postUid,
                  parentPostWasMadeBy: postedBy,
                })
              );
            }
          });

          //const res : any = snapshot.query._delegate._query.path.segments[1]
          // @ts-ignore: Unreachable code error
          //const uid = snapshot._delegate.query._query.T.path.segments[1];
          // I had to inspect resolved snapshot above to get this value

          // console.log({ uid });

          // snapshot.docs.map((doc) => {
          //   const data = doc.data();
          //   const id = doc.id;
          //   const found = store
          //     .getState()
          //     .allPosts.posts.some((post) => post.id === id);
          //   console.log({ found });
          //   if (!found) {
          //     dispatch(
          //       fetchOnlyPostsSuccess({
          //         id,
          //         ...data,
          //         postCreator: userData,
          //         posterUid: uid,
          //       })
          //     );
          //   }
          //   // return { id, ...data, postCreator: userData };
          // });
        },
        (error) => {
          dispatch(fetchCommentsFailure(error));
          console.log(error);
        }
      );
    listenerUnsubscribeList3.push(unsubscribe);
  };
};

const initialState = {
  comments: [],
  commentsStatus: "idle",
  commentsCount: 0,
  commentsDataError: null,
} as ICommentsState;

const allComments = createSlice({
  name: "allComments",
  initialState,
  reducers: {
    fetchCommentsPending: (state) => {
      state.commentsStatus = "loading";
      state.commentsDataError = null;
    },

    fetchCommentsSuccess: (state, action) => {
      state.commentsStatus = "idle";

      if (action.payload) {
        state.commentsCount = state.commentsCount + 1;
        console.log("payload", action.payload); //returns an array
        state.comments = [...state.comments, action.payload]; // alternatively, -:  state.posts.push(action.payload[0]); [... breaks open the array an dreturns the bare obj]
      }
    },

    fetchCommentsFailure: (state, action) => {
      state.commentsStatus = "idle";

      // if (action.payload) {
      //   if (action.payload) state.postsDataError = action.payload;
      // }
    },

    clearAllCommentsData: (state) => {
      return {
        ...state,
        comments: [],
        commentsStatus: "idle",
        commentsCount: 0,
        commentsDataError: null,
      };
    },
  },
  //   extraReducers: () => {},
});

export const {
  fetchCommentsPending,

  fetchCommentsSuccess,
  fetchCommentsFailure,

  clearAllCommentsData,
} = allComments.actions;

export default allComments.reducer;
