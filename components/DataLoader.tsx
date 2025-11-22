// components/DataLoader.tsx
import { hadithDB } from '@/service/hadithDatabase';
import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
// import { hadithDB } from '../services/hadithDatabase';

interface DataLoaderProps {
  onLoadComplete: () => void;
}

export const DataLoader: React.FC<DataLoaderProps> = ({ onLoadComplete }) => {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      await hadithDB.initialize();

      const isLoaded = await hadithDB.isDataLoaded();

      if (isLoaded) {
        setProgress('Data already loaded');
        setLoading(false);
        onLoadComplete();
        return;
      }

      setProgress('Loading hadith collections...');

      // Load all JSON files
      const collections = [
        { name: 'bukhari', arab: require('../assets/data/bukhari-ara.json'), eng: require('../assets/data/bukhari-eng.json') },
        { name: 'muslim', arab: require('../assets/data/muslim-ara.json'), eng: require('../assets/data/muslim-eng.json') },
        { name: 'abudawud', arab: require('../assets/data/abudawud-ara.json'), eng: require('../assets/data/abudawud-eng.json') },
        { name: 'tirmidhi', arab: require('../assets/data/tirmidhi-ara.json'), eng: require('../assets/data/tirmidhi-eng.json') }
      ];

      for (let i = 0; i < collections.length; i++) {
        const { name, arab, eng } = collections[i];
        setProgress(`Importing ${name}... (${i + 1}/${collections.length})`);

        await hadithDB.importData(name, arab, eng);
      }

      await hadithDB.markDataAsLoaded();
      setProgress('All data loaded successfully!');
      setLoading(false);
      onLoadComplete();

    } catch (err) {
      console.error('Failed to load data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load data');
      setLoading(false);
    }
  };

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#4A5568" />
      <Text style={styles.text}>{progress}</Text>
      <Text style={styles.subText}>This may take a few minutes on first launch</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F7FAFC'
  },
  text: {
    marginTop: 20,
    fontSize: 16,
    color: '#2D3748',
    textAlign: 'center'
  },
  subText: {
    marginTop: 10,
    fontSize: 14,
    color: '#718096',
    textAlign: 'center'
  },
  errorText: {
    color: '#E53E3E',
    fontSize: 16,
    textAlign: 'center'
  }
});