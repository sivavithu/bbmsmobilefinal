import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  // Button,
  // FlatList,
  // TextInput,
  Pressable,
  Alert,
  // Dimensions,
} from "react-native";
import * as gps from "expo-location";
import MapView, { Marker } from "react-native-maps";
import { supabase } from "@/lib/supabase";
import { CalculateDistance } from "@/components/CalculateDistance";

// Function to request permissions and fetch location
async function requestLocationPermission() {
  try {
    const { status } = await gps.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      alert("Permission to access location was denied.");
      return null;
    }

    const location = await gps.getCurrentPositionAsync({});
    return location;
  } catch (error) {
    alert(`Error fetching location: ${error}`);
    return null;
  }
}

// Function to fetch nearby users
async function findNearbyUsers(latitude: number, longitude: number) {
  try {
    const { data, error } = await supabase.rpc("get_radial_camps", {
      lat: latitude,
      lon: longitude,
      radius_km: 10,
    });
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error fetching nearby users:", error);
    return [];
  }
}

async function retireveCamps() {
  try {
    const { data, error } = await supabase.rpc("get_camps");
    if (error) throw error;
    console.log(data);
    return data;
  } catch (error) {
    console.error("Error fetching nearby users:", error);
    return [];
  }
}

export default function Location() {
  // Use States to store location and nearby users
  const [location, setLocation] = useState<gps.LocationObject | null>(null);
  const [nearbyUsers, setNearbyUsers] = useState<
    {
      camp_id: string;
      camp_name: string;
      latitude: number;
      longitude: number;
      // distance: number;
      blood_type: number;
    }[]
  >([]);
  const [region, setRegion] = useState({
    latitude: 9.6615,
    longitude: 80.0255,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const renderMarkers = () =>
    nearbyUsers.map((user: any) => (
      <Marker
        key={user.camp_id}
        coordinate={{
          latitude: user.latitude,
          longitude: user.longitude,
        }}
        title={user.camp_name}
        pinColor={user.blood_type === 0 ? "green" : "red"}
        description={
          user.blood_type === 0 ? "Blood Camp" : "Hero Spot" + user.blood_type
        }
        // description={`Distance: ${user.distance.toFixed(2)} km`}
      />
    ));

  // Fetch Nearby Users
  const fetchNearbyUsers = async () => {
    if (location) {
      const { latitude, longitude } = location.coords;
      const users = await findNearbyUsers(latitude, longitude);
      setNearbyUsers(users);
    }
  };

  const fetchCamps = async () => {
    const users = await retireveCamps();
    setNearbyUsers(users);
  };

  // Init func
  useEffect(() => {
    (async () => {
      const loc = await requestLocationPermission();
      if (loc) {
        // Debuging
        // console.log("Location fetched:", loc); //Debugging
        let longitude: number = loc.coords.longitude;
        let latitude: number = loc.coords.latitude;
        alert(`POINT(${longitude} ${latitude})`);
        setLocation(loc);
      }
    })();
  }, []);

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: location?.coords.latitude || 37.78825,
          longitude: location?.coords.longitude || -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        showsUserLocation
      >
        {renderMarkers()}
      </MapView>

      {/* <TextInput
        style={styles.searchBox}
        placeholder="Search location"
        value={"searchText"}
        // onChangeText={(text) => setSearchText(text)}
      /> */}

      <Pressable style={styles.button} onPress={fetchCamps}>
        <Text style={styles.buttonText}>Hero Spot Finder</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    //flex: 1,
    position: "absolute",
    top: 50,
    left: 20,
    right: 20,
    bottom: 150,
  },

  searchBox: {
    position: "absolute",
    bottom: 90,
    left: "10%",
    right: "10%",
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 20,
    paddingLeft: 15,
    backgroundColor: "#fff",
    fontSize: 16,
  },
  button: {
    position: "absolute",
    bottom: 30,
    left: "10%",
    right: "10%",
    padding: 15,
    backgroundColor: "#FD0000",
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
