import { createSlice } from '@reduxjs/toolkit';
import { 
  loginThunk, 
  signupThunk, 
  getProfileThunk, 
  logoutThunk, 
  getOtherUsersThunk 
} from './authThunks';

const slice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    isAuthenticated: false,
    otherUsers:[],
    authLoading: false,
    dataLoading: false,
    error: null,
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
        s.authLoading = true;
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

export default slice.reducer;