import {
  createSlice,
  createAsyncThunk,
  SerializedError,
} from "@reduxjs/toolkit";
import firebase from "firebase";
import { AppDispatch, RootState } from "./store";

import { UserData } from "./user.slice";

interface IPosts {
  id: string;
  comments?: string;
  creation: string;
  title: string;
  status: string;
  userId?: string;
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
            // const user = snapshot.docs.map((doc) => {
            //     const data = doc.data();
            //     const id = doc.id;
            //     return { id, ...data, user };
            //   })

            const uids = snapshot.docs.map((doc) => doc.id);
            for (let oneUid of uids) {
              dispatch(fetchUsersPostsOnly(oneUid));
            }
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
export const fetchUsersPostsOnly = (uid: string) => {
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
          console.log({ snapshotPost: snapshot });

          //const res : any = snapshot.query._delegate._query.path.segments[1]
          // @ts-ignore: Unreachable code error
          const uid = snapshot._delegate.query._query.T.path.segments[1];
          // I had to inspect resolved snapshot above to get this value

          console.log({ uid });

          const response = snapshot.docs.map((doc) => {
            const data = doc.data();
            const id = doc.id;
            return { id, ...data };
          });

          dispatch(fetchOnlyPostsSuccess(response));
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

    // fetchUsersSuccess: (state, action) => {
    //   state.users.push(action.payload);
    //   state.loadingUsersStatus = "idle";
    // },
    // fetchUsersFailure: (state, action) => {
    //   if (action.payload) state.usersDataError = action.payload;
    //   state.loadingUsersStatus = "idle";
    // },

    // fetchUsersPostsSuccess: (state, action) => {
    //   state.usersLoadedCount = state.usersLoadedCount + 1; //increment the numbers by 1 everytime new user was added
    //   state.loadingUsersStatus = "idle";

    //   if (action.payload.length > 0) {
    //     state.users = state.users.map((user) =>
    //       user.uid === action.payload[0].user.uid
    //         ? { ...user, posts: action.payload }
    //         : { ...user, posts: [] }
    //     );
    //   }
    // },
    fetchOnlyPostsSuccess: (state, action) => {
      state.postsStatus = "idle";

      if (action.payload.length > 0) {
        state.postsCount = state.postsCount + 1;
        state.posts.push(action.payload);
      }
    },

    fetchUsersPostsFailure: (state, action) => {
      state.postsStatus = "idle";

      if (action.payload.length > 0) {
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
