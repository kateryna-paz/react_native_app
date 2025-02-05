import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getErrorMessage } from "../utils/errorHandler";
import authApi from "../../services/apis/auth";

export const initializeAuth = createAsyncThunk(
  "auth/initializeAuth",
  async (_, { rejectWithValue }) => {
    try {
      const { user, token } = await authApi.getUserData();
      if (user && token) {
        authApi.setAuthToken(token);
        return { user, token };
      }
      return { user: null, token: null };
    } catch (error) {
      return rejectWithValue("Не вдалося ініціалізувати авторизацію");
    }
  }
);

export const registerUser = createAsyncThunk(
  "auth/register",
  async ({ name, email, password }, { rejectWithValue }) => {
    try {
      if (!name || !email || !password) {
        return rejectWithValue(
          "Перевірте чи було введено ім'я, електронна пошта та пароль."
        );
      }

      const data = await authApi.register({ name, email, password });
      await authApi.saveUserData(data.user, data.token);
      authApi.setAuthToken(data.token);

      return data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const data = await authApi.login({ email, password });
      await authApi.saveUserData(data.user, data.token);
      authApi.setAuthToken(data.token);

      return data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await authApi.clearUserData();
      authApi.removeAuthToken();
      return null;
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Помилка виходу з акаунту")
      );
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
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.userToken = action.payload.token;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Login
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.userToken = action.payload.token;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.userToken = null;
        state.isLoggedIn = false;
      })

      // Initialize
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

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
