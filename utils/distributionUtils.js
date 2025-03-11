export const calculateDistribution = (
  selectedDevices,
  totalDistributeEnergy
) => {
  if (!selectedDevices?.length || !totalDistributeEnergy) return [];

  const totalEnergy = totalDistributeEnergy * 1000;

  // Фільтруємо пристрої з фіксованим часом
  const fixedDevices = selectedDevices.filter((dev) => dev.fixedTime);
  let fixedEnergyTotal = 0;

  fixedDevices.forEach((dev) => {
    dev.deviceEnergy = parseFloat(
      (dev.power * (dev.workingHours * 60 + dev.workingMinutes)) / 60 / 1000
    ).toFixed(3);
    fixedEnergyTotal += dev.deviceEnergy * 1000;
  });

  const remainingEnergy = totalEnergy - fixedEnergyTotal;

  // Фільтруємо пристрої без фіксованого часу
  const dynamicDevices = selectedDevices.filter((dev) => !dev.fixedTime);

  // Якщо енергії на інші пристрої не лишилось
  if (remainingEnergy <= 0) {
    const zeroTimeDevices = dynamicDevices.map((device) => ({
      ...device,
      workingHours: 0,
      workingMinutes: 0,
      deviceEnergy: 0,
      allocatedEnergy: 0,
    }));
    return [...fixedDevices, ...zeroTimeDevices];
  }

  // Перераховуємо maxWorkingHours та maxWorkingMinutes для кожного пристрою
  dynamicDevices.forEach((device) => {
    const maxWorkingTime = remainingEnergy / device.power;
    device.maxWorkingHours = Math.floor(maxWorkingTime);
    device.maxWorkingMinutes = Math.round(
      (maxWorkingTime - device.maxWorkingHours) * 60
    );
  });

  // Групуємо інші пристрої за пріоритетністю
  const groupedDevices = {
    high: dynamicDevices.filter((dev) => dev.importance === "висока"),
    medium: dynamicDevices.filter((dev) => dev.importance === "середня"),
    low: dynamicDevices.filter((dev) => dev.importance === "низька"),
  };

  let distributionRatios = { high: 0.5, medium: 0.35, low: 0.15 };
  const activeGroups = Object.keys(groupedDevices).filter(
    (key) => groupedDevices[key].length > 0
  );
  const totalActiveRatio = activeGroups.reduce(
    (sum, key) => sum + distributionRatios[key],
    0
  );
  activeGroups.forEach((key) => {
    distributionRatios[key] = distributionRatios[key] / totalActiveRatio;
  });

  // Розподіляємо енергію серед пристроїв, які не мають фіксованого часу
  const energyDistribution = {
    high:
      (remainingEnergy * distributionRatios.high) /
      (groupedDevices.high.length || 1),
    medium:
      (remainingEnergy * distributionRatios.medium) /
      (groupedDevices.medium.length || 1),
    low:
      (remainingEnergy * distributionRatios.low) /
      (groupedDevices.low.length || 1),
  };

  const updatedDevices = dynamicDevices.map((device) => {
    const importanceKey =
      device.importance === "висока"
        ? "high"
        : device.importance === "середня"
          ? "medium"
          : "low";
    const allocatedEnergy = energyDistribution[importanceKey];
    const { hours, minutes } = calculateWorkingTime(device, allocatedEnergy);
    const deviceUseEnergy = parseFloat(
      (device.power * (hours * 60 + minutes)) / 60 / 1000
    ).toFixed(3);

    return {
      ...device,
      allocatedEnergy,
      deviceEnergy: deviceUseEnergy,
      workingHours: hours,
      workingMinutes: minutes,
    };
  });

  return [...fixedDevices, ...updatedDevices];
};

const calculateWorkingTime = (device, allocatedEnergy) => {
  if (!device.power || device.power <= 0) return { hours: 0, minutes: 0 };

  const workingTime = allocatedEnergy / device.power;
  const hours = Math.floor(workingTime);
  const minutes = Math.round((workingTime - hours) * 60);

  return { hours, minutes };
};
