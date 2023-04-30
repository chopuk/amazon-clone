import { View, Text, Image, Pressable } from 'react-native'
import React, { useState, useEffect } from 'react'
import { useNavigation } from '@react-navigation/native'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import styles from './styles'
import { ref, getDownloadURL, getStorage  } from 'firebase/storage'

const displayPrice = (price) =>{
  var formattedPrice = price.toFixed(2)
  return "£" + formattedPrice
}

export default function ProductItem(props) {
  const {id,title,image,avgRating,ratings,price,oldPrice} = props.item
  const navigation = useNavigation()
  const showDetails = () => {
    navigation.navigate('Product Details', {id: id})
  }
  const [imageURL,setImageURL] = useState('amit')

  useEffect(() => {
    const getImageURL = async() => {
      const storage = getStorage()
      const storageRef = ref(storage, `computer/${image}`)
      const url = await getDownloadURL(storageRef)
      setImageURL(url)
    }

    getImageURL()
  },[])

  return (
    <Pressable onPress={showDetails} style={styles.root}>
    <Image
      style={styles.image}
      source={{uri: imageURL}}
    />
    <View style={styles.rightContainer}>
      <Text style={styles.title} numberOfLines={3}>{title}</Text>
      <View style={styles.ratingsContainer}>
        {[1,2,3,4,5].map((value,index) => 
          <FontAwesome 
            key={`${id} - ${index}`}
            name={index < Math.floor(avgRating) ? 'star' : 'star-o'}
            size={16} 
            color={'#e47911'}
          />)
        }
          <Text style={styles.noOfRatings}>{ratings}</Text>
      </View>
      <View style={styles.priceDetails}>
        <Text style={styles.price}>{displayPrice(price)}</Text>
        { oldPrice &&
            <Text style={styles.oldPrice}>{displayPrice(oldPrice)}</Text> 
        }
      </View>
    </View>
  </Pressable>
  )
}