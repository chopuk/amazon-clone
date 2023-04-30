import { View, TextInput, StyleSheet, Text, Pressable, TouchableOpacity, Alert } from 'react-native'
import React, { useState } from 'react'
import * as SecureStore from 'expo-secure-store'
import ValidateField from '../../Utilities/ValidateField'
import { auth } from '../../firebase'
import { signInWithEmailAndPassword,sendPasswordResetEmail } from 'firebase/auth'

const validateAllFields = ['email','password']

const LoginForm = ({navigation}) => {

  const validateInput = (fieldnames) => {
    let isValidForm = true
    let result
    fieldnames.map((fieldname) => {
        switch (fieldname) {
        case 'email':
            result = new ValidateField(email).isEmail().maxlength(30).result()
            isValidForm = result.isValid
            setEmailError(result.message)
            break
        case 'password':
            result = new ValidateField(password).minlength(6).maxlength(10).result()
            isValidForm = result.isValid
            setPasswordError(result.message)
            break
        default:
            break
        }
    })
    return isValidForm
  }

  const onSubmit = () => {
    const isValidForm = validateInput(validateAllFields)
    if (isValidForm) {
      tryLogin()
    }
  }

  const onPasswordForgotten = () => {
    setForgotPassword(true)
  }

  const onRequestReset = async () => {
    try {
      const isValidForm = validateInput(['email'])
      if (isValidForm) {
        await sendPasswordResetEmail(auth,email)
        Alert.alert('Reset Request Accepted','You have been sent an email with details to reset your password.')
        setEmailError('')
        setForgotPassword(false)
      }
    } catch (error) {
        console.log(error)
    }
  }
 
  const tryLogin = async() => {
    try {
        await signInWithEmailAndPassword(auth, email, password)
        const userCredentials = auth.currentUser
        // see if we need to save the credentials to storage for next time
        if(saveCredentials) {
            const credentials = {
                email: email,
                password: password
            }
            try {
                await SecureStore.setItemAsync('credentials', JSON.stringify(credentials))
            } catch (error) {
                console.log(error)
            }
        }
    } catch (error) {
      Alert.alert('Firebase Error',error.message)
    }
  }

  const [saveCredentials, setSaveCredentials] = useState(false)
  const [email, setEmail] = useState('')
  const [emailError,setEmailError] = useState('')
  const [password, setPassword] = useState('')
  const [passwordError,setPasswordError] = useState('')
  const [forgotPassword,setForgotPassword] = useState(false)

  const toggleStorage = () => {
    if (saveCredentials) {
        setSaveCredentials(false)
    } else {
        setSaveCredentials(true)
    }
  }   

  return (
    <View style={styles.wrapper}>

      <View style={styles.inputField}>
        <TextInput 
            placeholderTextColor='#444'
            placeholder='email'
            autoCapitalize='none'
            keyboardType='email-address'
            textContentType='emailAddress'
            value={email}
            onChangeText={text => {
              setEmail(text)
              setEmailError('')
            }}
            onEndEditing={() => {
              validateInput(['email'])
            }}
        />
      </View>
      {emailError &&
          <Text style={styles.errorText}>{emailError}</Text>
      }
      {!forgotPassword &&
        <View style={styles.inputField}>
          <TextInput 
              placeholderTextColor='#444'
              placeholder='password'
              autoCapitalize='none'
              autoCorrect={false}
              secureTextEntry={true}
              textContentType='password'
              value={password}
              onChangeText={text => {
                setPassword(text)
                setPasswordError('')
              }}
              onEndEditing={() => {
                validateInput(['password'])
              }}
          />
        </View>
      }
      {passwordError &&
            <Text style={styles.errorText}>{passwordError}</Text>
      }

      {!forgotPassword &&
        <View style={{flexDirection: 'row', justifyContent:'space-between',marginHorizontal:10}}>
            <Pressable style={{alignItems: 'flex-start'}} onPress={toggleStorage}>
                <Text style={[{ color: saveCredentials ? 'blue' : '#6bb0f5'}, { fontWeight: saveCredentials ? 'bold' : 'normal'}]}>Keep Me Logged In</Text>
            </Pressable>
            <View style={{alignItems: 'flex-end'}}>
              <TouchableOpacity onPress={() => onPasswordForgotten()}>
                <Text style={{color: '#6bb0f5'}}>Forgot password?</Text>
              </TouchableOpacity>
            </View>
        </View>
      }    
      
      <View style={{marginHorizontal:10,marginTop:20}}>
        {!forgotPassword ?
            <Pressable style={styles.button} onPress={onSubmit}>
                <Text style={styles.buttonText}>Log In</Text>
            </Pressable>
            :
            <Pressable style={styles.button} onPress={onRequestReset}>
                <Text style={styles.buttonText}>Reset</Text>
            </Pressable>
        }
      </View>

      <View style={styles.signupContainer}>
          {forgotPassword ?
              <TouchableOpacity onPress={() => setForgotPassword(false)}>
                  <Text style={{color:'#6bb0f5'}}> Cancel</Text>
              </TouchableOpacity>
            :
            <>
              <Text>Don't have an account?</Text>
              <TouchableOpacity onPress={() => navigation.push('SignupScreen')}>
                <Text style={{color:'#6bb0f5'}}> Sign Up</Text>
              </TouchableOpacity>
            </>
          }
      </View>

    </View>
  )
}

const styles = StyleSheet.create({
    wrapper: {
        marginTop:40
    },
    inputField: {
        borderRadius:4,
        padding:12,
        backgroundColor:'#fafafa',
        marginBottom:10,
        marginHorizontal:10,
        borderWidth:2,
        borderColor: '#ccc'
    },
    button: {
        backgroundColor: '#0096f6',
        alignItems:'center',
        justifyContent:'center',
        minHeight:42,
        borderRadius:4
    },
    buttonText: {
        color:'white',
        fontWeight: '600',
        fontSize: 18
    },
    signupContainer: {
        flexDirection:'row',
        width:'100%',
        justifyContent:'center',
        marginTop:30
    },
    errorText: {
        color: 'red',
        fontSize:14,
        marginHorizontal:10,
        marginBottom: 10
    }
})

export default LoginForm