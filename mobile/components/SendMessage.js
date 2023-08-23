import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, StyleSheet } from 'react-native';

const RoomScreen = () => {
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    // Fetch room data from an API or any other source
    const fetchRooms = async () => {
      try {
        const response = await fetch('http://localhost:5000/sms');
        const data = await response.json();
        setRooms(data);
      } catch (error) {
        console.error('Error fetching rooms:', error);
      }
    };

    fetchRooms();
  }, []);

  const handleMessage = async (roomId, message) => {
    // Find the room in the rooms array based on the roomId
    const updatedRooms = rooms.map((room) => {
      if (room.id === roomId) {
        const newMessage = {
          id: Date.now().toString(),
          content: message,
          sender: 'user',
        };
        const updatedRoom = { ...room, messages: [...room.messages, newMessage] };
        return updatedRoom;
      }
      return room;
    });

    setRooms(updatedRooms);

    // Rest of your message sending logic
  };

  const handleDeleteMessage = (roomId, messageId) => {
    const updatedRooms = rooms.map((room) => {
      if (room.id === roomId) {
        const updatedMessages = room.messages.filter((message) => message.id !== messageId);
        const updatedRoom = { ...room, messages: updatedMessages };
        return updatedRoom;
      }
      return room;
    });

    setRooms(updatedRooms);
  };

  return (
    <View style={styles.container}>
      {rooms.map((room) => (
        <View key={room.id} style={styles.roomContainer}>
          <Text style={styles.roomTitle}>{room.name}</Text>
          <FlatList
            data={room.messages}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.messageContainer}>
                <Text style={styles.messageText}>{item.sender}: {item.content}</Text>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDeleteMessage(room.id, item.id)}
                >
                  <Text style={styles.deleteButtonText}>Delete</Text>
                </TouchableOpacity>
              </View>
            )}
          />
          <TextInput
            style={styles.messageInput}
            placeholder="Type a message..."
            onChangeText={(text) => handleMessage(room.id, text)}
          />
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  roomContainer: {
    marginBottom: 16,
  },
  roomTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  messageText: {
    flex: 1,
    fontSize: 16,
  },
  deleteButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#ff0000',
    borderRadius: 4,
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  messageInput: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 8,
  },
});

export default RoomScreen;