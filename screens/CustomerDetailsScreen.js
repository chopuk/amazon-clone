import { View, Text, Dimensions, TextInput, ScrollView, KeyboardAvoidingView, Alert, StyleSheet } from 'react-native'
import React, { useState, useEffect } from 'react'
import { useNavigation, useRoute } from '@react-navigation/native'
import CustomPicker from '../components/CustomPicker'
import countryList from 'country-list'
import Button from '../components/Button'
import { Platform } from 'react-native'
import { db } from '../firebase'
import { deleteDoc, setDoc, addDoc, getDocs, getDoc, collection, query, where, doc, onSnapshot } from 'firebase/firestore'
import ENVIRONMENT from '../environment/environment'
import { useStripe } from '@stripe/stripe-react-native'
import ValidateField from '../Utilities/ValidateField'
import { auth } from '../firebase'

const countries = countryList.getNames()
const validateAllFields = ['fullName','address','city']

const CustomerDetailsScreen = () => {
  const navigation = useNavigation()
  const [selectedCountry, setSelectedCountry] = useState( 'Select Country...')
  const [fullName,setFullName] = useState('')
  const [phoneNumber,setPhoneNumber] = useState('')
  const [address,setAddress] = useState('')
  const [city,setCity] = useState('')

  const [addressError,setAddressError] = useState('')
  const [fullNameError,setFullNameError] = useState('')
  const [cityError,setCityError] = useState('')
  const [loading, setLoading] = useState(false)
  const route = useRoute()
  const formattedPrice = route.params.totalPriceReduce.toFixed(2)
  const amount = formattedPrice * 100
  //const stripe = useStripe()
  const { initPaymentSheet, presentPaymentSheet } = useStripe()

  useEffect(() => {
    const fetchUserDetails = async() => {
      const userCredentials = auth.currentUser
      const docRef = doc(db, 'users', userCredentials.uid)
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        const userData = docSnap.data()
        setCity(userData.city)
        setFullName(userData.fullname)
        setPhoneNumber(userData.phonenumber)
        setAddress(userData.address)
        setSelectedCountry(userData.country)
      } 
    }

    fetchUserDetails()

  },[])

  const fetchPaymentIntent = async () => {
      const userCredentials = auth.currentUser
      const email = userCredentials.email
      // sending request
      const response = await fetch(
        `${ENVIRONMENT.URL_PREFIX}/paymentintent`, {
        method: "POST",
        body: JSON.stringify({amount,email}),
        headers: {
          "Content-Type": "application/json",
        }
      })
      const data = await response.json()
      if (!response.ok) return Alert.alert(data.message)
      const clientSecret = data.clientSecret

      const { error } = await initPaymentSheet({
        merchantDisplayName: 'Big Chopper Computers',
        paymentIntentClientSecret: clientSecret
      })
      if (!error) {
        setLoading(true)
      }
  }

  const openPaymentSheet = async () => {
    const { error } = await presentPaymentSheet()

    if (error) {
      Alert.alert(`Error code: ${error.code}`, error.message)
    } else {
      saveOrder()
    }
  }

  const validateInput = (fieldnames) => {
    let isValidForm = true
    let result
    fieldnames.map((fieldname) => {
      switch (fieldname) {
        case 'address':
          result = new ValidateField(address).minlength(4).maxlength(20).result()
          isValidForm = result.isValid
          setAddressError(result.message)
          break
        case 'fullName':
          result = new ValidateField(fullName).minlength(3).maxlength(20).result()
          isValidForm = result.isValid
          setFullNameError(result.message)
          break
        case 'city':
          result = new ValidateField(city).minlength(2).maxlength(20).result()
          isValidForm = result.isValid
          setCityError(result.message)
        default:
          break
      }
    })
    return isValidForm
  }

  const saveOrder = async () => {

    const userCredentials = auth.currentUser

    // add user data first if needed
    const newUserDetails = {
      fullname: fullName,
      phonenumber: phoneNumber,
      address: address,
      city: city,
      country: selectedCountry

    }
    const usersRef = doc(db, 'users', userCredentials.uid)
    await setDoc((usersRef), newUserDetails)

    // create new order
    const newOrder = {
      userid: userCredentials.uid,
      fullname: fullName,
      phonenumber: phoneNumber,
      address: address,
      city: city,
      country: selectedCountry,
      orderPrice: formattedPrice,
      timestamp: new Date()
    }
    const OrderRef = await addDoc(collection(db, 'orders'), newOrder)

    // fetch all cart items
    const q = query(collection(db, 'cartitems'), where('userid', '==', userCredentials.uid ))
    const cartSnapshot = await getDocs(q)
    let cartItems = []
    cartSnapshot.forEach((item) => {
      cartItems.push({ ...item.data(), id: item.id })  
    })

    // attach cart items to order ( using subcollection )
    const orderLineRef = collection(db, 'orders', OrderRef.id, 'orderline')
    await Promise.all (
      cartItems.map(item => addDoc((orderLineRef), item))
    )

    // delete all cart items now they are on the order
    await Promise.all(
      cartItems.map(item => deleteDoc(doc(db, 'cartitems', item.id)))
    )

    // return home with appropriate message
    Alert.alert('Success!','Your Order has been successfully processed', [{text: 'OK', onPress: () => navigation.navigate('Product List')}])

  }

  const onCheckout = () => {
    const isValidForm = validateInput(validateAllFields)
    if (isValidForm) {
      openPaymentSheet()
    }
  }

  useEffect(() => {
    fetchPaymentIntent()
  }, [])

  return (
    <ScrollView style={{height: '90%'}}>
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView>
        <View style={styles.root}>
          <View style={styles.row}>
            <CustomPicker
              options={countries}
              selectedOption={selectedCountry}
              setSelectedOption={setSelectedCountry}
              width={Dimensions.get('window').width-20}
            />
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Full Name (First and Last name)</Text>
            <TextInput 
              style={styles.input} 
              value={fullName}
              onChangeText={text => {
                setFullName(text)
                setFullNameError('')
              }}
              onEndEditing={() => {
                validateInput(['fullName'])
              }}
            />
          </View>
          {fullNameError &&
            <Text style={styles.errorText}>{fullNameError}</Text>
          }
          <View style={styles.row}>
            <Text style={styles.label}>Phone Number</Text>
            <TextInput 
              style={styles.input} 
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              keyboardType='phone-pad'
            />
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Address</Text>
            <TextInput 
              style={styles.input} 
              value={address}
              onChangeText={text => {
                setAddress(text)
                setAddressError('')
              }}
              onEndEditing={() => {
                validateInput(['address'])
              }}
            />
          </View>
          {addressError &&
            <Text style={styles.errorText}>{addressError}</Text>
          }
          <View style={styles.row}>
            <Text style={styles.label}>City</Text>
            <TextInput 
              style={styles.input} 
              value={city}
              onChangeText={text => {
                setCity(text)
                setCityError('')
              }}
              onEndEditing={() => {
                validateInput(['city'])
              }}
            />
          </View>
          {cityError &&
            <Text style={styles.errorText}>{cityError}</Text>
          }
          <Button
            buttonText='Continue To Payment'
            buttonColour='blue'
            disabled={!loading}
            onPress={() => onCheckout()}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
    root: {
      paddingHorizontal:10,
      paddingTop:30
    },
    row: {
  
      backgroundColor:'white'
    },
    label: {
      fontWeight:'bold',
      marginTop:20
    },
    input: {
      borderWidth:1,
      borderColor:'lightgrey',
      borderRadius:5,
      marginVertical:10,
      height:38,
      paddingLeft:7
    },
    errorText: {
      color: 'red',
      fontSize:14
    }
  })

export default CustomerDetailsScreen



// MY TESTING AREA......
////////////////////////////////////////////////////////////////////////////

    // this works to get one order
    // const docRef = doc(db, 'myorders', 'RJHFscXd4XgpM95j8Dqp')
    // const docSnapshot = await getDoc(docRef)
    // console.log(docSnapshot.data())

    // this works - gets all order lines
    // const docRef = collection(db, '/myorders/sU8agqF6bLGh5lDa9gnq/myorderline')
    // const docSnapshot = await getDocs(docRef)
    // docSnapshot.forEach((doc) => {
    //   console.log(doc.data())
    // })

    // this works to get order lines using onSnapshot instead
    // Note: snapshots are updated in real time
    // const snapRef = collection(db, "/myorders/" + "sU8agqF6bLGh5lDa9gnq" + "/myorderline")
    // onSnapshot(snapRef, (snapshot) => {
    //   snapshot.forEach((doc) => {
    //       console.log(doc.data())
    //   })
    // })

    //this works - add order but with a generated id
    // const ordersRef = collection(db, 'myorders')
    // await addDoc((ordersRef), {
    //   name: 'Golden Gate Bridge',
    //   type: 'bridge'
    // })

    //this works - add order with my own id
    // const ordersRef = doc(db, 'myorders', 'AmitsOrder')
    // await setDoc((ordersRef), {
    //   name: 'Golden Gate Bridge',
    //   type: 'bridge'
    // })

    //this works - add order line but with a generated id
    // const ordersRef = collection(db, 'myorders', 'sU8agqF6bLGh5lDa9gnq', 'myorderline')
    // await addDoc((ordersRef), {
    //   name: 'Golden Gate Bridgeeeeeeee',
    //   type: 'bridge'
    // })

    //this works - add order line with my own id
    // const ordersRef = doc(db, 'myorders', 'sU8agqF6bLGh5lDa9gnq', 'myorderline', 'lineitem666')
    // await setDoc((ordersRef), {
    //   name: 'chelsea',
    //   type: 'stamford bridge'
    // })

    // delete collection member - does not delete subcollections
    //await deleteDoc(doc(db, 'myorders', 'fred'))

    // delete subcollection member
    //await deleteDoc(doc(db, 'myorders/order001/orderline', '2c46rI32xIefLshECKkv'))

    //delete collection with subcollections
    // const docRef = collection(db, '/myorders/order001/orderline')
    // const docSnapshot = await getDocs(docRef)
    // let items = []
    // docSnapshot.forEach((doc) => {
    //   items.push({ ...doc.data(), id: doc.id })
    // })
    // items.map((item) => {
    //   console.log(item.id)
    // })
    // await Promise.all(
    //   items.map(item => deleteDoc(doc(db, 'myorders/order001/orderline', item.id)))
    // )
    // await deleteDoc(doc(db, 'myorders', 'order001'))


    ///////////////////////////////////////////////////////////////////////////////
