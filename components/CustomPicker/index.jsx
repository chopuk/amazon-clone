import { View, Text, TouchableOpacity, Modal, Dimensions, ScrollView } from 'react-native'
import React, { useState } from 'react'
import styles from './styles'
import FontAwesome from 'react-native-vector-icons/FontAwesome'

const WIDTH = Dimensions.get('window').width
const HEIGHT = Dimensions.get('window').height

export default function CustomPicker(props) {
  const { options,selectedOption,setSelectedOption,marginLeft,width } = props
  const [isModalVisible,setIsModalVisible] = useState(false)
  const onPressItem =(option) => {
    setIsModalVisible(false)
    setSelectedOption(option)
  }
  const option = options.map((item,index) => {
    return (
      <TouchableOpacity
        style={styles.option}
        key={index}
        onPress={() => onPressItem(item)}
      >
        <Text style={styles.textOption}>
          {item}
        </Text>
      </TouchableOpacity>
    )
  })
  return (
    <View>
      <TouchableOpacity
        onPress={() => setIsModalVisible(true)}
        style={[styles.touchableOpacity, 
          {marginLeft:marginLeft},
          {width: width ? width : 200}
        ]}
      >
        <Text style={styles.text}>{selectedOption}</Text>
        <View style={{position:'absolute', right:10}}>
           <FontAwesome 
            name={'sort-down'}
            size={25} 
          />
        </View>
      </TouchableOpacity>
      <Modal
        transparent={true}
        animationType='slide'
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <TouchableOpacity
          onPress={() => setIsModalVisible(false)}
          style={styles.modelContainer}
        >
          <View style={[styles.modal, {width:WIDTH -20, height: HEIGHT / 2}]}>
            <ScrollView>
              {option}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  )
}