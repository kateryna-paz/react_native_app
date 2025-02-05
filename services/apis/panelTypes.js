import axiosInstance from "../axiosConfig";

export const panelTypesApi = {
  fetchTypes: async () => {
    const response = await axiosInstance.get("/paneltypes");

    return response.data;
  },
};
