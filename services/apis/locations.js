import axiosInstance from "../../services/axiosConfig";

export const locationsApi = {
  getUserLocation: async (userId) => {
    const response = await axiosInstance.get(`/locations/userId/${userId}`);
    return response.data;
  },

  createLocation: async ({ userId, coordinates, regionName }) => {
    const response = await axiosInstance.post("/locations", {
      userId,
      coordinates,
      regionName,
      dailyEnergyProduced: [],
    });
    return response.data;
  },

  updateLocation: async (
    id,
    { userId, coordinates, regionName, dailyEnergyProduced }
  ) => {
    const response = await axiosInstance.put(`/locations/${id}`, {
      userId,
      coordinates,
      regionName,
      dailyEnergyProduced,
    });
    return response.data;
  },

  transformLocationData: (data) => ({
    id: data.id,
    latitude: data.coordinates[0],
    longitude: data.coordinates[1],
    dailyEnergyProduced: data.dailyEnergyProduced,
    regionId: data.regionId.id,
    regionName: data.regionId.name,
    monthlyInsolation: data.regionId.monthlyInsolation,
    yearlyInsolation: data.regionId.yearlyInsolation,
  }),
};
