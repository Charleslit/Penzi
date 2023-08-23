import React, { useState, useEffect, useRef } from 'react';
import {
  Text,
  StatusBar,
  StyleSheet,
  SafeAreaView,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import PhoneNumberInput from '../components/PhoneNumberInput';
import ChatContainer from '../components/ChatContainer';
import MessageInput from '../components/MessageInput';

const Home = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const scrollViewRef = useRef();

  useEffect(() => {
    const loadMessages = async () => {
      try {
        const savedMessages = await AsyncStorage.getItem('messages');
        if (savedMessages) {
          setMessages(JSON.parse(savedMessages));
        }
      } catch (error) {
        console.log('Error loading messages:', error);
      }
    };

    if (isSubmitted) {
      loadMessages();
    }
  }, [isSubmitted]);

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
      const url="http://192.168.5.126:5000/sms"
      const response = await fetch("http://192.168.5.126:5000/sms", {
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
    // Rest of your message sending logic
  };

  const handlePhoneNumberSubmit = async () => {
    if (phoneNumber.trim().length !== 10) return;

    try {
      await AsyncStorage.setItem('phoneNumber', phoneNumber);
    } catch (error) {
      console.error('Failed to store phone number:', error);
    }
    setIsSubmitted(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      {!isSubmitted ? (
        <>
          <Text>hello</Text>
          <PhoneNumberInput
            phoneNumber={phoneNumber}
            setPhoneNumber={setPhoneNumber}
            handlePhoneNumberSubmit={handlePhoneNumberSubmit}
          />
        </>
      ) : (
        <>
          <ChatContainer messages={messages} scrollViewRef={scrollViewRef} />
          <MessageInput
            message={message}
            setMessage={setMessage}
            handleMessage={handleMessage}
            phoneNumber={phoneNumber}
          />
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

export default Home;
