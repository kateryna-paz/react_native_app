import { configureStore } from "@reduxjs/toolkit";
import locationReducer from "./slices/locationSlice";
import mapReducer from "./slices/mapSlice";
import typesReducer from "./slices/typesSlice";

const store = configureStore({
  reducer: {
    location: locationReducer,
    map: mapReducer,
    panelTypes: typesReducer,
  },
});

export default store;
