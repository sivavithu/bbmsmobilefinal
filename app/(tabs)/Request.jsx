import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Image,
  Text,
  SafeAreaView,
  Pressable,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { supabase } from "../../lib/supabase"; // Adjust the path as necessary

const profile = require("../../assets/images/pic.png");
const logout = require("../../assets/icons/logout.png");
const notification = require("../../assets/icons/notification.png");

const Request = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error("Error fetching session:", error.message);
          Alert.alert("Error", "Could not retrieve session.");
          return;
        }
        if (session?.user) {
          setUser(session.user); // Set the user if the session exists
        } else {
          console.error("No active session found.");
          Alert.alert("Error", "No active session found. Please log in.");
          router.replace("/(auth)/sign-in");
        }
      } catch (err) {
        console.error("Unexpected error fetching session:", err.message);
      }
    };

    fetchSession();
  }, [router]);

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Logout error:", error.message);
        Alert.alert("Error", "Logout failed. Please try again.");
      } else {
        router.replace("/(auth)/sign-in"); // Navigate to sign-in screen after logout
      }
    } catch (err) {
      console.error("Unexpected error during logout:", err.message);
    }
  };

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#FFFFFF", "#FFFFFF", "#E40000"]}
        locations={[0.3, 0.7, 1]}
        style={{ flex: 1 }}
      >
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.topSection}>
            <View style={styles.propicArea}>
              <Image source={profile} style={styles.propic} />
            </View>
            <Text style={styles.name}>{user.email || "User"}</Text>
          </View>

          <View style={styles.buttonList}>
            {/* Notifications Button */}
            <Pressable
              style={styles.buttonSection}
              onPress={() => router.push("/Notifications")} // Adjust the path as necessary
            >
              <View style={styles.buttonArea}>
                <View style={styles.iconArea}>
                  <Image
                    source={notification}
                    style={styles.iconStyle}
                    resizeMode="contain"
                  />
                </View>
                <Text style={styles.buttonName}>Notifications</Text>
              </View>
              <View style={styles.sp}></View>
            </Pressable>

            {/* Logout Button */}
            <Pressable
              style={styles.buttonSection}
              onPress={handleLogout} // Call handleLogout directly
            >
              <View style={styles.buttonArea}>
                <View style={styles.iconArea}>
                  <Image
                    source={logout}
                    style={styles.iconStyle}
                    resizeMode="contain"
                  />
                </View>
                <Text style={styles.buttonName}>Logout</Text>
              </View>
            </Pressable>
          </View>
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
};

export default Request;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center",
  },
  safeArea: {
    flex: 1,
  },
  topSection: {
    height: 300,
    justifyContent: "center",
    alignItems: "center",
    margin: 50,
  },
  propicArea: {
    width: 170,
    height: 170,
    borderRadius: 100,
    borderWidth: 4,
    borderColor: "#FFBB3B",
  },
  propic: {
    width: "100%",
    height: "100%",
  },
  name: {
    marginTop: 20,
    color: "black",
    fontSize: 32,
  },
  buttonList: {
    marginTop: 20,
  },
  buttonSection: {
    paddingTop: 10,
    paddingBottom: 5,
    paddingLeft: 25,
    paddingRight: 25,
  },
  buttonArea: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  iconArea: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  iconStyle: {
    width: 25,
    height: 25,
  },
  buttonName: {
    width: 300,
    fontSize: 20,
    color: "black",
    marginLeft: 20,
  },
  sp: {
    width: 400,
    marginTop: 10,
    height: 1,
    backgroundColor: "#FFFFFF45",
  },
  loadingText: {
    fontSize: 18,
    color: "white",
  },
});
