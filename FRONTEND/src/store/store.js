import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './rootReducer';

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        //NOTE: Ignore non-serializable socket object path
        ignoredPaths: ["socket.socket"]
      }
    })
});

export default store;