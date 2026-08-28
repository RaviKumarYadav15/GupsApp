import { createSlice } from '@reduxjs/toolkit';
import { 
  loginThunk, 
  signupThunk, 
  getProfileThunk, 
  logoutThunk, 
  getOtherUsersThunk 
} from './authThunks';

let savedUser = null;
try {
  savedUser = JSON.parse(localStorage.getItem("user") || "null");
} catch (e) {
  console.error("Failed to parse user from local storage", e);
}
const hasSession = localStorage.getItem("hasSession") === "true";

const slice = createSlice({
  name: 'auth',
  initialState: {
    user: savedUser,
    isAuthenticated: hasSession && !!savedUser,
    otherUsers:[],
    authLoading: false, // Never show full-screen loader on refresh if we have a session
    dataLoading: false,
    error: null,
  },
  reducers: {
    setAuthLoading: (state, action) => {
      state.authLoading = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginThunk.pending, (s) => {
        s.authLoading = true;
        s.error = null;
      })
      .addCase(loginThunk.fulfilled, (s, a) => {
        s.authLoading = false;
        s.user = a.payload;
        s.isAuthenticated = true;
      })
      .addCase(loginThunk.rejected, (s, a) => {
        s.authLoading = false;
        s.error = a.payload;
        s.isAuthenticated = false;
      })

      .addCase(signupThunk.pending, (s) => {
        s.authLoading = true;
        s.error = null;
      })
      .addCase(signupThunk.fulfilled, (s, a) => {
        s.authLoading = false;
        s.user = a.payload;
        s.isAuthenticated = true;
      })
      .addCase(signupThunk.rejected, (s, a) => {
        s.authLoading = false;
        s.error = a.payload;
        s.isAuthenticated = false;
        console.log(s.error);
      })

      .addCase(getProfileThunk.pending, (s) => { 
        // Do not set authLoading to true here, we want to render optimistically
        s.error = null;
      })
      .addCase(getProfileThunk.fulfilled, (s, a) => {
        s.authLoading = false;
        s.user = a.payload;
        s.isAuthenticated = true;
      })
      .addCase(getProfileThunk.rejected, (s, a) => {
        s.authLoading = false;
        s.user = null;
        s.isAuthenticated = false;
        s.error = a.payload;
      })

      .addCase(logoutThunk.fulfilled, (s) => {
        s.user = null;
        s.authLoading = false;
        s.error = null;
        s.isAuthenticated = false;
        s.otherUsers=[];
      })

      .addCase(getOtherUsersThunk.pending,(s)=>{
        s.dataLoading = true;
      })
      .addCase(getOtherUsersThunk.fulfilled,(s,a)=>{
        s.dataLoading = false;
        s.otherUsers = a.payload;
      })
      .addCase(getOtherUsersThunk.rejected,(s,a)=>{
        s.dataLoading = false;
        s.error = a.payload;
        s.otherUsers = [];
      });
  },
});

export const { setAuthLoading } = slice.actions;
export default slice.reducer;