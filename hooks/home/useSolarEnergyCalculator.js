import { useCallback, useMemo, useState } from "react";
import useLocationStore from "../../store/locationAndMapStore";
import usePanelsStore from "../../store/panelsStore";
import usePanelTypesStore from "../../store/panelTypesStore";
import {
  TEMP_COEF,
  TEMP_STANDART,
  CLOUD_COEF,
} from "../../constants/tempConsts";

const formatTime = (hour, endMinute) => {
  const totalMinutes = hour * 60 + endMinute;
  const adjustedHour = Math.floor(totalMinutes / 60) % 24;
  const adjustedMinutes = totalMinutes % 60;
  return `${adjustedHour}:${adjustedMinutes.toString().padStart(2, "0")}`;
};

export default function useSolarEnergyCalculator() {
  const { location } = useLocationStore();

  const { panels } = usePanelsStore();
  const { panelTypes } = usePanelTypesStore();

  const [allEnergy, setAllEnergy] = useState(0);

  const efficiency = useMemo(() => {
    if (!panels?.length || !panelTypes?.length) return null;

    const effMono =
      panelTypes.find((pT) => pT.type === "Монокристалічні").efficiency / 100;
    const effPoli =
      panelTypes.find((pT) => pT.type === "Полікристалічні").efficiency / 100;
    const effAmo =
      panelTypes.find((pT) => pT.type === "Аморфні").efficiency / 100;

    return {
      monocristal: effMono,
      policristal: effPoli,
      amorfni: effAmo,
    };
  }, [panels, panelTypes]);

  const panelsPower = useMemo(() => {
    if (!panels?.length || !efficiency) return null;

    return panels.reduce(
      (acc, panel) => {
        const totalPower = (+panel.number * +panel.power) / 1000;
        if (panel.type === "Монокристалічні") {
          acc.monocristal += totalPower * efficiency.monocristal;
        } else if (panel.type === "Полікристалічні") {
          acc.policristal += totalPower * efficiency.policristal;
        } else if (panel.type === "Аморфні") {
          acc.amorfni += totalPower * efficiency.amorfni;
        }
        return acc;
      },
      { monocristal: 0, policristal: 0, amorfni: 0 }
    );
  }, [panels, efficiency]);

  const insolation = useMemo(
    () => location?.monthlyInsolation?.[new Date().getMonth()] || 0,
    [location]
  );

  const calculateHourlyEnergy = useCallback(
    (hourlyClouds, hourlyTemp, sunrise, sunset) => {
      const hourlyEnergy = [];
      const [sunriseHour, sunriseMinute] = sunrise.split(":").map(Number);
      const [sunsetHour, sunsetMinute] = sunset.split(":").map(Number);

      let totalEnergyAccumulator = 0;

      for (let hour = sunriseHour; hour <= sunsetHour; hour++) {
        let startMinute = hour === sunriseHour ? sunriseMinute : 0;
        let endMinute = hour === sunsetHour ? sunsetMinute : 60;

        const cloudiness = hourlyClouds[hour];
        const cloudImpact = 1 - CLOUD_COEF * (cloudiness / 100);
        const tempImpact =
          1 - (TEMP_COEF * (hourlyTemp[hour] - TEMP_STANDART)) / 100;

        const periodResult =
          insolation *
          cloudImpact *
          tempImpact *
          ((endMinute - startMinute) / 60);
        const energyMono = panelsPower.monocristal * periodResult;
        const energyPoly = panelsPower.policristal * periodResult;
        const energyAmorph = panelsPower.amorfni * periodResult;

        const totalEnergy = energyMono + energyPoly + energyAmorph;

        totalEnergyAccumulator += totalEnergy;

        hourlyEnergy.push({
          interval: `${hour}:${startMinute
            .toString()
            .padStart(2, "0")}-${formatTime(hour, endMinute)}`,
          cloudiness,
          temp: hourlyTemp[hour],
          energy: totalEnergy.toFixed(3),
        });
      }

      const startEnergy = {
        interval: `${sunrise}`,
        cloudiness: hourlyClouds[sunriseHour] || 0,
        energy: 0,
        temp: hourlyTemp[sunriseHour] || 0,
      };

      const energyForGraph = [startEnergy, ...hourlyEnergy];

      setAllEnergy(totalEnergyAccumulator.toFixed(2));

      return {
        hourlyEnergy: energyForGraph,
        allEnergy: totalEnergyAccumulator.toFixed(2),
      };
    },
    [insolation, panelsPower]
  );

  return { calculateHourlyEnergy, allEnergy };
}
