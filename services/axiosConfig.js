import axios from "axios";

const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VkSWQiOiI2NzM2MWUxNGE5ZDk2NTY3MmM2ODBiYjkiLCJpYXQiOjE3MzI1NjQwNjUsImV4cCI6MTczMzE2ODg2NX0.-UMXOcDcJK-6Xl-Oj3PuuXBWUal04ABnLbNrshP0khc";

const axiosInstance = axios.create({
  baseURL: process.env.EXPO_PUBLIC_BASE_URL + process.env.EXPO_PUBLIC_API_URL,
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

export default axiosInstance;
