import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface selcetServer{
    id: string
    name: string
    discordGuildId:string
}

export interface whiteListState {
  selectMultipleServerList :selcetServer[]
}

const initialState: whiteListState = {
	selectMultipleServerList : []
}

export const whiteListSlice = createSlice({
  name: 'multipalServer',
  initialState,
  reducers: {
    setMultipleList: (state:any, action: PayloadAction<selcetServer[]>) => {
		state.selectMultipleServerList = action.payload
	}
  },
})

// Action creators are generated for each case reducer function
export const { setMultipleList } = whiteListSlice.actions

const whiteListReducer = whiteListSlice.reducer;
export default whiteListReducer;