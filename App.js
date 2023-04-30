import React, { useEffect, useState } from 'react'
import { StatusBar } from 'expo-status-bar'
import { Alert } from 'react-native'
import ENVIRONMENT from './environment/environment'
import * as SplashScreen from 'expo-splash-screen'
import AuthNavigation from './AuthNavigation'
import * as SecureStore from 'expo-secure-store'
import { StripeProvider } from '@stripe/stripe-react-native'
import { auth } from './firebase'
import { signInWithEmailAndPassword } from 'firebase/auth'

// keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync()

export default function App() {

  // display the splash screen for 1 second...
  setTimeout(async () => {
    await SplashScreen.hideAsync()
  }, 2000)

  const [secureKeys,setSecureKeys] = useState()

  useEffect(() => {

    const fetchSecureKeys = async () => {

      const appName = 'My Beaugtiful App'
      // sending request
      const response = await fetch(
        `${ENVIRONMENT.URL_PREFIX}/getkeys`, {
        method: "POST",
        body: JSON.stringify({appName}),
        headers: {
          "Content-Type": "application/json",
        }
      })
      const data = await response.json()
      
      if (!response.ok) return Alert.alert(data.message)
      setSecureKeys(data)
    }

    //fetchSecureKeys()

  }, [])

  useEffect(
    () => {
      async function checkStorageCredentials() {
        try {
          const storedCredentials = await SecureStore.getItemAsync('credentials')
          if (storedCredentials) {
            const mycredentials = JSON.parse(storedCredentials)
            await signInWithEmailAndPassword(auth, mycredentials.email,mycredentials.password)
          }
        } catch (error) {
            console.log(error)
        }
      }
      checkStorageCredentials()
    },
    []
)

return (
  <>
    <StatusBar barStyle = 'light-content' hidden ={false} backgroundColor = '#1e5f6b' translucent ={true}/>
    <StripeProvider publishableKey='pk_test_maRtZ2uTPZf2XpvUfAMCDcDd'>
      <AuthNavigation/>
    </StripeProvider>
  </>
)
}
