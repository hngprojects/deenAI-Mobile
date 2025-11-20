"use client";
import ScreenContainer from "@/components/ScreenContainer";
import TodaysReflection from "@/components/home/TodaysReflection";
import React from "react";

export default function SavedReflectionsPage() {
  const savedReflections = [
    {
      id: 1,
      verse: "Indeed, with hardship comes ease.",
      reference: "Surah Ash-Sharh (94:6)",
      text: "This verse reminds me that Allah's mercy always follows struggle...",
      date: "Nov 2, 2025",
    },
    {
      id: 2,
      verse: "And when My servants ask you concerning Me. indeed i am near..",
      reference: "Surah Al-Baqarah (2:186)",
      text: "it’s comforting to know that Allah is always near, even in my quiet moments.",
      date: "Nov 2, 2025",
    },
    {
      id: 3,
      verse: "Indeed, with hardship comes ease.",
      reference: "Surah Ash-Sharh (94:6)",
      text: "This verse reminds me that Allah’s mercy always follows struggle. Even in my quietest moments of doubt, I know ease is already written, I just need patience to see it unfold.",
      date: "Nov 2, 2025",
    },
  ];


  return (
    <ScreenContainer>
      {savedReflections.map((reflection, index) => (
        <TodaysReflection
          key={reflection.id}
          verse={reflection.verse}
          reference={reflection.reference}
          text={reflection.text}
          date={reflection.date}
          style={{  }}
        />
      ))}
    </ScreenContainer>
  );
}
