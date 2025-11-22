import PrimaryButton from '@/components/primaryButton';
import ScreenContainer from '@/components/ScreenContainer';
import ScreenHeader from '@/components/screenHeader';
import SecondaryButton from '@/components/secondaryButton';
import { useToast } from '@/hooks/useToast';
import { quranService } from '@/service/quran.service';
import { reflectService } from '@/service/reflect.service';
import { useReflectStore } from '@/store/reflect-store';
import { theme } from '@/styles/theme';
import { Surah } from '@/types/quran.types';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

export default function ReflectVerseScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const textInputRef = useRef<TextInput>(null);
  const { showToast } = useToast();

  const { draft, setDraft, clearDraft, getDraftForSubmission } = useReflectStore();

  // Parse params
  const reflectionId = params.reflectionId as string;
  const editMode = params.editMode === 'true';
  const existingContent = params.content as string;
  const surahNumberFromParams = params.surahNumber ? parseInt(params.surahNumber as string) : undefined;
  const startAyahFromParams = params.startAyah ? parseInt(params.startAyah as string) : undefined;
  const verseTextFromParams = params.verseText as string;
  const surahNameFromParams = params.surahName as string;

  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [surah, setSurah] = useState<Surah | null>(null);
  const [verseData, setVerseData] = useState<{ translation?: string; verseNumber?: number } | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isFocused, setIsFocused] = useState(false);

  const debounceRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    console.log('🔄 Initializing content:', {
      editMode,
      existingContent,
      draftContent: draft.content,
    });

    if (editMode && existingContent) {
      setContent(existingContent);
      console.log('✅ Set content from existing reflection');
    } else if (draft.content) {
      setContent(draft.content);
      console.log('✅ Set content from draft');
    } else {
      setContent('');
      console.log('✅ Set empty content');
    }
  }, [editMode, existingContent]);

  useEffect(() => {
    const loadVerseData = async () => {
      try {
        setLoading(true);

        console.log('🔄 Loading verse data:', {
          editMode,
          surahNumberFromParams,
          startAyahFromParams,
          draftSurahNumber: draft.surahNumber,
          draftVerseNumber: draft.verseNumber,
        });

        if (editMode && surahNumberFromParams) {
          console.log('📖 Loading verse data for edit mode');

          const surahData = await quranService.getSurah(surahNumberFromParams);
          setSurah(surahData);

          if (verseTextFromParams && startAyahFromParams) {
            setVerseData({
              translation: verseTextFromParams,
              verseNumber: startAyahFromParams
            });
          } else if (startAyahFromParams) {
            const verse = await quranService.getVerse(surahNumberFromParams, startAyahFromParams);
            if (verse) {
              setVerseData({
                translation: verse.translation,
                verseNumber: startAyahFromParams
              });
            }
          }

          setDraft({
            surahNumber: surahNumberFromParams,
            verseNumber: startAyahFromParams || 1,
            translation: verseTextFromParams || verseData?.translation,
            surahName: surahNameFromParams || surahData?.englishName,
          });
        } else if (draft.surahNumber && !editMode) {
          console.log('📖 Loading verse data from draft');

          const surahData = await quranService.getSurah(draft.surahNumber);
          setSurah(surahData);

          if (draft.verseNumber) {
            const verse = await quranService.getVerse(draft.surahNumber, draft.verseNumber);
            if (verse) {
              setVerseData({
                translation: verse.translation,
                verseNumber: draft.verseNumber
              });
            }
          }
        }
      } catch (error) {
        console.error('Error loading verse data:', error);
        showToast('Failed to load verse data', 'error');
      } finally {
        setLoading(false);
      }
    };

    loadVerseData();
  }, [editMode, surahNumberFromParams, startAyahFromParams]);

  useEffect(() => {
    if (editMode) return;

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      setDraft({ content });
    }, 300);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [content, editMode]);

  useEffect(() => {
    if (validationError && content.trim()) {
      setValidationError(null);
    }
  }, [content, validationError]);

  const handleSaveReflection = async () => {
    Keyboard.dismiss();

    if (!content.trim()) {
      setValidationError('Reflection content cannot be empty');
      showToast('Please write your reflection', 'warning');
      return;
    }

    if (content.trim().length < 5) {
      setValidationError('Reflection should be at least 5 characters long');
      showToast('Reflection is too short', 'warning');
      return;
    }

    setSaving(true);
    setValidationError(null);

    try {
      if (editMode && reflectionId) {
        console.log('💾 Updating reflection:', { reflectionId, content });
        await reflectService.updateReflection(reflectionId, content);
        clearDraft();
        showToast('Reflection updated successfully!', 'success');
        setTimeout(() => {
          router.push('/(tabs)/reflect');
        }, 1000);
      } else {
        const submissionData = getDraftForSubmission();
        console.log('💾 Creating reflection:', submissionData);

        if (!submissionData.surah) {
          throw new Error('Surah information is required for reflection');
        }

        await reflectService.createReflection(submissionData);
        clearDraft();
        showToast('Reflection saved successfully!', 'success');
        setTimeout(() => {
          router.push('/(tabs)/(reflect)/reflect-success');
        }, 1000);
      }
    } catch (error: any) {
      console.error('Error saving reflection:', error);

      let errorMessage = 'Failed to save reflection. Please try again.';

      if (error.message.includes('Surah information is required')) {
        errorMessage = 'Surah information is missing. Please go back and select a verse.';
      } else if (error.message.includes('Validation failed')) {
        errorMessage = error.message;
      } else if (error.message.includes('content cannot be empty')) {
        errorMessage = 'Reflection content cannot be empty. Please write your thoughts.';
      }

      setValidationError(errorMessage);
      showToast(errorMessage, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    Keyboard.dismiss();

    if (content.trim() && content !== existingContent) {
      Alert.alert(
        'Unsaved Changes',
        'You have unsaved changes. Are you sure you want to leave?',
        [
          { text: 'Stay', style: 'cancel' },
          {
            text: 'Leave',
            style: 'destructive',
            onPress: () => {
              if (!editMode) {
                clearDraft();
              }
              showToast('Changes discarded', 'info');
              router.push('/(tabs)/reflect');
            }
          }
        ]
      );
    } else {
      if (!editMode) {
        clearDraft();
      }
      router.back();
    }
  };

  const handleShare = () => {
    showToast('Share functionality coming soon!', 'info');
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  // Check if we have verse details
  const showVerseDetails = surah || draft.surahNumber || surahNumberFromParams;

  if (!showVerseDetails && !editMode) {
    return (
      <ScreenContainer backgroundColor={theme.color.white}>
        <ScreenHeader
          title="Reflect on Verse"
          showBackButton={true}
          onBackPress={handleCancel}
        />
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>
            No verse selected for reflection.{'\n\n'}
            Please go back and select a verse to reflect on.
          </Text>
        </View>
      </ScreenContainer>
    );
  }

  if (loading) {
    return (
      <ScreenContainer backgroundColor={theme.color.white}>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={theme.color.brand} />
          <Text style={styles.loadingText}>Loading verse...</Text>
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer
      backgroundColor={'#F9F9F9'}
      keyboardAvoiding={true}
    >
      <ScreenHeader
        title={editMode ? "Edit Reflection" : "Reflect on Verse"}
        showBackButton={true}
        onBackPress={handleCancel}
      />

      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {showVerseDetails && (
          <View style={styles.quoteCard}>
            {(verseData?.translation || draft.translation || verseTextFromParams) && (
              <Text style={styles.quoteTranslation}>
                {verseData?.translation || draft.translation || verseTextFromParams}
              </Text>
            )}

            <Text style={styles.quoteVerse}>
              {surah ? (
                <Text>
                  {surah.englishName} ({surah.name})
                  {(verseData?.verseNumber || draft.verseNumber || startAyahFromParams) &&
                    `, Verse ${verseData?.verseNumber || draft.verseNumber || startAyahFromParams}`}
                </Text>
              ) : draft.surahName ? (
                <Text>
                  {draft.surahName}
                  {draft.verseNumber && `, Verse ${draft.verseNumber}`}
                </Text>
              ) : surahNameFromParams ? (
                <Text>
                  {surahNameFromParams}
                  {startAyahFromParams && `, Verse ${startAyahFromParams}`}
                </Text>
              ) : surahNumberFromParams ? (
                <Text>
                  Surah {surahNumberFromParams}
                  {(verseData?.verseNumber || startAyahFromParams) &&
                    `, Verse ${verseData?.verseNumber || startAyahFromParams}`}
                </Text>
              ) : null}
            </Text>

            {editMode && (
              <Text style={styles.editModeIndicator}>
                Editing your reflection
              </Text>
            )}
          </View>
        )}

        <View style={styles.reflectionSection}>
          <Text style={styles.reflectionHeader}>Your Reflection</Text>
          <Text style={styles.reflectionSubtitle}>
            {editMode ? "Update your thoughts on this verse..." : "Write what this verse means to you..."}
          </Text>

          <TextInput
            ref={textInputRef}
            style={[
              styles.textarea,
              validationError && styles.textareaError,
              isFocused && styles.textareaFocused
            ]}
            placeholder={editMode ? "Update your reflection..." : "Share your thoughts, insights, or personal reflections on this verse..."}
            placeholderTextColor={theme.color.black}
            value={content}
            onChangeText={setContent}
            multiline={true}
            textAlignVertical="top"
            autoFocus={!editMode}
            maxLength={2000}
            onFocus={handleFocus}
            onBlur={handleBlur}
            editable={!saving}
            selectTextOnFocus={true}
            keyboardType="default"
            returnKeyType="default"
            blurOnSubmit={false}
          />

          {validationError && (
            <Text style={styles.errorText}>{validationError}</Text>
          )}
        </View>

        <View style={styles.buttonContainer}>
          <PrimaryButton
            title={saving ? "Saving..." : editMode ? "Update Reflection" : "Save Reflection"}
            onPress={handleSaveReflection}
            disabled={saving || !content.trim()}
            loading={saving}
            style={styles.button}
          />
          <SecondaryButton
            title="Share reflection"
            onPress={handleShare}
            style={styles.button}
            disabled={saving}
          />
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },
  scrollContent: {
    // padding: 20,
    paddingBottom: 40,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // paddingHorizontal: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    fontFamily: theme.font.regular,
    color: theme.color.secondary,
  },
  quoteCard: {
    paddingVertical: 24,
    // paddingHorizontal: 20,
    borderWidth: 1,
    backgroundColor: theme.color.white,
    borderColor: '#edededff',
    gap: 13,
    marginTop: 20,
    marginBottom: 12,
    borderRadius: 8,
  },
  quoteTranslation: {
    fontSize: 14,
    fontFamily: theme.font.regular,
    color: theme.color.black,
    textAlign: 'center',
    lineHeight: 20,
    fontStyle: 'italic',
    marginBottom: 12,
  },
  quoteVerse: {
    color: "#3C3A35",
    fontSize: 16,
    fontFamily: theme.font.bold,
    textAlign: 'center',
  },
  editModeIndicator: {
    fontSize: 12,
    fontFamily: theme.font.regular,
    color: '#9C7630',
    textAlign: 'center',
    fontStyle: 'italic',
    marginTop: 8,
  },
  reflectionSection: {
    gap: 8,
  },
  reflectionHeader: {
    fontSize: 18,
    fontFamily: theme.font.extraBold,
    color: '#3C3A35',
    lineHeight: 24,
    marginTop: 24,
  },
  reflectionSubtitle: {
    fontSize: 14,
    fontFamily: theme.font.regular,
    color: theme.color.black,
    lineHeight: 20,
  },
  textarea: {
    borderWidth: 1,
    borderColor: '#C7C5CC',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    fontFamily: theme.font.regular,
    textAlignVertical: 'top',
    marginTop: 12,
    minHeight: 150,
    color: theme.color.secondary,
    backgroundColor: theme.color.white,
  },
  textareaError: {
    backgroundColor: '#FFF5F5',
    borderColor: '#ff5555',
  },
  textareaFocused: {
    borderColor: theme.color.brand,
  },
  charCount: {
    fontSize: 12,
    fontFamily: theme.font.regular,
    color: theme.color.black,
    textAlign: 'right',
    marginTop: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
    marginBottom: 30,
  },
  button: {
    flex: 1,
  },
  errorText: {
    fontSize: 14,
    fontFamily: theme.font.regular,
    marginTop: 8,
    color: '#ff5555',
    textAlign: 'center',
  }
});