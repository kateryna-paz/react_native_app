import { useDispatch, useSelector } from "react-redux";
import { fetchLocation } from "../store/slices/locationSlice";
import * as Location from "expo-location";

const useLocation = () => {
  const dispatch = useDispatch();
  const { location, isLoading, error } = useSelector((state) => state.location);

  const fetchCurrentLocation = async () => {
    try {
      await dispatch(fetchLocation()).unwrap();
    } catch (error) {
      console.log("Failed to fetch location:", error);
    }
  };

  return {
    location,
    error,
    isLoading,
    fetchLocation: fetchCurrentLocation,
  };
};

export default useLocation;
