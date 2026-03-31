import { createSlice } from "@reduxjs/toolkit";

const userslice = createSlice({
  name: "user",
  initialState: {
    userData: null,
    isAuthenticated: false,
  },
  reducers: {
    setUserData: (state, action) => {
      state.userData = action.payload;
      state.isAuthenticated = true;
    },

    clearuser: (state) => {
      state.userData = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setUserData, clearuser } = userslice.actions;
export default userslice.reducer;
