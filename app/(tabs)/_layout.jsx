import { View, Text, Image } from 'react-native';
import { Tabs, Redirect } from 'expo-router';

import { icons } from '../../constants';


const TabIcon = ({ icon, color, name, focused }) =>{
    return (
        <View className="items-center justify-center gap-2">
            <Image
                source={icon}
                resizeMode="contain"
                tintColor={color}
                className="w-6 h-6"
            />
            <Text className={`${focused ? 'font-psemibold' : 'font-pregular'} text-xs`} style={{ color: color }}>
                {name}
            </Text>
        </View>
    )
}

const TabsLayout = () => {
    return(
        <>
            <Tabs
                screenOptions={{
                    tabBarShowLabel: false,
                    tabBarActiveTintColor:'#FFA001',
                    tabBarInactiveTintColor: '#CDCDE0',
                    tabBarStyle:{
                        backgroundColor:'#161622',
                        borderTopWidth:1,
                        borderTopColor:'#232533',
                        height:84,
                    }
                }}
            >
                <Tabs.Screen
                name="index"
                options={{
                    title: "Home",
                    headerShown:false,
                    tabBarIcon:({color, focused }) => (
                        <TabIcon 
                        icon={icons.home}
                        color={color}
                        name="Home"
                        focused={focused}
                        />
                    )
                }}
                />

            <Tabs.Screen
                name="History"
                options={{
                    title: "History",
                    headerShown:false,
                    tabBarIcon:({color, focused }) => (
                        <TabIcon 
                        icon={icons.bookmark}
                        color={color}
                        name="History"
                        focused={focused}
                        />
                    )
                }}
                />

            <Tabs.Screen
                name="Camp"
                options={{
                    title: "Camp",
                    headerShown:false,
                    tabBarIcon:({color, focused }) => (
                        <TabIcon 
                        icon={icons.plus}
                        color={color}
                        name="Camp"
                        focused={focused}
                        />
                    )
                }}
                />
            <Tabs.Screen
                name="Centre"
                options={{
                    title: "Centre",
                    headerShown:false,
                    tabBarIcon:({color, focused }) => (
                        <TabIcon 
                        icon={icons.profile}
                        color={color}
                        name="Centre"
                        focused={focused}
                        />
                    )
                }}
                />

<Tabs.Screen
                name="Request"
                options={{
                    title: "Profile",
                    headerShown:false,
                    tabBarIcon:({color, focused }) => (
                        <TabIcon 
                        icon={icons.profile1}
                        color={color}
                        name="Profile"
                        focused={focused}
                        />
                    )
                }}
                />

<Tabs.Screen
                name="Location"
                options={{
                    title: "Location",
                    headerShown:false,
                    tabBarIcon:({color, focused }) => (
                        <TabIcon 
                        icon={icons.location}
                        color={color}
                        name="Location"
                        focused={focused}
                        />
                    )
                }}
                />

            </Tabs>
        </>
    )
}

export default TabsLayout