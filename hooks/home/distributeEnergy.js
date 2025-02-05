export default function useDistributeEnergy(devices, totalEnergy) {
  const totalEnergyInWh = totalEnergy * 1000;

  const importanceLevels = {
    висока: [],
    середня: [],
    низька: [],
  };

  devices.forEach((device) => {
    importanceLevels[device.importance]?.push(device);
  });

  const energyAllocation = {
    висока: 0.5,
    середня: 0.35,
    низька: 0.15,
  };

  const result = [];
  for (const [importance, deviceList] of Object.entries(importanceLevels)) {
    if (deviceList.length === 0) continue;

    const allocatedEnergy = totalEnergyInWh * energyAllocation[importance];
    const energyPerDevice = allocatedEnergy / deviceList.length;

    deviceList.forEach((device) => {
      const workingTimeInHours = energyPerDevice / device.power;
      result.push({
        id: device.id,
        name: device.name,
        importance: importance,
        power: device.power,
        allocatedEnergy: energyPerDevice.toFixed(2),
        workingTime: workingTimeInHours.toFixed(2),
      });
    });
  }

  return result;
}
