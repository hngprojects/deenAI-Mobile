import { quranService } from "@/service/quran.service";
import { theme } from "@/styles/theme";
import { IMessage } from "@/types/chat.type";
import { router } from "expo-router";
import { BookOpen, BookOpenText, Copy, Share } from "lucide-react-native";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Markdown from "react-native-markdown-display";

interface MessageBubbleProps {
  message: IMessage;
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const handleQuranReference = async (
    surahNumber: number,
    ayahNumber?: number
  ) => {
    try {
      // Get all surahs to find the specific one
      await quranService.initialize();
      const allSurahs = await quranService.getAllSurahs();
      const surah = allSurahs.find((s) => s.number === surahNumber);

      if (surah) {
        router.push({
          pathname: "/(tabs)/(quran)/surahDetail",
          params: {
            surah: JSON.stringify(surah),
            scrollToAyah: ayahNumber?.toString() || "1",
          },
        });
      }
    } catch (error) {
      console.error("Error navigating to Quran:", error);
    }
  };
  return (
    <View
      style={{
        display: "flex",
        flexDirection: "row",
        gap: 10,
      }}
    >
      <View
        style={{
          flex: 1,
          alignItems: message.role === "assistant" ? "flex-start" : "flex-end",
        }}
      >
        {/* Message buuble */}
        <View
          style={{
            ...styles.container,
            backgroundColor:
              message.role === "assistant"
                ? theme.color.white
                : theme.color.brand,
            borderTopLeftRadius: message.role === "assistant" ? 0 : 15,
            borderTopRightRadius: message.role === "assistant" ? 15 : 0,
            borderBottomLeftRadius: 15,
            borderBottomRightRadius: 15,
          }}
        >
          <Markdown
            style={{
              body: {
                color:
                  message.role === "assistant"
                    ? theme.color.black
                    : theme.color.white,
                fontSize: 14,
                lineHeight: 24,
              },
            }}
          >
            {message.content}
          </Markdown>

          {/* References */}
          {message.aiReferences && message.aiReferences.length > 0 && (
            <View style={styles.referencesContainer}>
              <Text
                style={[
                  styles.referencesTitle,
                  {
                    color:
                      message.role === "assistant"
                        ? theme.color.black
                        : theme.color.white,
                  },
                ]}
              >
                References:
              </Text>
              {message.aiReferences.map((ref, idx) => {
                if (ref.type === "quran" && ref.surah) {
                  return (
                    <TouchableOpacity
                      key={idx}
                      onPress={() =>
                        handleQuranReference(ref.surah!, ref.startAyah)
                      }
                      style={styles.referenceLink}
                    >
                      <BookOpen
                        size={16}
                        color={
                          message.role === "assistant"
                            ? theme.color.brand
                            : theme.color.white
                        }
                      />
                      <Text
                        style={[
                          styles.referenceLinkText,
                          {
                            color:
                              message.role === "assistant"
                                ? theme.color.brand
                                : theme.color.white,
                          },
                        ]}
                      >
                        Quran {ref.surah}:{ref.startAyah || 1}
                        {ref.endAyah && ref.endAyah !== ref.startAyah
                          ? `-${ref.endAyah}`
                          : ""}
                      </Text>
                    </TouchableOpacity>
                  );
                }
                return (
                  <TouchableOpacity
                    key={idx}
                    onPress={() =>
                      handleQuranReference(ref.surah!, ref.startAyah)
                    }
                    style={styles.referenceLink}
                  >
                    <BookOpenText
                      size={16}
                      color={
                        message.role === "assistant"
                          ? theme.color.brand
                          : theme.color.white
                      }
                    />
                    <Text
                      style={[
                        styles.referenceLinkText,
                        {
                          color:
                            message.role === "assistant"
                              ? theme.color.brand
                              : theme.color.white,
                        },
                      ]}
                    >
                      {ref.collection} :{ref.hadithNumber}
                      {ref.endAyah && ref.endAyah !== ref.startAyah
                        ? `-${ref.endAyah}`
                        : ""}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </View>

        {/* Actions - Like, copy, dislike, share */}
        {message.role === "assistant" && (
          <View style={styles.actions}>
            {/* <ThumbsUp size={24} color={theme.color.actionIcon} />
            <ThumbsDown size={24} color={theme.color.actionIcon} /> */}
            <TouchableOpacity onPress={() => {}}>
              <Copy size={18} color={theme.color.actionIcon} />
            </TouchableOpacity>
            <Share size={18} color={theme.color.actionIcon} />
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    maxWidth: "80%",
  },
  actions: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    gap: 15,
  },
  referencesContainer: {
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "rgba(0, 0, 0, 0.1)",
  },
  referencesTitle: {
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 6,
  },
  referenceLink: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 4,
  },
  referenceLinkText: {
    fontSize: 13,
    textDecorationLine: "underline",
  },
  referenceText: {
    fontSize: 13,
    paddingVertical: 2,
  },
  hyperlink: {},
});
