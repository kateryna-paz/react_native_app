import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../services/axiosConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const initializeAuth = createAsyncThunk(
  "auth/initializeAuth",
  async (_, { rejectWithValue }) => {
    try {
      const user = await AsyncStorage.getItem("user");
      const token = await AsyncStorage.getItem("token");

      if (user && token) {
        axiosInstance.defaults.headers.Authorization = `Bearer ${token}`;
        return { user: JSON.parse(user), token };
      }
      return { user: null, token: null };
    } catch (error) {
      return rejectWithValue("Не вдалося ініціалізувати авторизацію");
    }
  }
);

export const registerUser = createAsyncThunk(
  "auth/register",
  async (_, { rejectWithValue, getState }) => {
    const state = getState();

    console.log(state.auth.user);
    const { name, email, password } = state.auth.user;

    try {
      if (name && email && password) {
        const response = await axiosInstance.post("/users/register", {
          name,
          email,
          password,
        });
        return response.data;
      } else {
        return rejectWithValue(
          "Сталася помилка при створені акаунта, перевірте чи було  введено ім'я, електронна пошта та пароль."
        );
      }
    } catch (error) {
      return rejectWithValue({
        message: error.response?.data?.message || "Request failed",
        status: error.response?.status || 503,
      });
    }
  }
);

export const setRegisterUserData = createAsyncThunk(
  "auth/setRegisterUserData",
  async ({ name, email, password }, { rejectWithValue }) => {
    try {
      const userInDB = await axiosInstance.get(`/users/email/${email}`);

      console.log(userInDB?.data);
      if (userInDB.data.id) {
        return rejectWithValue("Користувач з таким email вже існує");
      } else {
        return { name, email, password };
      }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.response?.message ||
          error.data?.message ||
          "Request failed"
      );
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
      await AsyncStorage.multiRemove(["token", "user"]);
      return null;
    } catch (error) {
      return rejectWithValue("Помилка виходу з акаунту");
    }
  }
);

const initialState = {
  user: null,
  isLoggedIn: false,
  isLoading: false,
  userToken: null,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
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
        state.error = null;
        AsyncStorage.multiSet([
          ["user", JSON.stringify(action.payload.user)],
          ["token", action.payload.token],
        ]);
        axiosInstance.defaults.headers.Authorization = `Bearer ${action.payload.token}`;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(setRegisterUserData.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(setRegisterUserData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = { ...action.payload };
        console.log(state.user);
        state.error = null;
      })
      .addCase(setRegisterUserData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.userToken = action.payload.token;
        state.error = null;
        AsyncStorage.multiSet([
          ["user", JSON.stringify(action.payload.user)],
          ["token", action.payload.token],
        ]);
        axiosInstance.defaults.headers.Authorization = `Bearer ${action.payload.token}`;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.userToken = null;
        state.isLoggedIn = false;
      })
      .addCase(initializeAuth.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.userToken = action.payload.token;
        state.isLoggedIn = !!action.payload.token;
      })
      .addCase(initializeAuth.rejected, (state) => {
        state.user = null;
        state.userToken = null;
        state.isLoggedIn = false;
      });
  },
});

export default authSlice.reducer;
