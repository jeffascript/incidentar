import {
  createSlice,
  createAsyncThunk,
  SerializedError,
} from "@reduxjs/toolkit";
import firebase from "firebase";
import { AppDispatch } from "./store";

import { UserData } from "./user.slice";

interface Posts {
  comments?: string;
  creation: string;
  title: string;
}

interface IAllUsers extends UserData {
  posts: Posts[];
}

type UserState = {
  users: IAllUsers[]; // alternatively:  firebase.firestore.DocumentData
  loadingUsersStatus: "idle" | "loading";
  usersLoadedCount: number;
  usersDataError: string | null | SerializedError;
};

// const initialState = {
//   users: [],
//   usersLoadedCount: 0,
//   usersDataError: null,
// } as UserState;

// async getMarkers() {
//     const events = await firebase.firestore().collection('events')
//     events.get().then((querySnapshot) => {
//         const tempDoc = querySnapshot.docs.map((doc) => {
//           return { id: doc.id, ...doc.data() }
//         })
//         console.log(tempDoc)
//       })
//   }

const listenerUnsubscribeList = [];
export const fetchAllUsers = () => {
  return (dispatch: AppDispatch) => {
    dispatch(fetchUsersPending());
    const unsubscribe = firebase
      .firestore()
      .collection("users")
      .onSnapshot(
        (snapshot) => {
          dispatch(
            fetchUsersSuccess(
              snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
            )
          );
        },
        (error) => {
          dispatch(fetchUsersFailure(error));
        }
      );
    listenerUnsubscribeList.push(unsubscribe);
  };
};

/**
 * fetch all Users id in the collection with onSnapshot,
 * foreach of the ids above--> attach a fetchUserWithData from
 * above will be attached with fetchUsersPosts in order to get the posts for that user
 */

const initialState = {
  users: [],
  loadingUsersStatus: "idle",
  usersLoadedCount: 0,
  usersDataError: null,
};

const allUsers = createSlice({
  name: "allUsers",
  initialState,
  reducers: {
    fetchUsersPending: (state) => {
      state.loadingUsersStatus = "loading";
      state.usersDataError = null;
    },

    fetchUsersSuccess: (state, action) => {
      state.usersLoadedCount = state.usersLoadedCount + 1; //increment the numbers by 1 everytime new user was added
      state.users.push(action.payload);
      state.loadingUsersStatus = "idle";
    },
    fetchUsersFailure: (state, action) => {
      if (action.payload) state.usersDataError = action.payload;
      state.loadingUsersStatus = "idle";
    },

    //   clearUserData: (state) => {
    //     return {
    //       ...state,
    //       currentUser: null,
    //       loadingUserStatus: "loading",
    //       userDataError: null,
    //     };
    //   },
  },
  extraReducers: () => {},
});

export const { fetchUsersPending, fetchUsersFailure, fetchUsersSuccess } =
  allUsers.actions;

export default allUsers.reducer;
