import { chatService } from "@/service/chat.service";
import { theme } from "@/styles/theme";
import { IChat } from "@/types/chat.type";
import { router } from "expo-router";
import { ArrowRight, History } from "lucide-react-native";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface ChatRoomItemProps {
  chat: IChat;
  onDelete?: () => void;
  onRename?: () => void;
}

const ChatRoomItem = ({ chat, onDelete, onRename }: ChatRoomItemProps) => {
  const [showActionSheet, setShowActionSheet] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [newChatName, setNewChatName] = useState(chat.title || "");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);

  const handlePress = () => {
    router.replace(`/(deenai)/${chat.id}` as any);
  };

  const handleLongPress = () => {
    setShowActionSheet(true);
  };

  const handleDeletePress = () => {
    setShowActionSheet(false);
    setTimeout(() => setShowDeleteModal(true), 300);
  };

  const handleRenamePress = () => {
    setShowActionSheet(false);
    setNewChatName(chat.title || "");
    setTimeout(() => setShowRenameModal(true), 300);
  };

  const confirmDelete = async () => {
    setIsDeleting(true);
    try {
      const success = await chatService.deleteChatRoom(chat.id);
      if (success) {
        setShowDeleteModal(false);
        onDelete?.();
      } else {
        Alert.alert("Error", "Failed to delete chat. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting chat:", error);
      Alert.alert("Error", "Failed to delete chat. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  const confirmRename = async () => {
    if (!newChatName.trim()) {
      Alert.alert("Error", "Chat name cannot be empty");
      return;
    }

    setIsRenaming(true);
    try {
      const result = await chatService.renameChatRoom(
        chat.id,
        newChatName.trim()
      );
      if (result) {
        setShowRenameModal(false);
        onRename?.();
      } else {
        Alert.alert("Error", "Failed to rename chat. Please try again.");
      }
    } catch (error) {
      console.error("Error renaming chat:", error);
      Alert.alert("Error", "Failed to rename chat. Please try again.");
    } finally {
      setIsRenaming(false);
    }
  };

  return (
    <>
      <TouchableOpacity onPress={handlePress} onLongPress={handleLongPress}>
        <View
          style={{
            paddingHorizontal: 20,
            paddingVertical: 20,
            backgroundColor: theme.color.background,
            borderRadius: 24,
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginVertical: 10,
          }}
        >
          <History size={20} />
          <Text
            style={{
              fontSize: 16,
              lineHeight: 30,
              color: theme.color.black,
            }}
          >
            {chat.hasTitle ? chat.title : "Untitled Chat"}
          </Text>

          <ArrowRight size={20} />
        </View>
      </TouchableOpacity>

      {/* Action Sheet Modal */}
      <Modal
        transparent
        animationType="fade"
        visible={showActionSheet}
        onRequestClose={() => setShowActionSheet(false)}
        statusBarTranslucent
      >
        <TouchableOpacity
          style={styles.actionSheetOverlay}
          activeOpacity={1}
          onPress={() => setShowActionSheet(false)}
        >
          <View style={styles.actionSheetContent}>
            <TouchableOpacity
              style={styles.actionSheetButton}
              onPress={handleRenamePress}
              activeOpacity={0.7}
            >
              <Text style={styles.actionSheetButtonText}>Rename Chat</Text>
            </TouchableOpacity>
            <View style={styles.actionSheetDivider} />
            <TouchableOpacity
              style={[styles.actionSheetButton, styles.deleteAction]}
              onPress={handleDeletePress}
              activeOpacity={0.7}
            >
              <Text style={[styles.actionSheetButtonText, styles.deleteText]}>
                Delete Chat
              </Text>
            </TouchableOpacity>
            <View style={styles.actionSheetDivider} />
            <TouchableOpacity
              style={styles.actionSheetButton}
              onPress={() => setShowActionSheet(false)}
              activeOpacity={0.7}
            >
              <Text style={styles.actionSheetButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        transparent
        animationType="fade"
        visible={showDeleteModal}
        onRequestClose={() => !isDeleting && setShowDeleteModal(false)}
        statusBarTranslucent
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Delete Chat</Text>
            <Text style={styles.modalText}>
              Are you sure you want to delete this chat? This action cannot be
              undone.
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowDeleteModal(false)}
                activeOpacity={0.7}
                disabled={isDeleting}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.deleteButton]}
                onPress={confirmDelete}
                activeOpacity={0.8}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={styles.deleteButtonText}>Delete Chat</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Rename Modal */}
      <Modal
        transparent
        animationType="fade"
        visible={showRenameModal}
        onRequestClose={() => !isRenaming && setShowRenameModal(false)}
        statusBarTranslucent
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Rename Chat</Text>
            <Text style={styles.modalText}>Enter a new name for this chat</Text>
            <TextInput
              style={styles.input}
              value={newChatName}
              onChangeText={setNewChatName}
              placeholder="Chat name"
              placeholderTextColor="#999"
              autoFocus
              editable={!isRenaming}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowRenameModal(false)}
                activeOpacity={0.7}
                disabled={isRenaming}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.primaryButton]}
                onPress={confirmRename}
                activeOpacity={0.8}
                disabled={
                  isRenaming ||
                  !newChatName.trim() ||
                  newChatName.trim().length < 4
                }
              >
                {isRenaming ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={styles.primaryButtonText}>Rename</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  // Action Sheet Styles
  actionSheetOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "flex-end",
  },
  actionSheetContent: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 34,
  },
  actionSheetButton: {
    paddingVertical: 18,
    paddingHorizontal: 24,
    alignItems: "center",
  },
  actionSheetButtonText: {
    fontSize: 17,
    fontFamily: theme.font.semiBold,
    color: theme.color.secondary,
  },
  deleteAction: {
    // backgroundColor: "#FFF5F5",
  },
  deleteText: {
    color: "#E55153",
  },
  actionSheetDivider: {
    height: 1,
    backgroundColor: "#E5E5E5",
    marginHorizontal: 24,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  modalContent: {
    width: "100%",
    maxWidth: 400,
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    paddingTop: 28,
    paddingBottom: 28,
    paddingHorizontal: 28,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 22,
    fontFamily: theme.font.bold,
    color: "#1A1A1A",
    textAlign: "center",
    marginBottom: 12,
  },
  modalText: {
    fontSize: 15,
    fontFamily: theme.font.regular,
    color: "#1A1A1A",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 24,
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#E5E5E5",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    fontFamily: theme.font.regular,
    color: theme.color.secondary,
    marginBottom: 24,
  },
  modalButtons: {
    width: "100%",
    gap: 14,
  },
  modalButton: {
    width: "100%",
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 56,
  },
  cancelButton: {
    backgroundColor: "transparent",
    borderWidth: 1.5,
    borderColor: "#1A1A1A",
  },
  cancelButtonText: {
    fontSize: 17,
    fontFamily: theme.font.semiBold,
    color: "#1A1A1A",
  },
  deleteButton: {
    backgroundColor: "#E55153",
  },
  deleteButtonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontFamily: theme.font.semiBold,
  },
  primaryButton: {
    backgroundColor: theme.color.brand,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontFamily: theme.font.semiBold,
  },
});

export default ChatRoomItem;
