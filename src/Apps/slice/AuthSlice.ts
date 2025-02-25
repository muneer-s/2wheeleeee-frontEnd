import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    adminData: localStorage.getItem('adminInfo') ? JSON.parse(localStorage.getItem('adminInfo') as string) : null,
    userData: localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo') as string) : null,
    user: localStorage.getItem('userAddress') ? JSON.parse(localStorage.getItem('userAddress') as any) : null,
};

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setAdminCredential: (state, action) => {
            state.adminData = action.payload;
            localStorage.setItem('adminInfo', JSON.stringify(action.payload));
        },
        saveUser: (state, action) => {
            state.user = action.payload;
            localStorage.setItem('userAddress', JSON.stringify(action.payload));
        },
        setUserCredential: (state, action) => {
            state.userData = action.payload;
            localStorage.setItem('userInfo', JSON.stringify(action.payload));
        },
        userLogout: (state) => {
            state.userData = null;
            state.user = null;
            localStorage.removeItem('userInfo');
            localStorage.removeItem('userAddress');
        },
        adminLogout: (state) => {
            state.adminData = null;
            localStorage.removeItem('adminInfo');
        },

    },
})


export const {
    setAdminCredential,
    adminLogout,
    setUserCredential,
    userLogout,
    saveUser,

} = authSlice.actions

export default authSlice.reducer;