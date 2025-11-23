import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { router } from 'expo-router';
import ScreenHeader from '../../../../components/screenHeader';

export default function FAQScreen() {

interface FAQItem {
  title: string;
  route?: any;
}

const faqList: FAQItem[] = [
  { title: "How secure is my data?", route: '/(tabs)/(profile)/support/FAQPrivacyScreen'},
  { title: "How do i set prayer reminder", route: '/(tabs)/(profile)/support/FAQPrivacyScreen'},
  { title: "Is NoorAI free to use?", route: '/(tabs)/(profile)/support/FAQPrivacyScreen'},
  { title: "What is NoorAI?", route: '/(tabs)/(profile)/support/FAQPrivacyScreen'},
  { title: "How do i contact the team?", route: '/(tabs)/(profile)/support/FAQPrivacyScreen' }
];

  return (
    <View style={styles.container}>
      <ScreenHeader title="Frequently Asked Questions" />

      {faqList.map((item, index) => (
        <TouchableOpacity 
          key={index} 
          style={styles.faqItem}
          onPress={() => item.route && router.push(item?.route)}
        >
          <Text style={styles.faqText}>{item.title}</Text>
          <Image 
            source={require('@/assets/images/arrow-right.png')}
            style={styles.arrowIcon}
          />
        </TouchableOpacity>
      ))}

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white'
  },

  faqItem: {
    paddingVertical: 16,
    paddingHorizontal: 15,
    borderRadius: 10,
    backgroundColor: "#F5F5F5",
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },

  faqText: {
    fontSize: 16,
    fontWeight: '500'
  },

  arrowIcon: {
    width: 20,
    height: 20,
    tintColor: "#999"
  }
});
