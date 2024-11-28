import { configureStore } from "@reduxjs/toolkit";
import locationReducer from "./slices/locationSlice";
import mapReducer from "./slices/mapSlice";
import typesReducer from "./slices/typesSlice";
import panelReducer from "./slices/panelSlice";
import authReducer from "./slices/authSlice";
import userReducer from "./slices/userSlice";

const store = configureStore({
  reducer: {
    location: locationReducer,
    map: mapReducer,
    panelTypes: typesReducer,
    panel: panelReducer,
    auth: authReducer,
    user: userReducer,
  },
});

export default store;
