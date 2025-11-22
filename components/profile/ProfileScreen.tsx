// components/profile/ProfileScreen.tsx
import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
  ScrollView,
} from 'react-native';

import ScreenContainer from '../ScreenContainer';
// import { Feather as Icon } from '@expo/vector-icons';
import { theme } from '@/styles/theme';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

// type FeatherIconName = keyof typeof Icon.glyphMap;

interface Option {
  id: string;
  title: string;
  route?: string;
  iconKey: keyof typeof icons.left;
}

const icons = {
  left: {
    edit: require('../../assets/images/edit.png'),
    notifications: require('../../assets/images/notifications.png'),
    language: require('../../assets/images/language.png'),
    support: require('../../assets/images/support.png'),
    settings: require('../../assets/images/settings.png'),
    signout: require('../../assets/images/signout.png'),
    delete: require('../../assets/images/delete.png'),
  },
  right: require('../../assets/images/arrow-right.png'),
};

const profile = {
  avatar: require('../../assets/images/woman-in-hijab.png'),
  name: 'Aisha',
  greeting: 'Asalam alaykum Aisha,\nMay your days be filled with light.',

  options: [
    { id: '1', title: 'Edit Profile', route: '/profile/edit', iconKey: 'edit' },
    { id: '2', title: 'Notifications', route: '/profile/notification', iconKey: 'notifications' },
    { id: '3', title: 'Language', route: '/profile/language', iconKey: 'language' },
    { id: '4', title: 'Support', route: '/profile/support', iconKey: 'support' },
    { id: '5', title: 'Settings', route: '/settings', iconKey: 'settings' },
    { id: '6', title: 'Sign Out', route: '/profile/signout', iconKey: 'signout' },
    { id: '7', title: 'Delete Account', route: '/profile/delete', iconKey: 'delete' },
  ],
};

const ProfileScreen: React.FC = () => {
  const router = useRouter();

  const renderOption = ({ item }: { item: Option }) => (
    <TouchableOpacity
      style={styles.optionContainer}
      onPress={() => item.route && router.push(item.route)}
    >
      <View style={styles.leftIconWrapper}>
        <Image source={icons.left[item.iconKey]} style={styles.leftIconImage} />
      </View>

      <Text style={[styles.optionText, { color: theme.color.secondary }]}>
        {item.title}
      </Text>

      <View style={styles.rightArrowWrapper}>
        <Image
        source={icons.right}
        style={styles.arrowIconImage}
        resizeMode="contain"
        />
      </View>
    </TouchableOpacity>
  );

  return (
    <ScreenContainer backgroundColor={theme.color.background}>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <View style={styles.header}>
          <Image source={profile.avatar} style={styles.avatar} />

          <Text style={[styles.greeting, { color: theme.color.secondary }]}>
            {profile.greeting}
          </Text>

          <TouchableOpacity
            style={[styles.editButton, { backgroundColor: theme.color.brand }]}
            onPress={() => router.push('/profile/edit')}
          >
            <Text style={[styles.editButtonText, { color: theme.color.white }]}>
              Edit Profile
            </Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={profile.options}
          keyExtractor={(item) => item.id}
          renderItem={renderOption}
          scrollEnabled={false}
          contentContainerStyle={{ paddingHorizontal: 20, marginTop: 30 }}
        />

        <Image
        source={require("../../assets/images/NOOR NAV.png")}
        style={styles.navbarImage}
        resizeMode="cover"
        />

      </ScrollView>
    </ScreenContainer>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    marginTop: 20,
    paddingHorizontal: 20,
  },
  avatar: {
    width: width * 0.32,
    height: width * 0.32,
    borderRadius: (width * 0.32) / 2,
  },
  greeting: {
    fontSize: 18,
    marginTop: 20,
    textAlign: 'center',
    lineHeight: 26,
    fontWeight: '600',
  },
  editButton: {
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 25,
    marginTop: 15,
    elevation: 2,
  },
  editButtonText: {
    fontSize: 15,
    fontWeight: '600',
  },
  optionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
    borderBottomWidth: 0.6,
    borderColor: '#FFFFFF',
  },
  leftIconWrapper: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  leftIconImage: {
    width: 24,
    height: 24,
  },
  rightArrowWrapper: {
    marginLeft: 'auto',
    width: 26,
    height: 26,
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowIconImage: {
    width: 22,
    height: 22,
  },
  optionText: {
    fontSize: 16,
    fontWeight: '500',
  },
  navbarImage: {
  position: "absolute",
  bottom: -32,
  width: "100%",
  height: 110,
  zIndex: 1,
  pointerEvents: "none",
},
});