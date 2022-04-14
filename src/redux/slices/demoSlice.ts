import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface DemoState {
  demo: boolean;
}

const initialState: DemoState = {
	demo : false
}

export const demoSlice = createSlice({
  name: 'Demo',
  initialState,
  reducers: {
    setDemo: (state, action: PayloadAction<boolean>) => {
      state.demo = action.payload
    },
  },
})

// Action creators are generated for each case reducer function
export const { setDemo } = demoSlice.actions

const demoReducer = demoSlice.reducer;
export default demoReducer;