import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  shopData: null
};

const shopSlice = createSlice({
  name: "shop",
  initialState,
  reducers: {
    setShopData: (state, action) => {
      state.shopData = action.payload;
    },
    clearShopData: (state) => {
      state.shopData = null;
    }
  }
});

export const { setShopData, clearShopData } = shopSlice.actions;
export default shopSlice.reducer;
