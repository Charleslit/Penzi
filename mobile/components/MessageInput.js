import React from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, Text } from 'react-native';

const MessageInput = ({ message, setMessage, handleMessage, phoneNumber }) => {
  return (
    <View style={styles.messageInputContainer}>
      <TextInput
        style={styles.messageInput}
        placeholder={phoneNumber}
        value={message}
        onChangeText={setMessage}
      />
      <TouchableOpacity style={styles.sendButton} onPress={handleMessage}>
        <Text style={styles.sendButtonText}>Send</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  messageInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'transparent',
  },
  messageInput: {
    flex: 1,
    height: 20,
    fontSize: 16,
    paddingHorizontal: 8,
    backgroundColor: 'white',
    borderRadius: 8,
  },
  sendButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#007AFF',
    borderRadius: 8,
    marginLeft: 8,
  },
  sendButtonText: {
    fontSize: 16,
    color: '#fff',
  },
});

export default MessageInput;