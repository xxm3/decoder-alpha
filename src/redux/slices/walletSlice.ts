import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface WalletState {
  walletAddress: string | null;
}

const initialState: WalletState = {
	walletAddress : null
}

export const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    setWallet: (state, action: PayloadAction<WalletState["walletAddress"]>) => {
      state.walletAddress= action.payload
    },
  },
})

// Action creators are generated for each case reducer function
export const { setWallet } = walletSlice.actions

const walletReducer = walletSlice.reducer;
export default walletReducer;