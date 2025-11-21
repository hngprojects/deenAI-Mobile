import { Stack } from "expo-router";
import React from "react";

const HadithCollectionLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="hadiths" options={{ title: "Hadiths Collection" }} />
      <Stack.Screen
        name="(id)/hadith-categories"
        options={{ title: "Sahih Muslim" }}
      />
      <Stack.Screen name="(id)/revelation" options={{ title: "Revelation" }} />
    </Stack>
  );
};

export default HadithCollectionLayout;
