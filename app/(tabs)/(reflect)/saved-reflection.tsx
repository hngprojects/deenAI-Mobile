import ScreenContainer from '@/components/ScreenContainer';
import ScreenHeader from '@/components/screenHeader';
import { quranService } from '@/service/quran.service';
import { reflectService } from '@/service/reflect.service';
import { theme } from '@/styles/theme';
import { Reflection } from '@/types/reflect.types';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Edit2, Trash2 } from 'lucide-react-native';
import React, { useCallback, useState } from 'react';
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

interface ReflectionWithData extends Reflection {
  verseText?: string;
  surahName?: string;
  reference?: string;
}

type ReflectStackParamList = {
  'saved-reflection': undefined;
  'reflect-verse': {
    reflectionId?: string;
    editMode?: string;
    content?: string;
    surahNumber?: string;
    startAyah?: string;
    verseText?: string;
    surahName?: string;
  };
  'index': undefined;
};

type SavedReflectionProp = NativeStackNavigationProp<ReflectStackParamList, 'saved-reflection'>;

export default function SavedReflectionsPage() {
  const navigation = useNavigation<SavedReflectionProp>();
  const [reflections, setReflections] = useState<ReflectionWithData[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedReflection, setSelectedReflection] = useState<ReflectionWithData | null>(null);
  const { t } = useTranslation();

  const loadReflections = async () => {
    try {
      console.log('🔄 Loading reflections...');
      const userReflections = await reflectService.getUserReflections();

      // Enhance reflections with verse data
      const enhancedReflections = await Promise.all(
        userReflections.map(async (reflection) => {
          try {
            let verseText = '';
            let surahName = '';
            let reference = '';

            if (reflection.surah && reflection.startAyah) {
              // Get the verse translation (English meaning)
              const verse = await quranService.getVerse(reflection.surah, reflection.startAyah);
              if (verse) {
                verseText = verse.translation;
              }

              // Get surah name and create reference
              const surah = await quranService.getSurah(reflection.surah);
              if (surah) {
                surahName = surah.englishName;
                reference = `Surah ${surah.englishName} (${surah.number}:${reflection.startAyah})`;
              }
            }

            return {
              ...reflection,
              verseText: verseText || "Reflection on Quranic verse",
              surahName,
              reference: reference || `Surah ${reflection.surah}${reflection.startAyah ? `:${reflection.startAyah}` : ''}`,
            };
          } catch (error) {
            console.error('Error loading verse data for reflection:', error);
            return {
              ...reflection,
              verseText: "Reflection on Quranic verse",
              reference: `Surah ${reflection.surah}${reflection.startAyah ? `:${reflection.startAyah}` : ''}`,
            };
          }
        })
      );

      console.log('✅ Reflections loaded:', enhancedReflections.length);
      setReflections(enhancedReflections);
    } catch (error) {
      console.error('Error loading reflections:', error);
      Alert.alert('Error', 'Failed to load reflections');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Refresh when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      console.log('🎯 Screen focused, loading reflections...');
      loadReflections();
    }, [])
  );

  const handleDeleteReflection = async (id: string) => {
    try {
      await reflectService.deleteReflection(id);
      setReflections(prev => prev.filter(reflection => reflection.id !== id));
      setDeleteModalVisible(false);
      setSelectedReflection(null);
      Alert.alert('Success', 'Reflection deleted successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to delete reflection');
      console.error('Error deleting reflection:', error);
    }
  };

  const confirmDelete = (reflection: ReflectionWithData) => {
    setSelectedReflection(reflection);
    setDeleteModalVisible(true);
  };

  const cancelDelete = () => {
    setDeleteModalVisible(false);
    setSelectedReflection(null);
  };

  const handleEditReflection = (reflection: ReflectionWithData) => {
    // Navigate using navigation.navigate instead of router.push
    navigation.navigate('reflect-verse', {
      reflectionId: reflection.id,
      content: reflection.content,
      surahNumber: reflection.surah?.toString(),
      startAyah: reflection.startAyah?.toString() || '1',
      verseText: reflection.verseText || '',
      surahName: reflection.surahName || '',
      editMode: 'true'
    });
  };

  const renderReflectionItem = ({ item }: { item: ReflectionWithData }) => {
    const formattedDate = new Date(item.createdAt).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

    return (
      <View style={styles.container}>
        <View style={styles.card}>
          {/* Quote Section */}
          <View style={styles.quoteSection}>
            <Text style={styles.quote}>
              &quot;{item.verseText}&quot;
            </Text>
            <Text style={styles.reference}>— {item.reference}</Text>
          </View>

          {/* Reflection Section */}
          <View style={styles.reflectionSection}>
            <Text style={styles.reflectionText}>
              {item.content}
            </Text>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.savedDate}>Saved on {formattedDate}</Text>
            <View style={styles.actions}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => confirmDelete(item)}
              >
                <Trash2 size={20} color="#999" strokeWidth={2} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => handleEditReflection(item)}
              >
                <Edit2 size={20} color="#999" strokeWidth={2} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <ScreenContainer backgroundColor={theme.color.white}>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={theme.color.brand} />
          <Text style={styles.loadingText}>Loading reflections...</Text>
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer
      backgroundColor={theme.color.white}
      statusBarStyle="dark"
      scrollable={false}
      showsVerticalScrollIndicator={false}
      keyboardAvoiding={false}
    >
      <View style={styles.fixedHeader}>
        <ScreenHeader
          title={t("reflection")}
          showBackButton={true}

        // rightComponent={
        //   <TouchableOpacity
        //     onPress={() => navigation.navigate('index')}
        //     style={styles.addButton}
        //   >
        //     <Plus size={24} color={theme.color.white} />
        //   </TouchableOpacity>
        // }
        />
      </View>

      {reflections.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateTitle}>{t("noReflections")}</Text>
          <Text style={styles.emptyStateText}>
            {t("startReflectionJourney")}
          </Text>
          <TouchableOpacity
            style={styles.emptyStateButton}
            onPress={() => navigation.navigate('index')}
          >
            <Text style={styles.emptyStateButtonText}>{t("savedStartReflecting")}</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={reflections}
          renderItem={renderReflectionItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshing={refreshing}
          style={styles.flatList}
          onRefresh={() => {
            setRefreshing(true);
            loadReflections();
          }}
        />
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        transparent
        animationType="fade"
        visible={deleteModalVisible}
        onRequestClose={cancelDelete}
        statusBarTranslucent
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{t("confirmDelete")}</Text>
            <Text style={styles.modalText}>
              {t("deleteReflectionQuestion")}
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={cancelDelete}
                activeOpacity={0.7}
              >
                <Text style={styles.cancelButtonText}>{t("keepReflection")}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.deleteButton]}
                onPress={() => selectedReflection && handleDeleteReflection(selectedReflection.id)}
                activeOpacity={0.8}
              >
                <Text style={styles.deleteButtonText}>{t("deleteReflection")}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  fixedHeader: {
    paddingTop:
      Platform.OS === "android" ? 
      (StatusBar.currentHeight || 0) + 10 : 54,
    paddingHorizontal: 20,
    paddingBottom: 10,
    backgroundColor: theme.color.white,
  },
  flatList: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: theme.color.black,
    fontFamily: theme.font.regular,
  },
  addButton: {
    backgroundColor: theme.color.brand,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyStateTitle: {
    fontSize: 24,
    fontFamily: theme.font.bold,
    color: theme.color.secondary,
    marginBottom: 12,
  },
  emptyStateText: {
    fontSize: 16,
    fontFamily: theme.font.regular,
    color: theme.color.black,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  emptyStateButton: {
    backgroundColor: theme.color.brand,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  emptyStateButtonText: {
    color: theme.color.white,
    fontFamily: theme.font.semiBold,
    fontSize: 16,
  },
  listContent: {
    paddingVertical: 16,
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  container: {
    gap: 16,
    marginBottom: 16,
  },
  card: {
    backgroundColor: theme.color.white,
    borderRadius: 20,
  },
  quoteSection: {
    backgroundColor: '#F3EAD8',
    padding: 20,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    gap: 8,
  },
  quote: {
    fontSize: 16,
    fontFamily: theme.font.semiBold,
    color: '#4E3B18',
    lineHeight: 24,
    textAlign: 'center',
  },
  reference: {
    fontSize: 14,
    fontFamily: theme.font.regular,
    color: '#4E3B18',
    textAlign: 'center',
  },
  reflectionSection: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderBottomWidth: 0,
    borderRightWidth: 1,
    borderLeftWidth: 1,
    borderTopWidth: 0,
    borderColor: '#E3E3E3',
  },
  reflectionText: {
    fontSize: 16,
    fontFamily: theme.font.semiBold,
    color: '#555',
    lineHeight: 24,
    paddingVertical: 10,
    textAlign: 'center',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    paddingTop: 8,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    borderBottomWidth: 1,
    borderRightWidth: 1,
    borderLeftWidth: 1,
    borderTopWidth: 0,
    borderColor: '#E3E3E3',
  },
  savedDate: {
    fontSize: 13,
    fontFamily: theme.font.regular,
    color: '#575757ff',
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: '#0000004D',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 30,
    gap: 16,
  },
  modalTitle: {
    fontWeight: '700',
    textAlign: "center",
    fontSize: 18,
    color: "#1a1a1a",
    fontFamily: theme.font.bold,
  },
  modalText: {
    fontSize: 14,
    fontFamily: theme.font.semiBold,
    color: '#1A1A1A',
    textAlign: 'center',
    lineHeight: 20,
  },
  modalButtons: {
    display: "flex",
    flexDirection: "column",
    justifyContent: 'space-between',
    gap: 12
  },
  modalButton: {
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    borderColor: "#1a1a1a",
    borderWidth: 1,
  },
  cancelButtonText: {
    fontSize: 16,
    fontFamily: theme.font.semiBold,
    color: '#1a1a1a',
  },
  deleteButton: {
    backgroundColor: '#E55153',
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: theme.font.semiBold,
  },
});