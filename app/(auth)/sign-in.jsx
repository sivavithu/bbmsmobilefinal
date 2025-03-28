import { StatusBar } from 'expo-status-bar';
import { ScrollView, View, Text, Image, Alert } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { images } from '../../constants';
import FormField from '../../components/FormField';
import CustomButton from '../../components/CustomButton';
import { LinearGradient } from 'expo-linear-gradient';
import {supabase} from '../../lib/supabase';
import { Redirect } from 'expo-router';  // Import Redirect

const SignIn = () => {
  const [form, setForm] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [redirect, setRedirect] = useState(false); // Track redirect state

  const submit = async () => {
    const { email, password } = form; // Extract email and password from form
    setLoading(true); // Show loading state during request

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        Alert.alert('Sign In Failed', error.message);
      } else {
        setRedirect(true); // Set redirect to true on successful sign-in
      }
    } catch (err) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  // If redirect is true, navigate to the dashboard
 

  return (
    <LinearGradient
      colors={['#FFFFFF', '#E40000', '#FFFFFF', '#E40000', '#FFFFFF', '#FFFFFF']}
      locations={[0.4, 0.8, 1, 0.2, 0.3, 0.5]}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View
            style={{
              width: '100%',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: '85vh',
              paddingHorizontal: 16,
            }}
          >
            <View
              style={{
                width: '100%',
                justifyContent: 'center',
                minHeight: '8vh',
                paddingHorizontal: 16,
                marginVertical: 24,
              }}
            >
              <View style={{ position: 'relative', marginTop: 20 }}>
                <Text style={{ fontSize: 36, fontWeight: 'bold', textAlign: 'center', color: '#FFFFFF' }}>
                  <Text style={{ color: '#E40000' }}>Blood KING</Text>
                </Text>
                <Image
                  source={images.path}
                  style={{ width: 180, height: 15, position: 'absolute', bottom: -8, right: -0.5 }}
                  resizeMode="contain"
                />
              </View>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: '600',
                  fontStyle: 'italic', 
                  textAlign: 'center',
                  color: '#111111',
                  marginTop: 20,
                }}
              >
                "Tears of a mother cannot save her Child. But your Blood can."
              </Text>
              <Image
                source={images.cards}
                style={{ maxWidth: 380, width: '100%', height: 180 }}
                resizeMode="contain"
              />
              <FormField
                title="Email"
                value={form.email}
                handleChangeText={(e) => setForm({ ...form, email: e })}
                otherStyles={{ marginTop: 20 }}
                keyboardType="email-address"
              />
              <FormField
                title="Password"
                value={form.password}
                handleChangeText={(e) => setForm({ ...form, password: e })}
                otherStyles={{ marginTop: 20 }}
                secureTextEntry // Hides password input
              />
              <CustomButton
                title={loading ? 'Signing In...' : 'Sign In'}
                handlePress={submit}
                containerStyles={{ marginTop: 30 }}
                disabled={loading} // Disables button during submission
              />
            </View>
          </View>
        </ScrollView>
        <StatusBar backgroundColor="#FFFFFF" style="dark" />
      </SafeAreaView>
    </LinearGradient>
  );
};

export default SignIn;
