import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  Button,
  FlatList,
  Dimensions,
} from "react-native";
import * as Location from "expo-location";
import MapView, { Marker } from "react-native-maps";
import { supabase } from "@/lib/supabase";

// Function to request permissions and fetch location
async function requestLocationPermission() {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      alert("Permission to access location was denied.");
      return null;
    }

    const location = await Location.getCurrentPositionAsync({});
    return location;
  } catch (error) {
    alert(`Error fetching location: ${error}`);
    return null;
  }
}

// Function to fetch nearby users
async function findNearbyUsers(latitude: number, longitude: number) {
  try {
    const { data, error } = await Supabase.rpc("get_nearby_users", {
      lat: latitude,
      lon: longitude,
      radius_km: 5,
    });
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error fetching nearby users:", error);
    return [];
  }
}

// Reuqest Support
async function requestSupport(location: Location.LocationObject | null) {
    if (location) {
        try {
            const { latitude, longitude } = location.coords;
            const { data, error } = await Supabase.from("requests").insert([
                {
                    user_id: "592947bc-b68c-4ce6-be7e-5fecaddc643b",
                    description: "Emergency Support Needed",
                    location: `POINT(${longitude} ${latitude})`,
                    status: "pending",
                },
            ]);
            if (error) throw error;
            alert("Request sent successfully.");
        } catch (error) {
            console.error("Error sending request:", error);
        }
    } else {
        alert("Location is not available.");
    }
}

// Main
export default function FreeSpace() {
  // Use States to store location and nearby users
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );
  const [nearbyUsers, setNearbyUsers] = useState<
    {
      id: string;
      username: string;
      distance: number;
      latitude: number;
      longitude: number;
    }[]
  >([]);

  // Init func
  useEffect(() => {
    (async () => {
      const loc = await requestLocationPermission();
      if (loc) setLocation(loc);
    })();
  }, []);

  // Request Support
const requestSend = async () => {
    await requestSupport(location);
};

  // Fetch Nearby Users
  const fetchNearbyUsers = async () => {
    if (location) {
      const { latitude, longitude } = location.coords;
      const users = await findNearbyUsers(latitude, longitude);
      setNearbyUsers(users);
    }
  };

  // Render Nearby User for FlatList
  const renderNearbyUser = ({ item }: any) => (
    <View style={styles.row}>
      {/* <Text style={styles.cell}>{item.id}</Text> */}
      <Text style={styles.cell}>{item.username}</Text>
      <Text style={styles.cell}>{item.distance.toFixed(2)} km</Text>
    </View>
  );

  // Render Markers for MapView and flatlist
  const renderMarkers = () =>
    nearbyUsers.map((user: any) => (
      <Marker
        key={user.id}
        coordinate={{
          latitude: user.latitude,
          longitude: user.longitude,
        }}
        title={user.username}
        description={`Distance: ${user.distance.toFixed(2)} km`}
      />
    ));

  return (
    <>
      <View style={styles.container}>
        <Text style={styles.title}>Emergency Support Request App</Text>
        <Button title="Request Support" onPress={requestSend} />
        <Button title="Find Nearby Users" onPress={fetchNearbyUsers} />
        {/* Nearby Users List */}
        <FlatList
          data={nearbyUsers}
          renderItem={renderNearbyUser}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          style={styles.list}
        />
        {/* Map View */}
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
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 16,
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  cell: {
    // flex: 1,
    textAlign: "center",
    color: "#000",
    padding: 4,
  },
  mapContainer: {
    marginVertical: 16,
  },
  map: {
    width: Dimensions.get("window").width - 32,
    height: 350,
  },
  reactLogo: {
    height: 178,
    width: 290,
  },
  list: {
    width: "100%", // Ensures the list takes the full width
    maxHeight: "150%", // Limits height to make it scrollable (adjust as needed)
  },
  listContent: {
    paddingHorizontal: 16, // Adds horizontal padding
  },

});

// SQL Function
// -- CREATE OR REPLACE FUNCTION get_nearby_users (lat float, lon float, radius_km float)
// -- RETURNS TABLE (id uuid, username text, longitude float, latitude float,  distance float) AS $$
// -- BEGIN
// --   RETURN QUERY
// --   SELECT requests.id, users.username, st_x(requests.location::geometry) as longitude, st_y(requests.location::geometry) as latitude,
// --          ST_Distance(requests.location, ST_SetSRID(ST_MakePoint(lon, lat), 4326)) / 1000 AS distance
// --   FROM requests
// --   JOIN users ON requests.user_id = users.id
// --   WHERE ST_DWithin(requests.location, ST_SetSRID(ST_MakePoint(lon, lat), 4326), radius_km * 1000);
// -- END;
// -- $$ LANGUAGE plpgsql;

// Test
// select
//   *
// from
//   get_nearby_users (9.6640042, 80.0225871, 5.0);
