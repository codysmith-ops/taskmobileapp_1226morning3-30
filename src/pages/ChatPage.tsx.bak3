import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { palette, spacing, radius, typography } from '../theme';

interface Message {
  id: string;
  text: string;
  senderId: string;
  senderName: string;
  timestamp: number;
  isMe: boolean;
}

interface ChatRoom {
  id: string;
  name: string;
  lastMessage: string;
  lastMessageTime: number;
  unreadCount: number;
  participants: string[];
}

export const ChatPage: React.FC = () => {
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [messageText, setMessageText] = useState('');
  const scrollViewRef = useRef<ScrollView>(null);

  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([
    {
      id: '1',
      name: 'Team Tasks',
      lastMessage: 'Great work on the delivery today!',
      lastMessageTime: Date.now() - 300000,
      unreadCount: 2,
      participants: ['user1', 'user2', 'user3'],
    },
    {
      id: '2',
      name: 'Store Updates',
      lastMessage: 'New inventory arrived',
      lastMessageTime: Date.now() - 3600000,
      unreadCount: 0,
      participants: ['user1', 'user4'],
    },
    {
      id: '3',
      name: 'John Doe',
      lastMessage: 'Can you pick up the package?',
      lastMessageTime: Date.now() - 7200000,
      unreadCount: 1,
      participants: ['user1', 'john'],
    },
  ]);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hey, did you complete the grocery task?',
      senderId: 'user2',
      senderName: 'Sarah',
      timestamp: Date.now() - 600000,
      isMe: false,
    },
    {
      id: '2',
      text: 'Yes, just finished! All items checked off.',
      senderId: 'user1',
      senderName: 'Me',
      timestamp: Date.now() - 300000,
      isMe: true,
    },
    {
      id: '3',
      text: 'Great work on the delivery today!',
      senderId: 'user3',
      senderName: 'Mike',
      timestamp: Date.now() - 300000,
      isMe: false,
    },
  ]);

  const handleSend = () => {
    if (!messageText.trim()) {
      return;
    }

    const newMessage: Message = {
      id: Date.now().toString(),
      text: messageText.trim(),
      senderId: 'user1',
      senderName: 'Me',
      timestamp: Date.now(),
      isMe: true,
    };

    setMessages(prev => [...prev, newMessage]);
    setMessageText('');

    // Update chat room last message
    if (selectedChat) {
      setChatRooms(prev =>
        prev.map(room =>
          room.id === selectedChat
            ? { ...room, lastMessage: newMessage.text, lastMessageTime: newMessage.timestamp }
            : room
        )
      );
    }

    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const formatTime = (timestamp: number): string => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMinutes = Math.floor((now.getTime() - date.getTime()) / 60000);

    if (diffMinutes < 1) {
      return 'Just now';
    }
    if (diffMinutes < 60) {
      return `${diffMinutes}m ago`;
    }
    if (diffMinutes < 1440) {
      return `${Math.floor(diffMinutes / 60)}h ago`;
    }
    return date.toLocaleDateString();
  };

  if (!selectedChat) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Messages</Text>
        </View>
        <ScrollView style={styles.chatList}>
          {chatRooms.map(room => (
            <TouchableOpacity
              key={room.id}
              style={styles.chatRoomCard}
              onPress={() => setSelectedChat(room.id)}
            >
              <View style={styles.avatarContainer}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>
                    {room.name
                      .split(' ')
                      .map(n => n[0])
                      .join('')
                      .slice(0, 2)}
                  </Text>
                </View>
              </View>
              <View style={styles.chatRoomInfo}>
                <View style={styles.chatRoomHeader}>
                  <Text style={styles.chatRoomName}>{room.name}</Text>
                  <Text style={styles.chatRoomTime}>{formatTime(room.lastMessageTime)}</Text>
                </View>
                <View style={styles.chatRoomFooter}>
                  <Text style={styles.chatRoomLastMessage} numberOfLines={1}>
                    {room.lastMessage}
                  </Text>
                  {room.unreadCount > 0 && (
                    <View style={styles.unreadBadge}>
                      <Text style={styles.unreadText}>{room.unreadCount}</Text>
                    </View>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  }

  const currentRoom = chatRooms.find(r => r.id === selectedChat);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <View style={styles.chatHeader}>
        <TouchableOpacity style={styles.backButton} onPress={() => setSelectedChat(null)}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.chatHeaderTitle}>{currentRoom?.name}</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
      >
        {messages.map(message => (
          <View
            key={message.id}
            style={[styles.messageBubble, message.isMe ? styles.myMessage : styles.theirMessage]}
          >
            {!message.isMe && <Text style={styles.senderName}>{message.senderName}</Text>}
            <Text
              style={[
                styles.messageText,
                message.isMe ? styles.myMessageText : styles.theirMessageText,
              ]}
            >
              {message.text}
            </Text>
            <Text
              style={[
                styles.messageTime,
                message.isMe ? styles.myMessageTime : styles.theirMessageTime,
              ]}
            >
              {formatTime(message.timestamp)}
            </Text>
          </View>
        ))}
      </ScrollView>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          value={messageText}
          onChangeText={setMessageText}
          multiline
          placeholderTextColor={palette.textTertiary}
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.surface,
  },
  header: {
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: palette.border,
  },
  headerTitle: {
    ...typography.h3,
    color: palette.text,
  },
  chatList: {
    flex: 1,
  },
  chatRoomCard: {
    flexDirection: 'row',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: palette.border,
    backgroundColor: palette.surface,
  },
  avatarContainer: {
    marginRight: spacing.md,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: palette.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    ...typography.bodyBold,
    color: palette.surface,
  },
  chatRoomInfo: {
    flex: 1,
  },
  chatRoomHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  chatRoomName: {
    ...typography.bodyBold,
    color: palette.text,
  },
  chatRoomTime: {
    ...typography.secondary,
    color: palette.textSecondary,
  },
  chatRoomFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chatRoomLastMessage: {
    ...typography.body,
    color: palette.textSecondary,
    flex: 1,
  },
  unreadBadge: {
    backgroundColor: palette.primary,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
    marginLeft: spacing.sm,
  },
  unreadText: {
    ...typography.secondary,
    color: palette.surface,
    fontSize: 12,
    fontWeight: '700',
  },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: palette.border,
    backgroundColor: palette.surface,
  },
  backButton: {
    padding: spacing.sm,
  },
  backButtonText: {
    ...typography.body,
    color: palette.primary,
  },
  chatHeaderTitle: {
    ...typography.subtitle,
    color: palette.text,
  },
  headerSpacer: {
    width: 60,
  },
  messagesContainer: {
    flex: 1,
    backgroundColor: palette.background,
  },
  messagesContent: {
    padding: spacing.md,
  },
  messageBubble: {
    maxWidth: '75%',
    marginBottom: spacing.md,
    padding: spacing.md,
    borderRadius: radius.card,
  },
  myMessage: {
    alignSelf: 'flex-end',
    backgroundColor: palette.primary,
  },
  theirMessage: {
    alignSelf: 'flex-start',
    backgroundColor: palette.surface,
    borderWidth: 1,
    borderColor: palette.border,
  },
  senderName: {
    ...typography.secondary,
    color: palette.textSecondary,
    marginBottom: 4,
  },
  messageText: {
    ...typography.body,
    marginBottom: 4,
  },
  myMessageText: {
    color: palette.surface,
  },
  theirMessageText: {
    color: palette.text,
  },
  messageTime: {
    ...typography.secondary,
    fontSize: 11,
  },
  myMessageTime: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  theirMessageTime: {
    color: palette.textTertiary,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: spacing.md,
    borderTopWidth: 1,
    borderTopColor: palette.border,
    backgroundColor: palette.surface,
    gap: spacing.sm,
  },
  input: {
    flex: 1,
    ...typography.body,
    backgroundColor: palette.background,
    borderWidth: 1,
    borderColor: palette.border,
    borderRadius: radius.button,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    maxHeight: 100,
    color: palette.text,
  },
  sendButton: {
    backgroundColor: palette.primary,
    borderRadius: radius.button,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    justifyContent: 'center',
  },
  sendButtonText: {
    ...typography.bodyBold,
    color: palette.surface,
  },
});
