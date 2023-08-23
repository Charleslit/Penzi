 import { ImageBackground, StyleSheet, Text, View } from 'react-native'
 import React from 'react'
 
 function WelcomeScreen(props) {
  return (
    <ImageBackground
      styles={styles.background}
      source={require('../assets/pg.png')}
    ></ImageBackground>
  )
}

 
 const styles = StyleSheet.create({
background:{
    flex:1,
}

 })
 export default WelcomeScreen