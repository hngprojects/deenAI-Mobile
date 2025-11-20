import React from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useRouter } from "expo-router";
import Bukhari from "../../assets/images/bukhari.png";
import Dawud from "../../assets/images/dawud.png";
import Muslim from "../../assets/images/muslim.png";
import Tirmidhi from "../../assets/images/tirmidhi.png";

const hadithBooks = [
  {
    title: "Sahih Muslim",
    image: Muslim,
    description:
      "Sahih Muslim is a collection of hadith compiled by Imam muslim ibn al-Hajjaj al-Naysaburi (rahimahullah). His collection is considered considered to be one of the most authentic collections of the sunnah of the prophet. (SAW)",
  },
  {
    title: "Sahih al-Bukhari",
    image: Bukhari,
    description:
      "Sahih Muslim is a collection of hadith compiled by Imam muslim ibn al-Hajjaj al-Naysaburi (rahimahullah). His collection is considered considered to be one of the most authentic collections of the sunnah of the prophet. (SAW)",
  },
  {
    title: "Sunan Abi Dawud",
    image: Dawud,
    description:
      "Sahih Muslim is a collection of hadith compiled by Imam muslim ibn al-Hajjaj al-Naysaburi (rahimahullah). His collection is considered considered to be one of the most authentic collections of the sunnah of the prophet. (SAW)",
  },
  {
    title: "Jami' at-Tirmidhi",
    image: Tirmidhi,
    description:
      "Sahih Muslim is a collection of hadith compiled by Imam muslim ibn al-Hajjaj al-Naysaburi (rahimahullah). His collection is considered considered to be one of the most authentic collections of the sunnah of the prophet. (SAW)",
  },
];

const HadithsCollections = () => {
  const router = useRouter();

  const handleCardPress = (bookTitle) => {
    // 💡 Use router.push() with a query string to pass the title.
    // The bookTitle will be available as a route parameter on the child page.
    router.push(`/hadith-categories?title=${bookTitle}`);
  };
  return (
    <ScrollView style={styles.container}>
      {hadithBooks.map((book, index) => (
        <TouchableOpacity
          key={index}
          style={styles.card}
          onPress={handleCardPress}
          activeOpacity={0.7}
        >
          <Image source={book.image} style={styles.image} />

          <View style={styles.textContainer}>
            <Text style={styles.title}>{book.title}</Text>
            <Text style={styles.description}>{book.description}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

export default HadithsCollections;

const styles = StyleSheet.create({
  container: {
    padding: 12,
    backgroundColor: "#f2f2f2",
  },
  card: {
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    elevation: 3,
  },
  image: {
    width: 70,
    height: 100,
    borderRadius: 6,
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 17,
    fontWeight: "bold",
    marginBottom: 4,
  },
  description: {
    fontSize: 13,
    color: "#555",
  },
});
