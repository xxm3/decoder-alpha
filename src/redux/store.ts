import { configureStore } from '@reduxjs/toolkit'
import walletReducer from './slices/walletSlice'
import demoReducer from './slices/demoSlice'

export const store = configureStore({
  reducer: {
    wallet : walletReducer,
	demo : demoReducer
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch