import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../services/axiosConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const registerUser = createAsyncThunk(
  "auth/register",
  async (
    { name, email, password, locationId, panelIds, applianceIds },
    { rejectWithValue }
  ) => {
    try {
      const user = await axiosInstance.post("/users/register", {
        name,
        email,
        password,
        locationId,
        panelIds,
        applianceIds,
      });
      console.log(user.data);
      return user.data;
    } catch (error) {
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/users/login", {
        email,
        password,
      });
      console.log(response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue({
        message: error.response?.data?.message || "Request failed",
        status: error.response?.status || 503,
      });
    }
  }
);

export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await AsyncStorage.removeItem("user");
      return null;
    } catch (error) {
      return rejectWithValue("Помилка виходу з акаунту");
    }
  }
);

const initialState = {
  isLoading: false,
  user: {},
  userToken: null,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.userToken = action.payload.token;
        AsyncStorage.setItem("token", action.payload.token);
        axiosInstance.defaults.headers.Authorization = `Bearer ${action.payload.token}`;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        console.log("login reducer token: " + action.payload.token);
        console.log("login reducer user: " + action.payload.user);
        state.userToken = action.payload.token;
        state.user = action.payload.user;
        AsyncStorage.setItem("token", action.payload.token);
        axiosInstance.defaults.headers.Authorization = `Bearer ${action.payload.token}`;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.error = action.payload;
        state.isLoading = false;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
      });
  },
});

export default authSlice.reducer;
