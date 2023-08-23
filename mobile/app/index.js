import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Logo from '../components/Logo';

const Dashboard = ({ totalUsers, revenue, onStartClick, onDeleteMessages }) => {
  const handleStartClick = () => {
    if (onStartClick) {
      onStartClick();
    }
  };

  const handleDeleteMessages = () => {
    if (onDeleteMessages) {
      onDeleteMessages();
    }
  };

  return (
    <View style={styles.container}>
      <Logo />
      <Text style={styles.title}>Penzi</Text>
      <View style={styles.cardContainer}>
        <Text>Click start to connect with more people</Text>
        <TouchableOpacity style={styles.card1} onPress={handleDeleteMessages}>
          <Text style={styles.cardTitle}>Start Over</Text>
        </TouchableOpacity>
        <Text></Text>
        <TouchableOpacity style={styles.card1} onPress={handleStartClick}>
          <Text style={styles.cardTitle}>Continue</Text>
        </TouchableOpacity>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Total Users</Text>
          <Text style={styles.cardValue}>{totalUsers}</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Recent Matches</Text>
          <Text style={styles.cardValue}>{revenue}</Text>
        </View>
          <Text>Save a match by sending the word save </Text>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Saved Matches</Text>
          <Text style={styles.cardValue}>{totalUsers}</Text>
        </View>
        
      
        {/* Rest of your code */}
      </View>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  cardContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  card: {
    width: '48%',
    height: 120,
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  cardValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  card1:{
    
    backgroundColor:"blue",
    borderRadius: 8,
    width: '46%',
    height: 70,
    alignItems: 'center',
    fontSize: 50,
    fontStyle:"italic",
    justifyContent: 'center',
  }
});

export default Dashboard;