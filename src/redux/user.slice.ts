import {
  createSlice,
  createAsyncThunk,
  SerializedError,
} from "@reduxjs/toolkit";
import firebase from "firebase";
import { AppDispatch } from "./store";

export interface UserData {
  name: string;
  email: string;
  role: string;
}

type UserState = {
  currentUser: UserData; // alternatively:  firebase.firestore.DocumentData
  loadingUserStatus: "idle" | "loading";
  userDataError: string | null | SerializedError;
};

export const fetchUser = createAsyncThunk(
  "user/fetchCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      const promise = await firebase
        .firestore()
        .collection("users")
        .doc(firebase.auth().currentUser.uid)
        .get()
        .then((snapshot) => {
          if (snapshot.exists) {
            // console.log(snapshot.data());
            const resp = snapshot.data(); //Method for Retrieving a single document from Cloud Firestore
            console.log(resp);
            return resp as UserData;
          }
        });

      return promise;
    } catch (err) {
      console.log(err);
      return rejectWithValue({ message: err });
    }
  }
);

export const clearData = () => async (dispatch: AppDispatch) => {
  dispatch(clearUserData()); //clear for user.slices
  // dispatch(clearFollowData()); //clear for following.slices imported
  // dispatch(clearUsersData()); //clear for  allUsers.slices imported
};

const initialState = {
  currentUser: null,
  loadingUserStatus: "idle",
  userDataError: null,
} as UserState;

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearUserData: (state) => {
      return {
        ...state,
        currentUser: null,
        loadingUserStatus: "loading",
        userDataError: null,
      };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchUser.pending, (state) => {
      state.loadingUserStatus = "loading";
      state.userDataError = null;
    });

    builder.addCase(fetchUser.fulfilled, (state, action) => {
      state.currentUser = action.payload;
      state.loadingUserStatus = "idle";
      state.userDataError = null;
    });

    builder.addCase(fetchUser.rejected, (state, action) => {
      if (action.error) state.userDataError = action.error;
      state.loadingUserStatus = "idle";
    });
  },
});

export const { clearUserData } = userSlice.actions;

export default userSlice.reducer;
