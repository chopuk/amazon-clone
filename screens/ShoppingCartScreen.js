import { View, StyleSheet, ScrollView, FlatList, Text } from 'react-native'
import React, { useState, useCallback } from 'react'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import CartItemComponent from '../components/CartItemComponent'
import Button from '../components/Button'
import { db, auth } from '../firebase'
import { getDocs, collection, query, where } from 'firebase/firestore'

const displayPrice = (price) =>{
  var formattedPrice = price.toFixed(2)
  return formattedPrice
}

const ShoppingCartScreen = () => {
  const [cartItems,setCartItems] = useState([])
  const [refresh,setRefresh] = useState(false)
  const navigation = useNavigation()

  useFocusEffect(
    useCallback(() => {
       const fetchCartItems = async() => {
        let cartitems = []
        let cartProductIDs = []
        // get cart items for logged in user
        const userCredentials = auth.currentUser
        const q = query(collection(db, 'cartitems'), where('userid', '==', userCredentials.uid ))
        const cartSnapshot = await getDocs(q)
        // get list of productids this user has in cart
        cartSnapshot.forEach((cartitem) => {
          cartProductIDs.push(cartitem.data().productid)
        })
        if (cartProductIDs.length > 0 ) {
          // access all products in this cart by productid
          const qry = query(collection(db, 'products'), where('productid', 'in', cartProductIDs))
          const productSnapshot = await getDocs(qry)
          cartSnapshot.forEach((cartitem) => {
            let description
            let avgRating
            productSnapshot.forEach((product) => {
              if (cartitem.data().productid === product.data().productid ) {
                description = product.data().description
                avgRating = product.data().avgRating
              }
            })
            // concatentate cartitem data and product data to one object
            cartitems.push({ ...cartitem.data(), id: cartitem.id, description: description, avgRating: avgRating })
          })
          setCartItems(cartitems)
        }
      }
      fetchCartItems()
    },[refresh]) // This refresh toggle will refresh the cartItems when the quantity is changed on the CartItemCompnent.
  )              // This is so that the Subtotal value will get updated on this page

  // use map for total
  const totalPriceMap = () => {
    let total = 0
    cartItems.map((cartItem) => (
      total = total + (cartItem.price * cartItem.quantity)
    ))
    return displayPrice(total)
  }
  // use reduce for total - will need to add the displayPrice to the TSX for this one
  const totalPriceReduce = cartItems.reduce(
    (total,cartItem) =>
      total = total + (cartItem.price * cartItem.quantity),0
  )

  const doRefresh = () => setRefresh(!refresh)

  return (
    <View style={styles.page}>
      <View>
        <Text style={styles.header}>
          Subtotal ({cartItems.length} items) : 
          <Text style={{color: '#db6435',fontWeight:'bold'}}> £{totalPriceMap()}</Text>
        </Text>
        {/* <Text style={styles.header}>
          Subtotal ({cartItems.length} items) : 
          <Text style={{color: '#db6435',fontWeight:'bold',}}> £{displayPrice(totalPriceReduce)}</Text>
        </Text> */}
      </View>
      <Button
        buttonText='Proceed To Checkout'
        buttonColour='orange'
        onPress={() => navigation.navigate('Customer Details',{totalPriceReduce})}
      />
      <Button
        buttonText='Continue Shopping'
        buttonColour='blue'
        onPress={() => navigation.navigate('Product List')}
      />
      {/* I need this height to make the scrolling work properly */}
      {/* The height takes into account the TSX elements above the flatlist */}
      {/* If they are removed the height is'nt need. Quirky thins this. */}
      <View style={{height:'78%'}}>
        <FlatList
          data={cartItems}
          renderItem={({item}) => (
              <CartItemComponent cartItem={item} refresh={doRefresh}/>
          )}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </View>
  )
}

export default ShoppingCartScreen

const styles = StyleSheet.create({
  page: {
    padding:5
  },
  header: {
    marginLeft:10,
    fontSize:16
  },
  bottomPadding: {
    height:100
  }
})