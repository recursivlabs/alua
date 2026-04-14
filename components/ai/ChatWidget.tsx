import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from 'react-native';
import { Brand, Colors, Spacing, Radius, Typography } from '@/constants/theme';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useAiChat, ChatMessage } from '@/hooks/useAiChat';

const GREETING =
  "Hi! I'm the Alua Guide. Ask me anything about our retreats, breathwork, or surfing.";

export default function ChatWidget() {
  const scheme = useColorScheme();
  const colors = Colors[scheme];
  const { messages, isStreaming, sendMessage, clearMessages } = useAiChat();
  const [visible, setVisible] = useState(false);
  const [draft, setDraft] = useState('');
  const listRef = useRef<FlatList<ChatMessage>>(null);

  const handleSend = () => {
    const text = draft.trim();
    if (!text || isStreaming) return;
    setDraft('');
    sendMessage(text);
  };

  const handleClose = () => {
    setVisible(false);
  };

  const renderMessage = ({ item }: { item: ChatMessage }) => {
    const isUser = item.role === 'user';
    return (
      <View
        style={[
          styles.bubble,
          isUser
            ? [styles.userBubble, { backgroundColor: Brand.primary }]
            : [styles.assistantBubble, { backgroundColor: colors.surfaceRaised }],
        ]}
      >
        <Text
          style={[
            styles.bubbleText,
            { color: isUser ? '#ffffff' : colors.text },
          ]}
        >
          {item.content}
        </Text>
      </View>
    );
  };

  return (
    <>
      {/* Floating Action Button */}
      <TouchableOpacity
        onPress={() => setVisible(true)}
        activeOpacity={0.8}
        style={[styles.fab, { backgroundColor: Brand.primary }]}
      >
        <Text style={styles.fabIcon}>{'💬'}</Text>
      </TouchableOpacity>

      {/* Chat Modal */}
      <Modal
        visible={visible}
        animationType="slide"
        transparent
        onRequestClose={handleClose}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalContainer}
        >
          <View style={[styles.modal, { backgroundColor: colors.background }]}>
            {/* Header */}
            <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>
                Alua Guide
              </Text>
              <TouchableOpacity onPress={handleClose}>
                <Text style={[styles.closeButton, { color: colors.textMuted }]}>
                  Close
                </Text>
              </TouchableOpacity>
            </View>

            {/* Messages */}
            <FlatList
              ref={listRef}
              data={messages}
              keyExtractor={(item) => item.id}
              renderItem={renderMessage}
              contentContainerStyle={styles.messageList}
              ListHeaderComponent={
                <View
                  style={[
                    styles.bubble,
                    styles.assistantBubble,
                    { backgroundColor: colors.surfaceRaised },
                  ]}
                >
                  <Text style={[styles.bubbleText, { color: colors.text }]}>
                    {GREETING}
                  </Text>
                </View>
              }
              onContentSizeChange={() =>
                listRef.current?.scrollToEnd({ animated: true })
              }
            />

            {/* Input */}
            <View style={[styles.inputRow, { borderTopColor: colors.border }]}>
              <TextInput
                value={draft}
                onChangeText={setDraft}
                placeholder="Type a message..."
                placeholderTextColor={colors.textMuted}
                multiline
                style={[
                  styles.chatInput,
                  {
                    backgroundColor: colors.surface,
                    color: colors.text,
                    borderColor: colors.border,
                  },
                ]}
                onSubmitEditing={handleSend}
                returnKeyType="send"
                blurOnSubmit
              />
              <TouchableOpacity
                onPress={handleSend}
                disabled={!draft.trim() || isStreaming}
                style={[
                  styles.sendButton,
                  {
                    backgroundColor:
                      draft.trim() && !isStreaming
                        ? Brand.primary
                        : colors.textMuted,
                  },
                ]}
              >
                <Text style={styles.sendIcon}>{'\u2191'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  fabIcon: {
    fontSize: 24,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modal: {
    height: '80%',
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
  },
  modalTitle: {
    ...Typography.h3,
  },
  closeButton: {
    ...Typography.bodyMedium,
  },
  messageList: {
    padding: Spacing.md,
    paddingBottom: Spacing.lg,
  },
  bubble: {
    maxWidth: '80%',
    padding: Spacing.md,
    borderRadius: Radius.lg,
    marginBottom: Spacing.sm,
  },
  userBubble: {
    alignSelf: 'flex-end',
    borderBottomRightRadius: Radius.sm,
  },
  assistantBubble: {
    alignSelf: 'flex-start',
    borderBottomLeftRadius: Radius.sm,
  },
  bubbleText: {
    ...Typography.body,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: Spacing.sm,
    borderTopWidth: 1,
    gap: Spacing.sm,
  },
  chatInput: {
    flex: 1,
    ...Typography.body,
    borderWidth: 1,
    borderRadius: Radius.lg,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 2,
    maxHeight: 100,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendIcon: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '700',
  },
});
