import axiosInstance from "../../services/axiosConfig";

export const devicesApi = {
  fetchUserDevices: async (userId) => {
    const response = await axiosInstance.get(`/appliances/userId/${userId}`);
    return response.data;
  },

  addDevice: async ({ name, power, importance, userId }) => {
    const response = await axiosInstance.post("/appliances", {
      name,
      power,
      importance,
      userId,
    });
    return response.data;
  },

  updateDevice: async ({ id, name, power, importance }) => {
    const response = await axiosInstance.put(`/appliances/${id}`, {
      name,
      power,
      importance,
    });
    return response.data;
  },

  deleteDevice: async (id) => {
    await axiosInstance.delete(`/appliances/${id}`);
    return id;
  },
};
