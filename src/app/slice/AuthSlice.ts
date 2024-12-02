import { createSlice } from '@reduxjs/toolkit'

export interface AuthState {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    userData: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    user?: any; 
    adminData:any; 
}

const initialState: AuthState = {
    adminData: localStorage.getItem('adminInfo') ? JSON.parse(localStorage.getItem('adminInfo') as string) : null,
    userData: localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo') as string) : null,
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
            state.user = undefined;
            localStorage.removeItem('userInfo');
            localStorage.removeItem('userAddress');
        },
        adminLogout: (state) => {
            state.adminData = null;
            localStorage.removeItem('adminInfo');
            // localStorage.removeItem('adminToken');
            // localStorage.removeItem('refreshToken');
        },
    },
})


export const {
    setAdminCredential,
    adminLogout,
    setUserCredential,
    userLogout,
    saveUser } = authSlice.actions

export default authSlice.reducer;