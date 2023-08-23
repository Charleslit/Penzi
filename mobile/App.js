import React from 'react';
import { View, StyleSheet, Text, SafeAreaView } from 'react-native';
import Dashboard from './app/index';
import Home from './app/Home';
import AsyncStorage from '@react-native-async-storage/async-storage';

const App = () => {
  const totalUsers = 1;
  const revenue = 3;
 // Initialize as true



  const [showHome, setShowHome] = React.useState(false);

  const handleDeleteMessages = () => {
    try {
      const savedMessages = AsyncStorage.getItem('messages');
      if(savedMessages){
        AsyncStorage.removeItem('messages');
      }
      setShowHome(true);
     
    } catch (error) {
      console.error('Failed to delete messages:', error);
    }
  };
  const handleStartClick = () => {
    setShowHome(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      {!showHome ? (
        <>
        
        <Dashboard totalUsers={totalUsers} revenue={revenue} 
        onStartClick={handleStartClick}
        
        onDeleteMessages={handleDeleteMessages}
        />
        </>
      ) : (
        <Home />
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

export default App;