import { useMemo } from "react";

const formatEnergy = (energy) => {
  if (energy >= 1000) {
    return { value: (energy / 1000).toFixed(2), unit: "МВт" };
  }
  return { value: energy.toFixed(2), unit: "кВт" };
};

export const useEnergyStatistics = (data) => {
  return useMemo(() => {
    const now = new Date();
    const nowTime = now.getTime();

    let weeklyEnergy = 0;
    let monthlyEnergy = 0;
    let yearlyEnergy = 0;

    data.forEach(({ date, energy }) => {
      const entryDate = new Date(date);
      const energyValue = parseFloat(energy);

      if (entryDate.getFullYear() === now.getFullYear()) {
        yearlyEnergy += energyValue;

        if (
          entryDate.getFullYear() === now.getFullYear() &&
          entryDate.getMonth() === now.getMonth()
        ) {
          monthlyEnergy += energyValue;

          const timeDiff = nowTime - entryDate.getTime();
          const daysDiff = timeDiff / (1000 * 60 * 60 * 24);
          if (daysDiff <= 7) {
            weeklyEnergy += energyValue;
          }
        }
      }
    });

    return {
      weekly: formatEnergy(weeklyEnergy),
      monthly: formatEnergy(monthlyEnergy),
      yearly: formatEnergy(yearlyEnergy),
    };
  }, [data]);
};
