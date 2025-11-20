import React from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { Search } from 'lucide-react-native';
import { theme } from '@/styles/theme';

interface SearchBarProps {
  placeholder: string;
  searchText: string;
  onSearchChange: (text: string) => void;
}

const SUBTLE_GRAY = '#999999';

export default function SearchBar({ placeholder, searchText, onSearchChange }: SearchBarProps) {
  return (
    <View style={styles.searchBar}>
      <Search size={20} color={SUBTLE_GRAY} style={styles.searchIcon} />
      <TextInput
        style={styles.searchInput}
        placeholder={placeholder}
        placeholderTextColor={SUBTLE_GRAY}
        value={searchText}
        onChangeText={onSearchChange}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.color.background2,
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 20,
    height: 50,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    fontFamily: theme.font.regular,
    fontSize: 16,
    color: theme.color.secondary,
  },
});