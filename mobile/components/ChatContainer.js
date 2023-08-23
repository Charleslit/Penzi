import React from 'react';
import { StyleSheet, View, ScrollView, Text } from 'react-native';

const ChatContainer = ({ messages }) => {
  return (
    <View style={styles.chatContainer}>
      <ScrollView
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
      >
        {messages.map((message) => (
          <View
            key={message.id}
            style={[
              styles.message,
              message.sender === 'user' ? styles.userMessage : styles.serverMessage,
            ]}
          >
            <Text style={styles.messageText}>{message.content}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  chatContainer: {
    flex: 1,
    backgroundColor: 'grey',
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  message: {
    backgroundColor: 'green',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 8,
    alignSelf: 'flex-start',
    maxWidth: '80%',
  },
  messageText: {
    fontSize: 16,
    color: '#000',
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#007AFF',
  },
  serverMessage: {
    alignSelf: 'flex-start',
  },
});

export default ChatContainer;