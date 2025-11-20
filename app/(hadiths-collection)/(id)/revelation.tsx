import { View, Text, ScrollView } from "react-native";
import React from "react";
import hadithData from "./hadith.json";

const RevelationSahihMuslim = () => {
  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#F7F6F3" }}
      contentContainerStyle={{ padding: 16, paddingBottom: 80 }}
    >
      {/* Top Card */}
      <View
        style={{
          backgroundColor: "white",
          borderRadius: 12,
          padding: 16,
          elevation: 1,
          shadowColor: "#000",
          shadowOpacity: 0.1,
          shadowRadius: 3,
          marginBottom: 16,
        }}
      >
        <Text
          style={{
            fontSize: 16,
            fontWeight: "600",
            marginBottom: 8,
            color: "#3A3A3A",
          }}
        >
          ({hadithData.chapter.number}) Chapter: {hadithData.chapter.title}
        </Text>

        <Text
          style={{
            textAlign: "right",
            fontSize: 20,
            lineHeight: 32,
            color: "#2c2c2c",
          }}
        >
          {hadithData.verses.arabic.join(" ")}
        </Text>
      </View>

      {/* Map through hadiths */}
      {[hadithData.hadith].map((hadith: any, index: number) => (
        <View key={index}>
          {/* Hadith Number */}
          <View
            style={{
              backgroundColor: "white",
              borderRadius: 8,
              paddingVertical: 4,
              paddingHorizontal: 10,
              alignSelf: "flex-start",
              marginBottom: 16,
            }}
          >
            <Text style={{ fontSize: 14, color: "#333" }}>{hadith.number}</Text>
          </View>

          {/* Arabic Hadith */}
          <Text
            style={{
              textAlign: "right",
              fontSize: 22,
              lineHeight: 38,
              color: "#1f1f1f",
              marginBottom: 20,
            }}
          >
            {hadith.text.arabic}
          </Text>

          {/* Narration Label */}
          <Text
            style={{
              fontWeight: "600",
              fontSize: 16,
              color: "#3A3A3A",
              marginBottom: 10,
            }}
          >
            {hadith.narrator_attribution}:
          </Text>

          {/* English Translation */}
          <Text
            style={{
              fontSize: 16,
              lineHeight: 28,
              color: "#4A4A4A",
              marginBottom: 40,
            }}
          >
            {hadith.text.english}
          </Text>

          {/* Bottom Icons */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-evenly",
              marginBottom: 30,
            }}
          >
            <View
              style={{
                width: 40,
                height: 40,
                borderWidth: 1,
                borderColor: "#ddd",
                borderRadius: 8,
              }}
            />
            <View
              style={{
                width: 40,
                height: 40,
                borderWidth: 1,
                borderColor: "#ddd",
                borderRadius: 8,
              }}
            />
            <View
              style={{
                width: 40,
                height: 40,
                borderWidth: 1,
                borderColor: "#ddd",
                borderRadius: 8,
              }}
            />
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

export default RevelationSahihMuslim;
