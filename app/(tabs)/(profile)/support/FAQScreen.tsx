import { theme } from '@/styles/theme';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ScreenContainer from '@/components/ScreenContainer';
import ScreenHeader from '@/components/screenHeader';
import { useRouter } from 'expo-router';
import ScreenTitle from '@/components/ScreenTitle';

export default function FAQScreen() {
  const router = useRouter();

  interface FAQItem {
    title: string;
    route?: any;
  }

  const faqList: FAQItem[] = [
    { title: "Is the Deen AI free to use?", route: '/(tabs)/(profile)/support/FAQPrivacyScreen'},
    { title: "Is Deen AI a fatwa-issuing tool?", route: '/(tabs)/(profile)/support/FAQPrivacyScreen'},
    { title: "Is my data private?", route: '/(tabs)/(profile)/support/FAQPrivacyScreen'},
    { title: "What is Deen AI?", route: '/(tabs)/(profile)/support/FAQPrivacyScreen'},
    { title: "What sources does Deen AI use?", route: '/(tabs)/(profile)/support/FAQPrivacyScreen'}
  ];

  return (
    <ScreenContainer backgroundColor={theme.color.background3}>
      <ScreenHeader title="Frequently Asked Questions" onBackPress={() => router.push('/(tabs)/(profile)/ProfileScreen')}/>

      <View style={styles.list}>
        {faqList.map((item, index) => (
          <TouchableOpacity 
            key={index} 
            style={styles.item}
            onPress={() => router.push({
              pathname: item.route,
              params: { question: item.title } // Pass the question as parameter
            })}
          >
            <Text style={styles.title}>{item.title}</Text>
            <Image
              source={require('@/assets/images/arrow-right.png')}
              style={styles.arrow}
              resizeMode='contain'
            />
          </TouchableOpacity>
        ))}
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.color.background },
  list: { marginTop: 20, paddingHorizontal: 16 },
  item: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: '#F4F4F4',
    borderRadius: 12,
    marginBottom: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#C7C5CC'
  },
  title: {
    fontSize: 15,
    color: theme.color.secondary,
    fontFamily: theme.font.regular
  },
  arrow: {
    width: 20,
    height: 20,
  },
});