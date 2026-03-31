import { configureStore } from '@reduxjs/toolkit';
import userslice from "../redux/User.js";
import shopslice from "../redux/Shop.js"

export const store = configureStore({
  reducer: {
  
    user: userslice,
    shop:shopslice
  },
  devTools: true,
});
export default store;