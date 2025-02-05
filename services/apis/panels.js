import axiosInstance from "../../services/axiosConfig";

export const panelsApi = {
  fetchUserPanels: async (userId) => {
    const response = await axiosInstance.get(`/panels/userId/${userId}`);

    if (
      response?.data?.message &&
      response.data.message === "Для цього користувача немає панелей"
    ) {
      return [];
    }

    return response.data.map((panel) => ({
      id: panel.id,
      typeId: panel.typeId.id,
      type: panel.typeId.type,
      efficiency: panel.typeId.efficiency,
      power: panel.power,
      number: panel.number,
      userId: panel.userId,
    }));
  },

  async addPanel(userId, typeId, number, power) {
    const newPanel = await axiosInstance.post("/panels", {
      typeId: typeId,
      number: number,
      power: power,
      userId,
    });

    return {
      id: newPanel.data.id,
      typeId: newPanel.data.typeId.id,
      type: newPanel.data.typeId.type,
      efficiency: newPanel.data.typeId.efficiency,
      power: newPanel.data.power,
      number: newPanel.data.number,
      userId: newPanel.data.userId,
    };
  },

  async changePanel(id, typeId, number, power) {
    const updatedPanel = await axiosInstance.put(`/panels/${id}`, {
      typeId: typeId,
      number: number,
      power: power,
    });

    return updatedPanel.data;
  },

  async deletePanel(id) {
    await axiosInstance.delete(`/panels/${id}`);
    return id;
  },
};
