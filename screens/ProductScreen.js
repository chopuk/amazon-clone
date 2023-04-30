import { View, Text, ScrollView, ActivityIndicator, StyleSheet } from 'react-native'
import React, { useState, useEffect } from 'react'
import QuantitySelector from '../components/QuantitySelector'
import CustomPicker from '../components/CustomPicker'
import Button from '../components/Button'
import ImageCarousal from '../components/ImageCarousal'
import { useNavigation, useRoute } from '@react-navigation/native'
import { db, auth } from '../firebase'
import { doc, addDoc, getDoc, collection, getDocs, where, query, updateDoc } from 'firebase/firestore'

const displayPrice = (price) =>{
    var formattedPrice = price.toFixed(2)
    return "£" + formattedPrice
}
export default function ProductScreen() {
  const [selectedOption, setSelectedOption] = useState('No Options')
  const [quantity,setQuantity] = useState(1)
  const [product,setProduct] = useState(null)
  const route = useRoute()
  const navigation = useNavigation()

  useEffect(() => {
    const getProduct = async () => {
      if (!route.params?.id) {
        return
      }
      const docRef = doc(db, 'products', route.params.id)
      const docSnapshot = await getDoc(docRef)
      setProduct({ ...docSnapshot.data(), id: docSnapshot.id })
    }

    getProduct()
   
  },[route.params?.id])

  useEffect(() => {
    if (product?.options) {
      setSelectedOption(product.options[0])
    }
  },[product])

  const AddToCart = async () => {
    const userCredentials = auth.currentUser
    // first check if this item is already in the cart
    let cartProductIDs = []
    // get cart items for logged in user
    const q = query(collection(db, 'cartitems'), where('userid', '==', userCredentials.uid ))
    const cartSnapshot = await getDocs(q)
    // check list of productids this user has in cart against the one we are adding
    let foundProduct = false
    let id = ''
    let newQty = quantity
    cartSnapshot.forEach((cartitem) => {
      if (cartitem.data().productid === product.productid) {
        foundProduct = true
        id = cartitem.id
        newQty = newQty + cartitem.data().quantity
      }
    })
    if (!foundProduct) {
      // okay, we can add a new cartitem
      const newCartItem = {
        userid: userCredentials.uid,
        quantity: quantity,
        option: selectedOption,
        productid: product.productid,
        title: product.title,
        price: product.price,
        image: product.image
      }
      await addDoc(collection(db, 'cartitems'), newCartItem)
    } else {
      // we need to update the quantity of the existing cart item
      const docRef = doc(db, 'cartitems', id)
      await updateDoc(docRef, {
        quantity: newQty
      }) 
    }
    navigation.navigate('Shopping Cart')
  }

  if (!product) {
    return <ActivityIndicator/>
  }
  
  return (
    <ScrollView style={styles.root}>
      <Text style={styles.title}>{product.title}</Text>
      <ImageCarousal images={product.images}/>
      <CustomPicker
        options={product.options ? product.options : []}
        selectedOption={selectedOption}
        setSelectedOption={setSelectedOption}
      />
      <View style={styles.priceDetails}>
        <Text style={styles.price}>{displayPrice(product.price)}</Text>
        { product.oldPrice &&
            <Text style={styles.oldPrice}>{displayPrice(product.oldPrice)}</Text> 
        }
      </View>
      <Text style={styles.description}>{product.description}</Text>
     <QuantitySelector
        quantity={quantity}
        setQuantity={setQuantity}
        quantityText='Quantity:'
      />
      <Button 
        buttonText='Add To Cart'
        buttonColour='orange'
        onPress={()=> AddToCart()}
      />
      <View style={styles.bottomPadding}></View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  root: {
    padding:10,
    backgroundColor:'white'
  },
  title: {
    fontWeight:'bold',
    fontSize:16
  },
  price: {
    fontSize:16,
    fontWeight:'bold'
  },
  oldPrice: {
    textDecorationLine:'line-through',
    marginLeft:10,
    fontSize:14
  },
  priceDetails: {
    flexDirection:'row',
    alignItems:'center',
    marginTop:5
  },
  description: {
    marginVertical:10
  },
  bottomPadding: {
    height:50
  }
})