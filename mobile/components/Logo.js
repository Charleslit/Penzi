import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

const Logo = ({ imageSource }) => {
  return (
    <View style={styles.container}>
      <Image source={require("../app/assets/icon.png")} style={styles.logoImage} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  logoImage: {
    width: 100,
    height: 100,
    position:"absolute",
    top:10,
    left:10,
  },
});

export default Logo;