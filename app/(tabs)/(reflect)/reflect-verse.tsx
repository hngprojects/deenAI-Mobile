import GuestWarningModal from '@/components/GuestModal';
import PrimaryButton from '@/components/primaryButton';
import ScreenContainer from '@/components/ScreenContainer';
import ScreenHeader from '@/components/screenHeader';
import SecondaryButton from '@/components/secondaryButton';
import { useLogout } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { quranService } from '@/service/quran.service';
import { reflectService } from '@/service/reflect.service';
import { useAuthStore } from '@/store/auth-store';
import { useReflectStore } from '@/store/reflect-store';
import { theme } from '@/styles/theme';
import { Surah } from '@/types/quran.types';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useLocalSearchParams } from 'expo-router';
import * as Sharing from 'expo-sharing';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Alert,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Share,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { captureRef } from 'react-native-view-shot';

type ReflectStackParamList = {
  'reflect-verse': {
    reflectionId?: string;
    editMode?: string;
    content?: string;
    surahNumber?: string;
    startAyah?: string;
    verseText?: string;
    surahName?: string;
  };
  'reflect-success': undefined;
  index: undefined;
};

type ReflectScreenProp = NativeStackNavigationProp<ReflectStackParamList, 'reflect-verse'>;

export default function ReflectVerseScreen() {
  const navigation = useNavigation<ReflectScreenProp>();
  const params = useLocalSearchParams();
  const textInputRef = useRef<TextInput>(null);
  const reflectionCardRef = useRef<View>(null);
  const { showToast } = useToast();
  const { t } = useTranslation();

  // Get auth state to check if user is guest
  const { isGuest } = useAuthStore();

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
  const [showGuestModal, setShowGuestModal] = useState(false);
  const [showShareOptions, setShowShareOptions] = useState(false);
  const logoutMutation = useLogout();

  // Get status bar height
  const statusBarHeight = Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0;

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
  }, [editMode, existingContent, draft.content]);

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

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editMode, surahNumberFromParams, startAyahFromParams, draft.surahNumber]);

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
  }, [content, editMode, setDraft]);

  useEffect(() => {
    if (validationError && content.trim()) {
      setValidationError(null);
    }
  }, [content, validationError]);

  const handleGuestSignUp = async () => {
    try {
      await logoutMutation.mutateAsync();
    } catch (error) {
      console.error('Logout failed:', error);
    }
    setShowGuestModal(false);
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  const handleGuestContinueReading = () => {
    setShowGuestModal(false);
  };

  const handleSaveReflection = async () => {
    Keyboard.dismiss();

    if (isGuest) {
      setShowGuestModal(true);
      return;
    }

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
          navigation.navigate('index');
        }, 1000);
      } else {
        const submissionData = getDraftForSubmission();
        console.log('💾 Creating reflection:', submissionData);

        if (!submissionData.surah) {
          throw new Error('Surah information is required for reflection');
        }

        await reflectService.createReflection(submissionData);
        clearDraft();
        setTimeout(() => {
          navigation.navigate('reflect-success');
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
              navigation.goBack(); 
            }
          }
        ]
      );
    } else {
      if (!editMode) {
        clearDraft();
      }
      navigation.goBack(); 
    }
  };

  const handleShare = () => {
    if (!content.trim()) {
      showToast('Please write your reflection before sharing', 'warning');
      return;
    }
    setShowShareOptions(true);
  };

  const handleShareAsText = async () => {
    setShowShareOptions(false);
    
    if (!content.trim()) {
      showToast('No reflection to share', 'error');
      return;
    }

    try {
      const verseInfo = surah 
        ? `${surah.englishName} (${surah.name}), Verse ${verseData?.verseNumber || draft.verseNumber || startAyahFromParams}`
        : draft.surahName 
        ? `${draft.surahName}, Verse ${draft.verseNumber}`
        : `Surah ${surahNumberFromParams}, Verse ${startAyahFromParams}`;

      const verseText = verseData?.translation || draft.translation || verseTextFromParams;
      
      const shareText = `Personal Reflection\n\n"${verseText}"\n\n${verseInfo}\n\n${content}\n\n- Shared from Deen AI`;

      await Share.share({
        message: shareText,
      });
    } catch (error) {
      showToast('Failed to share reflection', 'error');
    }
  };

  const handleShareAsImage = async () => {
    setShowShareOptions(false);
    
    if (!reflectionCardRef.current) {
      showToast('Unable to capture reflection', 'error');
      return;
    }

    try {
      showToast('Preparing image...', 'info');
      
      const uri = await captureRef(reflectionCardRef, {
        format: 'png',
        quality: 1,
      });

      const isAvailable = await Sharing.isAvailableAsync();
      
      if (isAvailable) {
        await Sharing.shareAsync(uri, {
          mimeType: 'image/png',
          dialogTitle: 'Share Reflection',
        });
      } else {
        showToast('Sharing is not available on this device', 'error');
      }
    } catch (error) {
      console.error('Error sharing as image:', error);
      showToast('Failed to share image', 'error');
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const showVerseDetails = surah || draft.surahNumber || surahNumberFromParams;

  if (!showVerseDetails && !editMode) {
    return (
      <View style={styles.container}>
        <ScreenHeader
          title="Reflect on Verse"
          showBackButton={true}
          onBackPress={handleCancel}
          paddingTop={statusBarHeight + 10}
        />
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>
            No verse selected for reflection.{'\n\n'}
            Please go back and select a verse to reflect on.
          </Text>
        </View>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.container}>
        <ScreenHeader
          title="Reflect on Verse"
          showBackButton={true}
          onBackPress={handleCancel}
          paddingTop={statusBarHeight + 10}
        />
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={theme.color.brand} />
          <Text style={styles.loadingText}>Loading verse...</Text>
        </View>
      </View>
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
          title={editMode ? "Edit Reflection" : t("personalReflection")}
          showBackButton={true}
          onBackPress={handleCancel}
        />
      </View>

      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Regular display - always visible */}
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

          {/* Hidden view for image capture - only used when sharing */}
          <View 
            ref={reflectionCardRef}
            collapsable={false}
            style={styles.hiddenShareableContent}
          >
            <View style={styles.imageCard}>
              {/* Quote Section */}
              <View style={styles.imageQuoteSection}>
                <Text style={styles.imageQuote}>
                  &quot;{verseData?.translation || draft.translation || verseTextFromParams}&quot;
                </Text>
                <Text style={styles.imageReference}>
                  — {surah 
                    ? `${surah.englishName} (${surah.name}), Verse ${verseData?.verseNumber || draft.verseNumber || startAyahFromParams}`
                    : draft.surahName 
                    ? `${draft.surahName}, Verse ${draft.verseNumber}`
                    : `Surah ${surahNumberFromParams}, Verse ${startAyahFromParams}`}
                </Text>
              </View>

              {/* Reflection Section */}
              {content.trim() && (
                <View style={styles.imageReflectionSection}>
                  <Text style={styles.imageReflectionText}>{content}</Text>
                </View>
              )}

              {/* Footer with Logo */}
              <View style={styles.imageFooter}>
                <View style={styles.imageFooterLeft}>
                  <Image 
                    source={require('@/assets/images/icon.png')}
                    style={styles.footerLogo}
                  />
                  <Text style={styles.footerAppName}>DeenAI</Text>
                </View>
                <Text style={styles.footerLabel}>Quran Reflection</Text>
              </View>
            </View>
          </View>

          <View style={styles.reflectionSection}>
            <View style={styles.headerWithCounter}>
              <Text style={styles.reflectionHeader}>{t("personalReflection")}</Text>
            </View>
            <Text style={styles.reflectionSubtitle}>
              {editMode ? t("editReflectionMessage") : t("reflectionMessage")}
            </Text>

            <View style={styles.textareaContainer}>
              <TextInput
                ref={textInputRef}
                style={[
                  styles.textarea,
                  validationError && styles.textareaError,
                  isFocused && styles.textareaFocused
                ]}
                placeholder={editMode ? t("updateReflection") : t("reflectBox")}
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
              <Text style={[
                styles.textareaCharCounter,
                !isFocused && content.trim().length < 5 && content.trim().length > 0 && styles.charCounterWarning,
              ]}>
                {content.length}/2000
              </Text>
            </View>

            {validationError && (
              <Text style={styles.errorText}>{validationError}</Text>
            )}

            {!isFocused && content.trim().length < 5 && content.trim().length > 0 && (
              <Text style={styles.minCharWarning}>
                Minimum 5 characters required.
              </Text>
            )}
          </View>

          <View style={styles.buttonContainer}>
            <PrimaryButton
              title={saving ? "Saving..." : editMode ? t("updateReflection") : t("saveReflection")}
              onPress={handleSaveReflection}
              disabled={saving || content.trim().length < 5}
              loading={saving}
              style={styles.button}
            />
            <SecondaryButton
              title={t("shareReflection")}
              onPress={handleShare}
              style={styles.button}
              disabled={saving || !content.trim()}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <GuestWarningModal
        visible={showGuestModal}
        onSignIn={handleGuestSignUp}
        onContinueReading={handleGuestContinueReading}
        verseText={verseData?.translation || draft.translation || verseTextFromParams}
      />

      {showShareOptions && (
        <TouchableOpacity 
          style={styles.shareModalOverlay}
          activeOpacity={1}
          onPress={() => setShowShareOptions(false)}
        >
          <View style={styles.shareModal}>
            <Text style={styles.shareModalTitle}>Share Reflection</Text>
            
            <TouchableOpacity 
              style={styles.shareOption}
              onPress={handleShareAsText}
            >
              <Text style={styles.shareOptionText}>Share as Text</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.shareOption}
              onPress={handleShareAsImage}
            >
              <Text style={styles.shareOptionText}>Share as Image</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.shareOption, styles.cancelOption]}
              onPress={() => setShowShareOptions(false)}
            >
              <Text style={styles.cancelOptionText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      )}
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
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#F9F9F9',
    paddingHorizontal: 20,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    fontFamily: theme.font.regular,
    color: theme.color.secondary,
  },
  quoteCard: {
    paddingVertical: 24,
    paddingHorizontal: 20,
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
    lineHeight: 20,
    marginBottom: 12,
  },
  quoteVerse: {
    color: '#964B00',
    fontSize: 16,
    fontFamily: theme.font.bold,
    borderRadius: 35,
    backgroundColor: '#FFF4EA',
    paddingVertical: 8,
    paddingHorizontal: 8,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  editModeIndicator: {
    fontSize: 12,
    fontFamily: theme.font.regular,
    color: '#9C7630',
    textAlign: 'center',
    fontStyle: 'italic',
    marginTop: 8,
  },
  hiddenShareableContent: {
    position: 'absolute',
    left: -9999,
    top: 0,
    width: 400,
    backgroundColor: theme.color.white,
  },
  imageCard: {
    backgroundColor: theme.color.white,
    borderRadius: 20,
    overflow: 'hidden',
  },
  imageQuoteSection: {
    backgroundColor: '#F3EAD8',
    padding: 20,
    gap: 8,
  },
  imageQuote: {
    fontSize: 16,
    fontFamily: theme.font.semiBold,
    color: '#4E3B18',
    lineHeight: 24,
    textAlign: 'center',
  },
  imageReference: {
    fontSize: 14,
    fontFamily: theme.font.regular,
    color: '#4E3B18',
    textAlign: 'center',
  },
  imageReflectionSection: {
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderRightWidth: 1,
    borderLeftWidth: 1,
    borderColor: '#E3E3E3',
  },
  imageReflectionText: {
    fontSize: 16,
    fontFamily: theme.font.semiBold,
    color: '#555',
    lineHeight: 24,
    textAlign: 'center',
  },
  imageFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    // borderBottomWidth: 1,
    borderRightWidth: 1,
    borderLeftWidth: 1,
    borderColor: '#E3E3E3',
    backgroundColor: theme.color.white,
  },
  imageFooterLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  footerLogo: {
    width: 24,
    height: 24,
  },
  footerAppName: {
    fontSize: 14,
    fontFamily: theme.font.extraBold,
    color: theme.color.secondary,
  },
  footerLabel: {
    fontSize: 14,
    fontFamily: theme.font.bold,
    color: '#666',
    paddingLeft: 8,
  },
  reflectionSection: {
    gap: 8,
    marginTop: 20,
  },
  headerWithCounter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 24,
  },
  reflectionHeader: {
    fontSize: 18,
    fontFamily: theme.font.extraBold,
    color: '#3C3A35',
    lineHeight: 24,
  },
  charCounterWarning: {
    color: '#ff5555',
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
    paddingBottom: 40,
    fontSize: 16,
    fontFamily: theme.font.regular,
    textAlignVertical: 'top',
    marginTop: 12,
    minHeight: 150,
    color: theme.color.secondary,
    backgroundColor: theme.color.white,
  },
  textareaContainer: {
    position: 'relative',
    marginTop: 12,
  },
  textareaCharCounter: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    fontSize: 11,
    fontFamily: theme.font.semiBold,
    color: theme.color.black,
  },
  textareaError: {
    backgroundColor: '#FFF5F5',
    borderColor: '#ff5555',
  },
  textareaFocused: {
    borderColor: theme.color.brand,
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
  },
  minCharWarning: {
    fontSize: 12,
    fontFamily: theme.font.regular,
    marginTop: 8,
    color: '#ff5555',
    textAlign: 'center',
  },
  shareModalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
  },
  shareModal: {
    backgroundColor: theme.color.white,
    borderRadius: 20,
    padding: 20,
    paddingBottom: 40,
    margin: 26
  },
  shareModalTitle: {
    fontSize: 18,
    fontFamily: theme.font.bold,
    color: theme.color.secondary,
    marginBottom: 20,
    textAlign: 'center',
  },
  shareOption: {
    backgroundColor: "white",
    borderColor: '#9B9B9B',
    borderWidth: 1,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 16,
    marginBottom: 12,
    alignItems: 'center',
  },
  shareOptionText: {
    fontSize: 16,
    fontFamily: theme.font.semiBold,
    color: theme.color.black,
  },
  cancelOption: {
    backgroundColor: '#F9F9F9',
    marginTop: 8,
  },
  cancelOptionText: {
    fontSize: 16,
    fontFamily: theme.font.semiBold,
    color: theme.color.secondary,
  },
});