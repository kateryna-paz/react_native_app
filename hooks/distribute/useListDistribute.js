import { useCallback, useEffect, useState } from "react";
import { showToast } from "../../utils/showToast";
import { calculateDistribution } from "../../utils/distributionUtils";
import useAuthStore from "../../store/authStore";
import useDevicesStore from "../../store/devicesStore";
import useDistributeDevicesStore from "../../store/distributeStore";

export function useListDistribute() {
  const [refreshing, setRefreshing] = useState(false);
  const { isLoggedIn } = useAuthStore();

  const { devices, isLoading, error, fetchDevices } = useDevicesStore();
  const {
    selectedDevices,
    unselectedDevices,
    totalDistributeEnergy,
    setSelectedDevices,
    setUnselectedDevices,
    toggleSelectDevice,
  } = useDistributeDevicesStore();

  const updateDistribution = useCallback(() => {
    if (selectedDevices.length > 0 && totalDistributeEnergy > 0) {
      const updatedDevices = calculateDistribution(
        selectedDevices,
        totalDistributeEnergy
      );
      if (JSON.stringify(updatedDevices) !== JSON.stringify(selectedDevices)) {
        setSelectedDevices(updatedDevices);
      }
    }
  }, [selectedDevices, totalDistributeEnergy, setSelectedDevices]);

  const refresh = async () => {
    try {
      setRefreshing(true);
      await fetchDevices();

      const refreshedDevices = devices;

      const updatedSelected = selectedDevices.map((selected) => {
        const refreshedDevice = refreshedDevices.find(
          (dev) => dev.id === selected.id
        );
        return refreshedDevice || selected;
      });

      const updatedUnselected = unselectedDevices.map((unselected) => {
        const refreshedDevice = refreshedDevices.find(
          (dev) => dev.id === unselected.id
        );
        return refreshedDevice || unselected;
      });

      setSelectedDevices(updatedSelected);
      setUnselectedDevices(updatedUnselected);
      updateDistribution();
    } catch (err) {
      showToast("error", "Упс... Сталася помилка при оновленні даних.");
      console.log(err);
    } finally {
      setRefreshing(false);
    }
  };

  const handleToggleSelectDevice = useCallback(
    (deviceId) => {
      const device = devices.find((dev) => dev.id === deviceId);
      if (device) {
        toggleSelectDevice(device);
        updateDistribution();
      }
    },
    [devices, updateDistribution, toggleSelectDevice]
  );

  useEffect(() => {
    if (isLoggedIn && !isLoading && !devices?.length) {
      fetchDevices();
    }
  }, [devices, isLoading, isLoggedIn, fetchDevices]);

  useEffect(() => {
    if (!isLoading && selectedDevices?.length) {
      updateDistribution();
    }
  }, [selectedDevices, updateDistribution, isLoading]);

  useEffect(() => {
    useDistributeDevicesStore.getState().initializeStore();
  }, []);

  return {
    selectedDevices,
    unselectedDevices,
    isLoading,
    error,
    refreshing,
    refresh,
    handleToggleSelectDevice,
  };
}
