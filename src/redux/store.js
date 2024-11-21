import { configureStore } from "@reduxjs/toolkit";
import dataReducer from "./dataSlice"; // Correct the import path

export const store = configureStore({
  reducer: {
    data: dataReducer,
  },
});
