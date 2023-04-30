import React, { useState, useEffect, useCallback } from 'react'
import { NavigationContainer, useFocusEffect, useNavigation } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import * as SecureStore from 'expo-secure-store'
import HomeScreen from './screens/HomeScreen'
import ProductScreen from './screens/ProductScreen'
import LoginScreen from './screens/LoginScreen'
import SignupScreen from './screens/SignupScreen'
import ShoppingCartScreen from './screens/ShoppingCartScreen'
import CustomerDetailsScreen from './screens/CustomerDetailsScreen'
import { Alert, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import AntDesign from 'react-native-vector-icons/AntDesign'

import { auth } from './firebase'
import { db } from './firebase'
import { getDocs,collection, query, where } from 'firebase/firestore'

const onSignOut = async () => {
  auth.signOut()
  await SecureStore.deleteItemAsync('credentials')
}

const onLogout = () => {
  Alert.alert(
    'Confirm',
    'Are You Sure You Want To Logout?',
    
    [
      {
        text: 'Yes',
        onPress: () => onSignOut()
      },
      {
        text: 'No'
      }
    ],
    {
      cancelable: true
    }
  )
}

const Stack = createNativeStackNavigator()

const HomeScreenHeader = () => {
  const navigation = useNavigation()
  const [cartExists,setCartExists] = useState(false)

  useFocusEffect(
    useCallback(() => {
      const fetchCartDetails = async() => {
        let cartProductIDs = []
        const userCredentials = auth.currentUser
        const q = query(collection(db, 'cartitems'), where('userid', '==', userCredentials.uid ))
        const cartSnapshot = await getDocs(q)
        cartSnapshot.forEach((cartitem) => {
          cartProductIDs.push(cartitem.data().productid)
        })
  
        if (cartProductIDs.length > 0 ) {
          setCartExists(true)
        } else {
          setCartExists(false)
        }
      }
  
      fetchCartDetails()
    },[])
  )

  
  // useEffect(() => {
  //   const fetchCartDetails = async() => {
  //     let cartProductIDs = []
  //     const userCredentials = auth.currentUser
  //     const q = query(collection(db, 'cartitems'), where('userid', '==', userCredentials.uid ))
  //     const cartSnapshot = await getDocs(q)
  //     cartSnapshot.forEach((cartitem) => {
  //       cartProductIDs.push(cartitem.data().productid)
  //     })

  //     if (cartProductIDs.length > 0 ) {
  //       setCartExists(true)
  //     } else {
  //       setCartExists(false)
  //     }
  //   }

  //   fetchCartDetails()

  // },[])

  return (
    <SafeAreaView style={{backgroundColor: '#f4511e'}}>
      <View style={{flexDirection:'row', justifyContent:'space-between',alignItems:'center',height:55,marginHorizontal:20}}>
        <Text style={{fontSize:21}}>Product List</Text>
        <View style={{flexDirection:'row'}}>
          <TouchableOpacity onPress={()=> navigation.navigate('Shopping Cart')}>
              {cartExists &&
                <AntDesign name="shoppingcart" size={21} 
                    style={{color: 'black',marginLeft:15}} 
                />
              }
          </TouchableOpacity>
          <TouchableOpacity onPress={onLogout}>
              <AntDesign name="logout" size={21} 
                  style={{color: 'black',marginLeft:15}} 
              />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  )
}

const screenOptions = {
  headerShown: true,
  headerTitleAlign: 'center',
  headerStyle: {
    backgroundColor: '#f4511e',
  }
}

const homeScreenOptions = {
  header: () => (
    <HomeScreenHeader/>
  )
}

const SignedInStack = () => (
  <NavigationContainer>
      <Stack.Navigator
          initialRouteName='HomeScreen'
          screenOptions={screenOptions}
      >
        <Stack.Screen name='Product List' component={HomeScreen} options={homeScreenOptions} />
        <Stack.Screen name='Product Details' component={ProductScreen} />
        <Stack.Screen name='Shopping Cart' component={ShoppingCartScreen} />
        <Stack.Screen name='Customer Details' component={CustomerDetailsScreen} />
      </Stack.Navigator>
  </NavigationContainer>
)

const SignedOutStack = () => (
  <NavigationContainer>
      <Stack.Navigator
          initialRouteName='LoginScreen'
          screenOptions={screenOptions}
      >
        <Stack.Screen name='Welcome' component={LoginScreen} />
        <Stack.Screen name='SignupScreen' component={SignupScreen} />
      </Stack.Navigator>
  </NavigationContainer>
)

export { SignedInStack, SignedOutStack }