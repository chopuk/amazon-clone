import React, { useEffect, useState } from 'react'
import { StatusBar } from 'expo-status-bar'
import { Alert, Button, StyleSheet, Text, View } from 'react-native'
import ENVIRONMENT from './environment'
import * as SplashScreen from 'expo-splash-screen'

// keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync()

export default function App() {

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

    fetchSecureKeys()

  }, [])

  // display the splash screen for 1 second...
  setTimeout(async () => {
    await SplashScreen.hideAsync()
  }, 2000)

  const amit = () => {
    Alert.alert('Model: ' + secureKeys?.name)
  }

  return (
    <View style={styles.container}>
      <Button
        title="Press me"
        onPress={() => amit()}
      />
      <StatusBar style="auto" />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  }
})
