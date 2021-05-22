import { StatusBar } from "expo-status-bar";
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
}

interface IAllUsers extends UserData {
  uid?: string;
  posts?: IPosts[];
  postError?: string | null | SerializedError;
}

interface IUserState {
  users: IAllUsers[]; // alternatively:  firebase.firestore.DocumentData
  loadingUsersStatus: "idle" | "loading";
  usersLoadedCount: number;
  usersDataError: string | null | SerializedError;
}

/**
 * fetch all Users id in the collection with onSnapshot,
 * foreach of the ids above--> attach a fetchUserWithData from
 * above will be attached with fetchUsersPosts in order to get the posts for that user
 */

// export const fetchAllUsers = createAsyncThunk(
//   "users/fetchAllUsers",
//   (_, thunkAPI) =>
//     new Promise((resolve, reject) => {
//       try {
//         firebase
//           .firestore()
//           .collection("users")
//           .onSnapshot(
//             (snapshot) => {
//               let uidsArr = snapshot.docs.map((doc) => doc.id);
//               // resolve(uidsArr);
//               //   thunkAPI.dispatch(tester(following));

//               for (let oneUid of uidsArr) {
//                 thunkAPI.dispatch(fetchUsersData(oneUid));
//               }

//               return uidsArr;
//             },
//             (error) => {
//               reject(error);
//             }
//           );
//         //listenerUnsubscribeList.push(unsubscribe); // a function that unsubscribes the listener is pushed into an array list

//         //console.log({ listenerUnsubscribeList });
//       } catch (err) {
//         console.log(err);
//         thunkAPI.dispatch(fetchUsersFailure(err));
//         //   return thunkAPI.rejectWithValue( err);
//       }
//     })
// );

let listenerUnsubscribeList = [];
export const fetchAllUsers = () => {
  return async (dispatch: AppDispatch) => {
    dispatch(fetchUsersPending());
    // const unsubscribe = await
    firebase
      .firestore()
      .collection("users")
      .onSnapshot(
        (snapshot) => {
          if (snapshot) {
            // dispatch(fetchUsersPending());
            console.log("new event happened");
            const uids = snapshot.docs.map((doc) => doc.id);
            for (let oneUid of uids) {
              dispatch(fetchUsersData(oneUid));
            }
          }
        },
        (error) => {
          dispatch(fetchUsersFailure(error));
        }
      );
    // listenerUnsubscribeList.push(unsubscribe);
  };
};

export const fetchUsersData = createAsyncThunk(
  "users/fetchData",
  async (uid: string, thunkAPI) => {
    try {
      const rootState = thunkAPI.getState() as RootState;
      const found = rootState.allUsers.users.some((el) => el.uid === uid);
      if (!found) {
        const promise = await firebase
          .firestore()
          .collection("users")
          .doc(uid)
          .get()
          .then((snapshot) => {
            if (snapshot.exists !== true) {
              console.log("does not exist");
            }
            // console.log(snapshot.data());
            let user = snapshot.data(); //Method for Retrieving a single document from Cloud Firestore
            user.uid = snapshot.id;
            thunkAPI.dispatch(fetchUsersPosts(user.uid)); //setting id to the function redux action creator below
            return user;
          });

        thunkAPI.dispatch(fetchUsersSuccess(promise));
      }
    } catch (error) {
      console.log(error);
    }
  }
);

export const fetchUsersPosts = createAsyncThunk(
  "users/posts",
  async (uid: string, { rejectWithValue, ...thunkAPI }) => {
    console.log({ uidQuery: uid });
    try {
      const promise = await firebase
        .firestore()
        .collection("posts")
        .doc(uid)
        .collection("userPosts")
        .orderBy("creation", "asc")
        .get()
        .then((snapshot: firebase.firestore.DocumentData) => {
          console.log({ snapshot });

          //cf: https://stackoverflow.com/questions/38731620/firebase-query-based-on-child-prop-value-and-get-path
          //this is an array containing each step of the path. so if the actual path is for example foo/bar/baz, this will show as ["foo","bar","baz"], which obviously you can read out with
          const uid: string =
            snapshot._delegate.query._query.T.path.segments[1]; // I had to inspect resolved snapshot above to get this value

          console.log({ uid });
          const rootState = thunkAPI.getState() as RootState;
          const user = rootState.allUsers.users.find((el) => el.uid === uid);

          // console.log(snapshot.docs[0].data());
          // Querying a collection from Cloud Firestore (doc => collection => field) //map the docs and do a get data method for each ===> .data()
          const response = snapshot.docs.map(
            (doc: { data: () => IPosts; id: string }) => {
              const data = doc.data();
              const id = doc.id;
              return { id, ...data, user };
            }
          );

          return response as IUserState;
        });
      thunkAPI.dispatch(fetchUsersPostsSuccess(promise)); // action for the reducer dispatched here to fulfilled
    } catch (err) {
      console.log(err);
      const error = rejectWithValue(err);
      thunkAPI.dispatch(fetchUsersPostsFailure(error)); // action for the reducer dispatched here to rejected
    }
  }
);

const initialState = {
  users: [],
  loadingUsersStatus: "idle",
  usersLoadedCount: 0,
  usersDataError: null,
} as IUserState;

const allUsers = createSlice({
  name: "allUsers",
  initialState,
  reducers: {
    fetchUsersPending: (state) => {
      state.loadingUsersStatus = "loading";
      state.usersDataError = null;
    },

    fetchUsersSuccess: (state, action) => {
      state.users.push(action.payload);
      state.loadingUsersStatus = "idle";
    },
    fetchUsersFailure: (state, action) => {
      if (action.payload) state.usersDataError = action.payload;
      state.loadingUsersStatus = "idle";
    },

    fetchUsersPostsSuccess: (state, action) => {
      state.usersLoadedCount = state.usersLoadedCount + 1; //increment the numbers by 1 everytime new user was added
      state.loadingUsersStatus = "idle";

      if (action.payload.length > 0) {
        state.users = state.users.map((user) =>
          user.uid === action.payload[0].user.uid
            ? { ...user, posts: action.payload }
            : { ...user, posts: [] }
        );
      }
    },

    fetchUsersPostsFailure: (state, action) => {
      state.loadingUsersStatus = "idle";

      if (action.payload.length > 0) {
        state.users = state.users.map((user) =>
          user.uid === action.payload[0].user.uid
            ? { ...user, postError: action.payload }
            : { ...user, postError: null }
        );
      }
    },

    clearAllUsersData: (state) => {
      return {
        ...state,
        users: [],
        usersLoadedCount: 0,
        usersDataError: null,
      };
    },
  },
  //   extraReducers: () => {},
});

export const {
  fetchUsersPending,
  fetchUsersFailure,
  fetchUsersSuccess,
  fetchUsersPostsSuccess,
  fetchUsersPostsFailure,
  clearAllUsersData,
} = allUsers.actions;

export default allUsers.reducer;
