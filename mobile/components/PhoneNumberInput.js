import React from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, Text } from 'react-native';

const PhoneNumberInput = ({ phoneNumber, setPhoneNumber, handlePhoneNumberSubmit }) => {
  return (
    <View style={styles.phoneNumberInput}>
      {/* <Text>Enter in the format 07xxxxxxxx</Text> */}
      <TextInput
        style={styles.phoneNumberInputField}
        placeholder="Enter number in the format 07xxxxxxxx"
        keyboardType = 'numeric'
        value={phoneNumber}
        onChangeText={setPhoneNumber}
      />
      <TouchableOpacity style={styles.submitButton} onPress={handlePhoneNumberSubmit}>
        <Text>Submit</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
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
});

export default PhoneNumberInput;