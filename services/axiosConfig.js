import axios from "axios";

const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VkSWQiOiI2NzM2MWUxNGE5ZDk2NTY3MmM2ODBiYjkiLCJpYXQiOjE3MzIyODU1MDAsImV4cCI6MTczMjM3MTkwMH0.I1vefncsuQXQV_yFGcbeI3pjSpif5ya1r9mhRwq9gHk";
console.log(
  `${process.env.EXPO_PUBLIC_BASE_URL}${process.env.EXPO_PUBLIC_API_URL}`
);
console.log(token);

const axiosInstance = axios.create({
  baseURL: process.env.EXPO_PUBLIC_BASE_URL + process.env.EXPO_PUBLIC_API_URL,
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

export default axiosInstance;