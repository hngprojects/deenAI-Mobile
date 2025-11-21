import { router } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, Text, View, Pressable } from "react-native";

const categories = [
  { id: 1, title: "Revelation", range: "1-7" },
  { id: 2, title: "Belief", range: "8-85" },
  { id: 3, title: "Knowledge", range: "59-134" },
  { id: 4, title: "Ablution (Wudu’)", range: "135-248" },
  { id: 5, title: "Bathing (Ghusl)", range: "249-293" },
  { id: 6, title: "Menstrual Periods", range: "294-330" },
  { id: 7, title: "Prayers (Solat)", range: "331-345" },
  { id: 8, title: "Menstrual Periods", range: "346-512" },
  { id: 9, title: "Times of the prayers", range: "513-590" },
  { id: 10, title: "Call to Prayers", range: "591-856" },
  { id: 11, title: "Friday Prayer", range: "294-330" },
  { id: 12, title: "Menstrual Periods", range: "294-330" },
];

const HadithCategories = () => {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>List</Text>

      {categories.map((item) => (
        <Pressable
          key={item.id}
          style={styles.row}
          onPress={() => {
            if (item.title === "Revelation") {
              router.push("/revelation");
            }
          }}
        >
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{item.id}</Text>
          </View>

          <Text style={styles.title}>{item.title}</Text>

          <Text style={styles.range}>{item.range}</Text>
        </Pressable>
      ))}
    </ScrollView>
  );
};

export default HadithCategories;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 20,
    backgroundColor: "#f7f7f7",
    flex: 1,
  },
  header: {
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 20,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 12,
    marginBottom: 10,
  },
  badge: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "#F1F1F1",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  badgeText: {
    fontWeight: "600",
    fontSize: 15,
  },
  title: {
    flex: 1,
    fontSize: 15,
    color: "#222",
  },
  range: {
    fontSize: 14,
    color: "#777",
    fontWeight: "500",
  },
});
