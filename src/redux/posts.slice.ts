import {
  createSlice,
  createAsyncThunk,
  SerializedError,
} from "@reduxjs/toolkit";
import firebase from "firebase";
import store, { AppDispatch, RootState } from "./store";

import { UserData } from "./user.slice";

interface IPosts {
  id: string;
  comments?: string;
  creation: string;
  title: string;
  status: string;
  postCreator?: UserData;
}

interface IPostState {
  posts: IPosts[]; // alternatively:  firebase.firestore.DocumentData
  postsStatus: "idle" | "loading";
  postsCount: number;
  postsDataError: string | null | SerializedError;
}

/**
 * fetch all Users id in the collection with onSnapshot,
 * foreach of the ids above--> attach a fetchUserWithData from
 * above will be attached with fetchUsersPosts in order to get the posts for that user
 */

let listenerUnsubscribeList = [];
export const fetchPosts = () => {
  return async (dispatch: AppDispatch) => {
    dispatch(fetchUsersPending());
    const unsubscribe = firebase
      .firestore()
      .collection("users")
      .onSnapshot(
        (
          snapshot: firebase.firestore.QuerySnapshot<firebase.firestore.DocumentData>
        ) => {
          if (snapshot) {
            // dispatch(fetchUsersPending());
            console.log("new event happened");
            const user = snapshot.docs.map((doc) => {
              console.log({ snapshotPost1: doc.data() });
              const uid = doc.id;
              const userData = doc.data() as UserData;
              dispatch(fetchUsersPostsOnly(uid, userData));
              // const id = doc.id;
              // return { id, ...data, user };
            });

            // const uids = snapshot.docs.map((doc) => doc.id);
            // for (let oneUid of uids) {
            //   dispatch(fetchUsersPostsOnly(oneUid));
            // }
          }
        },
        (error) => {
          dispatch(fetchUsersPostsFailure(error));
        }
      );
    listenerUnsubscribeList.push(unsubscribe);
  };
};

let listenerUnsubscribeList2 = [];
export const fetchUsersPostsOnly = (uid: string, userData: UserData) => {
  console.log({ paramuid: uid });
  return async (dispatch: AppDispatch) => {
    dispatch(fetchUsersPending());
    const unsubscribe = firebase
      .firestore()
      .collection("posts")
      .doc(uid)
      .collection("userPosts")
      .orderBy("creation", "asc")
      .onSnapshot(
        (snapshot) => {
          console.log({ snapshotPost2: snapshot });

          //const res : any = snapshot.query._delegate._query.path.segments[1]
          // @ts-ignore: Unreachable code error
          const uid = snapshot._delegate.query._query.T.path.segments[1];
          // I had to inspect resolved snapshot above to get this value

          console.log({ uid });

          snapshot.docs.map((doc) => {
            const data = doc.data();
            const id = doc.id;
            const found = store
              .getState()
              .allPosts.posts.some((post) => post.id === id);
            console.log({ found });
            if (!found) {
              dispatch(
                fetchOnlyPostsSuccess({ id, ...data, postCreator: userData })
              );
            }
            // return { id, ...data, postCreator: userData };
          });
        },
        (error) => {
          dispatch(fetchUsersPostsFailure(error));
          console.log(error);
        }
      );
    listenerUnsubscribeList2.push(unsubscribe);
  };
};

const initialState = {
  posts: [],
  postsStatus: "idle",
  postsCount: 0,
  postsDataError: null,
} as IPostState;

const allPosts = createSlice({
  name: "allPosts",
  initialState,
  reducers: {
    fetchUsersPending: (state) => {
      state.postsStatus = "loading";
      state.postsDataError = null;
    },

    fetchOnlyPostsSuccess: (state, action) => {
      state.postsStatus = "idle";

      if (action.payload) {
        state.postsCount = state.postsCount + 1;
        console.log("payload", action.payload); //returns an array
        state.posts = [...state.posts, action.payload]; // alternatively, -:  state.posts.push(action.payload[0]); [... breaks open the array an dreturns the bare obj]
        //state.posts = [...new Set(state.posts.concat(action.payload))]; //set the two arrays and remove duplicates

        //     state.posts = state.posts.map((post) => {
        //       let found = action.payload.some((payload) => payload.id === post.id);

        //       if (found) {
        //         return post;
        //       }

        //       return action.payload;
        //     });
      }
    },

    fetchUsersPostsFailure: (state, action) => {
      state.postsStatus = "idle";

      if (action.payload) {
        if (action.payload) state.postsDataError = action.payload;
      }
    },

    clearAllPostsData: (state) => {
      return {
        ...state,
        posts: [],
        postsStatus: "idle",
        postsCount: 0,
        postsDataError: null,
      };
    },
  },
  //   extraReducers: () => {},
});

export const {
  fetchUsersPending,
  //   fetchUsersFailure,
  //   fetchUsersSuccess,
  //   fetchUsersPostsSuccess,
  fetchUsersPostsFailure,
  clearAllPostsData,
  fetchOnlyPostsSuccess,
} = allPosts.actions;

export default allPosts.reducer;
