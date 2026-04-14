import React, { useState, useRef } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, Modal, FlatList,
  KeyboardAvoidingView, Platform, StyleSheet, useWindowDimensions,
} from 'react-native';
import { useAiChat, ChatMessage } from '@/hooks/useAiChat';

const C = {
  bg: '#FFFFFF',
  text: '#1A1A1A',
  textLight: '#6B6560',
  textMuted: '#A09890',
  accent: '#C4956A',
  dark: '#1A2F38',
  cream: '#F0EBE4',
  border: '#E8E0D8',
};

const GREETING = "Hi! I'm the Alua Guide. Ask me anything about our retreats, breathwork, or surfing.";

export default function ChatWidget() {
  const { messages, isStreaming, sendMessage } = useAiChat();
  const [visible, setVisible] = useState(false);
  const [draft, setDraft] = useState('');
  const listRef = useRef<FlatList<ChatMessage>>(null);
  const { width } = useWindowDimensions();
  const isWide = width > 768;

  const handleSend = () => {
    const text = draft.trim();
    if (!text || isStreaming) return;
    setDraft('');
    sendMessage(text);
  };

  const renderMessage = ({ item }: { item: ChatMessage }) => {
    const isUser = item.role === 'user';
    return (
      <View style={[s.bubble, isUser ? s.userBubble : s.assistantBubble]}>
        {item.isStreaming ? (
          <Text style={[s.bubbleText, { color: C.textMuted }]}>Thinking...</Text>
        ) : (
          <Text style={[s.bubbleText, { color: isUser ? '#fff' : C.text }]}>{item.content}</Text>
        )}
      </View>
    );
  };

  return (
    <>
      <TouchableOpacity onPress={() => setVisible(true)} activeOpacity={0.8} style={s.fab}>
        <Text style={s.fabIcon}>💬</Text>
      </TouchableOpacity>

      <Modal visible={visible} animationType="slide" transparent onRequestClose={() => setVisible(false)}>
        <View style={s.overlay}>
          <TouchableOpacity style={s.overlayBg} activeOpacity={1} onPress={() => setVisible(false)} />
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={[s.panel, isWide && s.panelWide]}>
            {/* Header */}
            <View style={s.header}>
              <View>
                <Text style={s.headerTitle}>Alua Guide</Text>
                <Text style={s.headerSub}>Ask about retreats, breathwork, or surfing</Text>
              </View>
              <TouchableOpacity onPress={() => setVisible(false)} style={s.closeBtn}>
                <Text style={s.closeBtnText}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* Messages */}
            <FlatList
              ref={listRef}
              data={messages}
              keyExtractor={(item) => item.id}
              renderItem={renderMessage}
              contentContainerStyle={s.messageList}
              ListHeaderComponent={
                <View style={[s.bubble, s.assistantBubble]}>
                  <Text style={[s.bubbleText, { color: C.text }]}>{GREETING}</Text>
                </View>
              }
              onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
            />

            {/* Input */}
            <View style={s.inputRow}>
              <TextInput
                value={draft}
                onChangeText={setDraft}
                placeholder="Type a message..."
                placeholderTextColor={C.textMuted}
                multiline
                style={s.chatInput}
                onSubmitEditing={handleSend}
                returnKeyType="send"
                blurOnSubmit
              />
              <TouchableOpacity
                onPress={handleSend}
                disabled={!draft.trim() || isStreaming}
                style={[s.sendBtn, { opacity: draft.trim() && !isStreaming ? 1 : 0.4 }]}>
                <Text style={s.sendIcon}>↑</Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </>
  );
}

const s = StyleSheet.create({
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: C.dark,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
    zIndex: 100,
  },
  fabIcon: { fontSize: 24 },

  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  overlayBg: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
  },
  panel: {
    width: '100%',
    maxHeight: '85%',
    backgroundColor: C.bg,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
  },
  panelWide: {
    width: 420,
    maxHeight: '80%',
    position: 'absolute',
    bottom: 24,
    right: 24,
    borderRadius: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  headerTitle: { fontSize: 17, fontWeight: '600', color: C.text },
  headerSub: { fontSize: 13, color: C.textMuted, marginTop: 2 },
  closeBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: C.cream, alignItems: 'center', justifyContent: 'center' },
  closeBtnText: { fontSize: 16, color: C.textLight, fontWeight: '500' },

  messageList: { padding: 16, paddingBottom: 8 },
  bubble: { maxWidth: '85%', padding: 14, borderRadius: 14, marginBottom: 10 },
  userBubble: { alignSelf: 'flex-end', backgroundColor: C.dark, borderBottomRightRadius: 4 },
  assistantBubble: { alignSelf: 'flex-start', backgroundColor: C.cream, borderBottomLeftRadius: 4 },
  bubbleText: { fontSize: 15, lineHeight: 22 },

  inputRow: { flexDirection: 'row', alignItems: 'flex-end', padding: 12, borderTopWidth: 1, borderTopColor: C.border, gap: 8 },
  chatInput: { flex: 1, fontSize: 15, borderWidth: 1, borderColor: C.border, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10, maxHeight: 100, color: C.text, backgroundColor: '#FAFAFA' },
  sendBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: C.dark, alignItems: 'center', justifyContent: 'center' },
  sendIcon: { color: '#fff', fontSize: 20, fontWeight: '700' },
});
