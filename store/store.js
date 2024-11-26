import { configureStore } from "@reduxjs/toolkit";
import locationReducer from "./slices/locationSlice";
import mapReducer from "./slices/mapSlice";
import typesReducer from "./slices/typesSlice";
import panelReducer from "./slices/panelSlice";

const store = configureStore({
  reducer: {
    location: locationReducer,
    map: mapReducer,
    panelTypes: typesReducer,
    panel: panelReducer,
  },
});

export default store;
