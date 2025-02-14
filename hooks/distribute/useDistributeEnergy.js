import { useState, useEffect, useCallback } from "react";
import { router } from "expo-router";
import { showToast } from "../../utils/showToast";
import { calculateDistribution } from "../../utils/distributionUtils";
import useAuthStore from "../../store/authStore";
import useDevicesStore from "../../store/devicesStore";
import useDistributeDevicesStore from "../../store/distributeStore";

export const useDistributeEnergy = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [selectedDevicesLocal, setSelectedDevicesLocal] = useState([]);
  const { isLoggedIn } = useAuthStore();

  const { devices, isLoading, error, fetchDevices } = useDevicesStore();
  const {
    totalDistributeEnergy,
    clearDistributionState,
    setSelectedDevices,
    setUnselectedDevices,
    selectedDevices,
  } = useDistributeDevicesStore();

  const deviceCount = devices?.length || 0;

  const refresh = async () => {
    try {
      setRefreshing(true);
      fetchDevices();
      clearDistributionState();
    } catch (_) {
      showToast("error", "Упс... Сталася помилка при оновленні даних.");
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (isLoggedIn && !isLoading && !devices?.length && !error) {
      fetchDevices();
    }
  }, [devices?.length, isLoading, isLoggedIn, fetchDevices, error]);

  useEffect(() => {
    useDistributeDevicesStore.getState().initializeStore();
    setSelectedDevicesLocal(selectedDevices);
  }, []);

  const toggleSelectDevice = useCallback(
    (deviceId) => {
      setSelectedDevicesLocal((prev) => {
        const existingDevice = prev.find((dev) => dev.id === deviceId);
        if (existingDevice) {
          return prev.filter((dev) => dev.id !== deviceId);
        }

        const device = devices.find((dev) => dev.id === deviceId);
        if (!device) return prev;

        const maxWorkingTime = (totalDistributeEnergy * 1000) / device.power;
        const maxHours = Math.floor(maxWorkingTime);
        const maxMinutes = Math.round((maxWorkingTime - maxHours) * 60);

        return [
          ...prev,
          {
            ...device,
            maxWorkingHours: maxHours,
            maxWorkingMinutes: maxMinutes,
          },
        ];
      });
    },
    [devices, totalDistributeEnergy]
  );

  const handleDistribute = useCallback(async () => {
    if (selectedDevicesLocal.length === 0) {
      showToast("error", "Будь ласка, оберіть хоча б один пристрій.");
      return;
    }

    if (totalDistributeEnergy <= 0) {
      showToast(
        "error",
        "Спочатку розрахуйте енергію!",
        "<- Перейдіть на Головну сторінку"
      );
      return;
    }

    const updatedDevices = calculateDistribution(
      selectedDevicesLocal,
      totalDistributeEnergy
    );

    const unselectedDevices = devices.filter(
      (device) => !selectedDevicesLocal.find((dev) => dev.id === device.id)
    );

    setSelectedDevices(updatedDevices);
    setUnselectedDevices(unselectedDevices);
    router.push("/energy_distribution/list");
  }, [
    selectedDevicesLocal,
    totalDistributeEnergy,
    devices,
    setSelectedDevices,
    setUnselectedDevices,
  ]);

  const navigateToDevices = useCallback(() => {
    router.push("/devices");
  }, []);

  return {
    refreshing,
    isLoading,
    error,
    devices,
    deviceCount,
    selectedDevicesLocal,
    refresh,
    toggleSelectDevice,
    handleDistribute,
    navigateToDevices,
  };
};
