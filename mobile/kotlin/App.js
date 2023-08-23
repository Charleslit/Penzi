import React, { useState, useEffect, useRef } from 'react';
import {
  StatusBar,
  StyleSheet,
  Text,
  View,
  Image,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const App = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const messageInput = useRef(null);
  const scrollViewRef = useRef(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

 
  const handlePhoneNumberSubmit = async () => {
    if (phoneNumber.trim().length !== 10) return;
    try {
      await AsyncStorage.setItem('phoneNumber', phoneNumber);
    } catch (error) {
      console.error('Failed to store phone number:', error);
    }
    setIsSubmitted(true);
  };

const handleMessage = async () => {
  if (message.trim() === '') return;

  const newMessage = {
    id: Date.now().toString(),
    content: message,
    sender: 'user',
  };

  setMessages(prevMessages => [...prevMessages, newMessage]);
  setMessage('');

  const payload = {
    message: message,
    msisdn: phoneNumber,
    shortCode: 42121,
    dateReceived: new Date().toISOString(), // Convert date to ISO string format
  };

  try {
    const response = await fetch("https://220a-197-248-224-74.ngrok-free.app/sms", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error('Failed to send message');
    }

    const data = await response.json();
    console.log(data);
    const receivedMessage = {
      id: Date.now().toString(),
      content: data,
      sender: 'server',
    };
    setMessages(prevMessages => [...prevMessages, receivedMessage]);
  } catch (error) {
    console.error(error);
    if (error.message === 'Failed to send message') {
      const errorMessage = {
        id: Date.now().toString(),
        content: 'Network request failed. Please check your internet connection.',
        sender: 'error',
      };
      setMessages(prevMessages => [...prevMessages, errorMessage]);
    } else {
      const errorMessage = {
        id: Date.now().toString(),
        content: 'Error occurred while sending the message: ' + error.message,
        sender: 'error',
      };
      setMessages(prevMessages => [...prevMessages, errorMessage]);
    }
  }
};

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedPhoneNumber = await AsyncStorage.getItem('phoneNumber');
    
        if (storedPhoneNumber) {
          setPhoneNumber(storedPhoneNumber);
          if (storedPhoneNumber.length < 10) {
            await AsyncStorage.removeItem('phoneNumber');
            setPhoneNumber('');
          } else {
            setPhoneNumber(storedPhoneNumber);
          }
        }

        const storedMessages = await AsyncStorage.getItem('messages');
        if (storedMessages) {
          setMessages(JSON.parse(storedMessages));
        }
      } catch (error) {
        console.error('Failed to retrieve data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const storeData = async () => {
      try {
        await AsyncStorage.setItem('messages', JSON.stringify(messages));
      } catch (error) {
        console.error('Failed to store messages:', error);
      }
    };

    storeData();
  }, [messages]);

  return (
    <SafeAreaView style={styles.container}>
      {!isSubmitted ?  (
        <View style={styles.phoneNumberInput}>
          <TextInput
            style={styles.phoneNumberInputField}
            placeholder="Type your phone number"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
          />
          <TouchableOpacity style={styles.submitButton} onPress={handlePhoneNumberSubmit}>
            <Text>Submit</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <KeyboardAvoidingView
          style={styles.chatContainer}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView
  ref={scrollViewRef}
  style={styles.messagesContainer}
  contentContainerStyle={styles.messagesContent}
>
  {messages.map(message => (
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
          <View style={styles.messageInputContainer}>
            <TextInput
              ref={messageInput}
              style={styles.messageInput}
              placeholder={phoneNumber}
              value={message}
              onChangeText={setMessage}
            />
            <TouchableOpacity style={styles.sendButton} onPress={handleMessage}>
              <Text style={styles.sendButtonText}>Send</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      )}
      <StatusBar style="auto" />
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  phoneNumberInput: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  phoneNumberInputField: {
    height: 40,
    width: '80%',
    backgroundColor: '#fff',
    paddingHorizontal: 8,
    borderRadius: 8,
    marginBottom: 16,
  },
  submitButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#007AFF',
    borderRadius: 8,
  },
  chatContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  message: {
    backgroundColor: '#DCF8C6',
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
  messageInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#fff',
  },
  messageInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
    paddingHorizontal: 8,
    backgroundColor: '#fff',
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

export default App;
