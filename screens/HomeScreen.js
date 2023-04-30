import { View, StyleSheet, ScrollView, FlatList } from 'react-native'
import React, { useState, useEffect } from 'react'
import ProductItem from '../components/ProductItem'
import { db } from '../firebase'
import { collection, getDocs } from 'firebase/firestore'

const HomeScreen = () => {
  const [products, setProducts] =  useState([])

  useEffect(() => {
    const fetchProducts = async() => {
      let products = []
      const querySnapshot = await getDocs(collection(db, 'products'))
      querySnapshot.forEach((doc) => {
        products.push({ ...doc.data(), id: doc.id })
      })
      setProducts(products)
    }

    fetchProducts()

  },[])

  return (
    <View style={styles.page}>
      {/* <ScrollView>
        {products.map((item,index) =>
          <ProductItem item={item} />
        )}
      </ScrollView> */}   
      {/* The ScrollView above does the same thing as the FlatList below    */}
      {/* but less efficiently for big lists.                               */}
      {/* Also FlatList incorporates it's own builtin ScrollView            */}
      <FlatList
        data={products}
        renderItem={({item}) => <ProductItem item={item} />}
        showsVerticalScrollIndicator={false}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  page: {
    padding:5
  }
})

export default HomeScreen