import { Text, Pressable, StyleSheet } from 'react-native'
import React from 'react'
import { LinearGradient } from 'expo-linear-gradient'

const ORANGE = ['#dfe835', '#e8c635', '#e89b35', '#e84535']
const BLUE = ['#35e8e8','#35c0e8','#359ae8','#353fe8']
const GREEN = ['#35e8b2','#35e880','#43b327','#43912f']
const GREY = ['#b2b1bb','#8b8b93','#64646c','#525157']

const Button = (props) => {
  const { buttonText, onPress, textColour, buttonColour, buttonWidth, disabled } = props

  const color = () => {
    switch (buttonColour) {
      case 'orange':
        return ORANGE
        break
      case 'blue':
        return BLUE
        break
      case 'green':
        return GREEN
        break
      default:
        return GREY
        break
    }
  }

  return (
    <Pressable onPress={onPress} disabled={false}>
      <LinearGradient
          colors={color()}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 0}}
          style={[styles.pressable, {width:buttonWidth}]}>
            <Text style={[styles.text, {color:textColour}]}>{buttonText}</Text>
      </LinearGradient>
    </Pressable>
  )
}

const styles = StyleSheet.create({
    pressable: {
      marginVertical:10,
      height:35,
      justifyContent:'center',
      alignItems:'center',
      borderRadius:5
    },
    text: {
      fontWeight:'bold'
    }
})

export default Button