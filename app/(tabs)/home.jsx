import { StatusBar } from 'expo-status-bar';
import { ScrollView, View, Text, Image, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { images } from '../../constants';
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../providers/AuthProvider";

const SignUp = () => {
  const [donations, setDonations] = useState(0);
  const [livesSaved, setLivesSaved] = useState(0);
  const [totalBlood, setTotalBlood] = useState(0); // in ml
  const [lastDonationDate, setLastDonationDate] = useState(null);
  const [nextDonationDate, setNextDonationDate] = useState(null);
  const [progress, setProgress] = useState(0); // Progress percentage
  const { session } = useAuth();

  useEffect(() => {
    const fetchDonationData = async () => {
      // Fetch donation data
      const { data: donationData, error: donationError } = await supabase
        .from('donor_donations')
        .select('no_of_bottles')
        .eq('donor_id', session.user.id);
  
      if (donationError) {
        Alert.alert('Error fetching donations', donationError.message);
        return;
      }
  
      const totalBottles = donationData.reduce((sum, donation) => sum + donation.no_of_bottles, 0);
      setDonations(totalBottles);
      const totalBloodAmount = totalBottles * 200; // Each bottle is 200 ml
      setTotalBlood(totalBloodAmount);
      setLivesSaved(Math.floor(totalBloodAmount / 300)); // Each life saved is 300 ml
  
      // Fetch last donation date
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('last_donation_date')
        .eq('id', session.user.id)
        .single();
  
    
  
      if (profileData?.last_donation_date) {
        const lastDate = new Date(profileData.last_donation_date);
        setLastDonationDate(lastDate);
  
        const nextDate = new Date(lastDate);
        nextDate.setDate(nextDate.getDate() + 100);
        setNextDonationDate(nextDate);
  
        const today = new Date();
        const daysSinceLastDonation = Math.max(0, (today - lastDate) / (1000 * 60 * 60 * 24));
        const progressPercentage = Math.min(100, (daysSinceLastDonation / 100) * 100);
        setProgress(progressPercentage);
      } else {
        // No donations provided
        setLastDonationDate(null);
        setNextDonationDate(null);
        setProgress(0);
      }
    };
  
    fetchDonationData();
  }, []);
  
  return (
    <LinearGradient
      colors={['#FFFFFF', '#FD0000', '#FFFFFF', '#FD0000', '#FFFFFF', '#FFFFFF']}
      locations={[0.4, 0.8, 1, 0.2, 0.3, 0.5]}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ height: '100%' }}>
          <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center', minHeight: '85vh', paddingHorizontal: 16 }}>
            <View style={{ width: '100%', justifyContent: 'center', minHeight: '8vh', paddingHorizontal: 16, marginVertical: 24 }}>
              <View style={{ position: 'relative', marginTop: 20 }}>
                <Text style={{ fontSize: 36, fontWeight: 'bold', textAlign: 'left', color: '#FFFFFF' }}>
                  <Text style={{ color: '#FD0000' }}>Blood KING</Text>
                </Text>
                <Image
                  source={images.curve}
                  style={{ width: 350, height: 20, position: 'absolute', bottom: -8, right: -0.5 }}
                  resizeMode="contain"
                />
              </View>
              <Text style={{ fontSize: 18, fontWeight: '800', textAlign: 'left', color: '#111111', marginTop: 20 }}>
                Welcome RV6 !!!
              </Text>
              <Image source={images.logo} style={{ maxWidth: 380, width: '100%', height: 180 }} resizeMode="contain" />
              <View style={{ backgroundColor: '#ffecec', padding: 20, borderRadius: 20, alignItems: 'center', width: '100%' }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-around', width: '100%', marginVertical: 15 }}>
                  <View style={{ alignItems: 'center' }}>
                    <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#ff0000' }}>{livesSaved}</Text>
                    <Text style={{ fontSize: 16, textAlign: 'center' }}>lives saved</Text>
                  </View>
                  <View style={{ alignItems: 'center' }}>
                    <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#ff0000' }}>{totalBlood}ml</Text>
                    <Text style={{ fontSize: 16, textAlign: 'center' }}>of blood</Text>
                  </View>
                  <View style={{ alignItems: 'center' }}>
                    <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#ff0000' }}>{donations}</Text>
                    <Text style={{ fontSize: 16, textAlign: 'center' }}>donations</Text>
                  </View>
                </View>
              </View>
              <View style={{ alignItems: 'center', marginVertical: 20, padding: 20, borderRadius: 30, backgroundColor: '#ffecec', width: '100%' }}>
  <Text style={{ fontSize: 20 }}>Next Donation</Text>
  
  {lastDonationDate ? (
    <>
      <Text style={{ fontSize: 18, fontWeight: 'bold', marginVertical: 10 }}>
        {nextDonationDate.toLocaleDateString()}
      </Text>
      <View
        style={{
          width: '100%',
          height: 20,
          backgroundColor: '#ddd',
          borderRadius: 10,
          overflow: 'hidden',
          marginVertical: 10,
        }}
      >
        <View
          style={{
            width: `${progress}%`,
            height: '100%',
            backgroundColor: '#ff0000',
          }}
        />
      </View>
      <Text style={{ fontSize: 16 }}>
        {Math.max(0, Math.ceil((nextDonationDate - new Date()) / (1000 * 60 * 60 * 24)))} days
      </Text>
    </>
  ) : (
    <Text style={{ fontSize: 18, fontWeight: 'bold', marginVertical: 10 }}>
      No donations provided
    </Text>
  )}
</View>

            </View>
          </View>
        </ScrollView>
        <StatusBar backgroundColor="#FFFFFF" style="dark" />
      </SafeAreaView>
    </LinearGradient>
  );
};

export default SignUp;
