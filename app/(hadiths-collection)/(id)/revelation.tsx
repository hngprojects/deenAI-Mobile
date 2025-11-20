import { View, Text, ScrollView } from "react-native";
import React from "react";

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
          (1) Chapter: How the Divine Revelation started being revealed to
          Allah's Messenger
        </Text>

        <Text
          style={{
            textAlign: "right",
            fontSize: 20,
            lineHeight: 32,
            color: "#2c2c2c",
          }}
        >
          وَالَّذِينَ يُؤْمِنُونَ بِمَا أُنْزِلَ إِلَيْكَ وَمَا أُنْزِلَ مِنْ
          قَبْلِكَ وَبِالْآخِرَةِ هُمْ يُوقِنُونَ
        </Text>
      </View>

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
        <Text style={{ fontSize: 14, color: "#333" }}>1</Text>
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
        حَدَّثَنَا الْحُمَيْدِيُّ عَبْدُ اللَّهِ بْنُ الزُّبَيْرِ، قَالَ‏:‏
        حَدَّثَنَا سُفْيَانُ، قَالَ‏:‏ - حَدَّثَنَا يَحْيَى بْنُ سَعِيدٍ
        الأَنْصَارِيُّ، قَالَ‏:‏ أَخْبَرَنِي مُحَمَّدُ بْنُ إِبْرَاهِيمَ
        التَّيْمِيُّ، أَنَّهُ سَمِعَ عَلْقَمَةَ بْنَ وَقَّاصٍ اللَّيْثِيَّ،
        يَقُولُ‏:‏ سَمِعْتُ عُمَرَ بْنَ الْخَطَّابِ ـ رَضِيَ اللَّهُ عَنْهُ ـ
        عَلَى الْمِنْبَرِ، قَالَ‏:‏ سَمِعْتُ رَسُولَ اللَّهِ صلى الله عليه وسلم
        يَقُولُ‏:‏ ‏"‏ إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ، وَإِنَّمَا لِكُلِّ
        امْرِئٍ مَا نَوَى، فَمَنْ كَانَتْ هِجْرَتُهُ إِلَى اللَّهِ وَرَسُولِهِ،
        فَهِجْرَتُهُ إِلَى اللَّهِ وَرَسُولِهِ، وَمَنْ كَانَتْ هِجْرَتُهُ
        لِدُنْيَا يُصِيبُهَا، أَوِ امْرَأَةٍ يَتَزَوَّجُهَا، فَهِجْرَتُهُ إِلَى
        مَا هَاجَرَ إِلَيْهِ ‏"‏‏.‏
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
        Narrated 'Umar bin Al-Khattab:
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
        I heard Allah's Messenger (ﷺ) saying, "The reward of deeds depends upon
        the intentions and every person will get the reward according to what he
        has intended. So whoever emigrated for worldly benefits or for a woman
        to marry, his emigration was for what he emigrated for."
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
    </ScrollView>
  );
};

export default RevelationSahihMuslim;
