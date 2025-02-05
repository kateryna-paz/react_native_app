import { useCallback, useState } from "react";

const formatTime = (hour, endMinute) => {
  const totalMinutes = hour * 60 + endMinute;
  const adjustedHour = Math.floor(totalMinutes / 60) % 24;
  const adjustedMinutes = totalMinutes % 60;
  return `${adjustedHour}:${adjustedMinutes.toString().padStart(2, "0")}`;
};

export default function useSolarEnergyCalculator() {
  const [allEnergy, setAllEnergy] = useState(0);

  const calculateHourlyEnergy = useCallback(
    (hourlyClouds, sunrise, sunset, insolation, panelsPower) => {
      const hourlyEnergy = [];
      const [sunriseHour, sunriseMinute] = sunrise.split(":").map(Number);
      const [sunsetHour, sunsetMinute] = sunset.split(":").map(Number);

      let totalEnergyAccumulator = 0;

      for (let hour = sunriseHour; hour <= sunsetHour; hour++) {
        let startMinute = hour === sunriseHour ? sunriseMinute : 0;
        let endMinute = hour === sunsetHour ? sunsetMinute : 60;

        const cloudiness = hourlyClouds[hour - sunriseHour] || 0;
        const cloudImpact = 1 - 0.8 * (cloudiness / 100);

        const energyMono =
          panelsPower.monocristal *
          insolation *
          cloudImpact *
          ((endMinute - startMinute) / 60);
        const energyPoly =
          panelsPower.policristal *
          insolation *
          cloudImpact *
          ((endMinute - startMinute) / 60);
        const energyAmorph =
          panelsPower.amorfni *
          insolation *
          cloudImpact *
          ((endMinute - startMinute) / 60);

        const totalEnergy = energyMono + energyPoly + energyAmorph;

        totalEnergyAccumulator += totalEnergy;

        hourlyEnergy.push({
          interval: `${hour}:${startMinute
            .toString()
            .padStart(2, "0")}-${formatTime(hour, endMinute)}`,
          cloudiness,
          energy: totalEnergy.toFixed(3),
        });
      }

      const startEnergy = {
        interval: `${sunrise}`,
        cloudiness: hourlyClouds[0] || 0,
        energy: 0,
      };

      const energyForGraph = [startEnergy, ...hourlyEnergy];

      setAllEnergy(totalEnergyAccumulator.toFixed(2));

      return { hourlyEnergy: energyForGraph, allEnergy };
    },
    [allEnergy]
  );

  return { calculateHourlyEnergy, allEnergy };
}
