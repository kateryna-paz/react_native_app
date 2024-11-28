import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    id: null,
    email: null,
    name: null,
    location: null,
    panels: [],
    appliances: [],
  },
  reducers: {},
  extraReducers: (builder) => {},
});

export default userSlice.reducer;
