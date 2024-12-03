import { configureStore } from "@reduxjs/toolkit";
import locationReducer from "./slices/locationAndMapSlice";
import typesReducer from "./slices/typesSlice";
import panelReducer from "./slices/panelSlice";
import authReducer from "./slices/authSlice";

const store = configureStore({
  reducer: {
    location: locationReducer,
    panelTypes: typesReducer,
    panel: panelReducer,
    auth: authReducer,
  },
});

export default store;
