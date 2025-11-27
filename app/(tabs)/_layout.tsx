import CustomTabBar from "@/components/CustomTabBar";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Tabs } from "expo-router";
import React from "react";
import { Image } from "react-native";

export default function TabLayout() {
  return (
    <ProtectedRoute requireAuth={false}>
      <Tabs
        tabBar={(props) => <CustomTabBar {...props} />}
        screenOptions={{
          headerShown: false,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarIcon: ({ color, focused }) => (
              <Image
                source={require("../../assets/images/home-icon.png")}
                style={{ width: 24, height: 24, tintColor: color }}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="(quran)"
          options={{
            title: "Quran",
            tabBarIcon: ({ color, focused }) => (
              <Image
                source={require("../../assets/images/quran-icon.png")}
                style={{ width: 28, height: 24, tintColor: color }}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="(reflect)"
          options={{
            title: "Reflection",
            tabBarIcon: ({ color, focused }) => (
              <Image
                source={require("../../assets/images/reflection-icon.png")}
                style={{ width: 24, height: 24, tintColor: color }}
              />
            ),
          }}
          listeners={({ navigation }) => ({
            tabPress: (e) => {
              // When reflect tab is pressed, navigate to index (main reflect screen)
              navigation.navigate("(reflect)", {
                screen: "index",
              });
            },
          })}
        />
        <Tabs.Screen
          name="(profile)"
          options={{
            title: "Profile",
            tabBarIcon: ({ color, focused }) => (
              <Image
                source={require("../../assets/images/profile-icon.png")}
                style={{ width: 24, height: 24, tintColor: color }}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="(hadith)"
          options={{
            href: null,
          }}
        />
        <Tabs.Screen
          name="(tasbih)"
          options={{
            href: null,
          }}
        />
        <Tabs.Screen
          name="(prayer-times)"
          options={{
            href: null,
          }}
        />
        <Tabs.Screen
          name="(profile)/edit"
          options={{
            href: null,
          }}
        />
      </Tabs>
    </ProtectedRoute>
  );
}
