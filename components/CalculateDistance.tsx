import * as gps from 'expo-location';
import { getDistance } from 'geolib';

/**
 * Function to get current location
 * @returns {Promise<Location.LocationObject>}
 */
const getCurrentLocation = async () => {
  let { status } = await gps.requestForegroundPermissionsAsync();
  if (status !== 'granted') {
    throw new Error('Location permission not granted');
  }

  let location = await gps.getCurrentPositionAsync({});
  return location;
};

/**
 * Function to calculate the distance between the current position and a given location
 * @param {Object} targetLocation - The target location with latitude and longitude
 * @returns {Promise<Number>} - The distance in meters
 */
const CalculateDistance = async (targetLocation: { latitude: number; longitude: number }) => {
  try {
    const currentLocation = await getCurrentLocation();
    const distance = getDistance(
      { latitude: currentLocation.coords.latitude, longitude: currentLocation.coords.longitude },
      { latitude: targetLocation.latitude, longitude: targetLocation.longitude }
    );
    return distance;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export { CalculateDistance };
