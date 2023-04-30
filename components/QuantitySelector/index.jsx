import { View, Text, Pressable } from 'react-native'
import React from 'react'
import styles from './styles'

export default function QuantitySelector(props) {
  const {quantity,setQuantity,quantityText} = props
  const onPlus = () => {
    setQuantity(quantity+1)
  }
  const onMinus = () => {
      setQuantity(Math.max(0,quantity-1))
  }

  return (
    <View style={styles.root}>
      <View style={styles.componentGroup}>
        {quantityText && <Text style={styles.text}>{quantityText}</Text>}
        <Pressable style={styles.button} onPress={onMinus}>
          <Text style={styles.buttonText}>-</Text>
        </Pressable>
        <View style={styles.quantity}>
          <Text style={styles.quantityText}>{quantity}</Text>
        </View>
        <Pressable style={styles.button} onPress={onPlus}>
          <Text style={styles.buttonText}>+</Text>
        </Pressable>
      </View>
    </View>
  )
}