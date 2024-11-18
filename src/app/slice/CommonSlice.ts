import { createSlice } from '@reduxjs/toolkit'

export interface CounterState {
    value: number
}

const initialState = {
    search: ''
}

export const commonSlice = createSlice({
    name: 'common',
    initialState,
    reducers: {
        setSearchText: (state, action) => {
            state.search = action.payload;
        }
    },
})


export const { setSearchText } = commonSlice.actions

export default commonSlice.reducer;