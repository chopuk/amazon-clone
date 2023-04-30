import { View, TextInput, StyleSheet, Text, Pressable, TouchableOpacity, Alert } from 'react-native'
import React, { useState } from 'react'
import ValidateField from '../../Utilities/ValidateField'
import { auth } from '../../firebase'
import { createUserWithEmailAndPassword, sendEmailVerification, signOut } from 'firebase/auth'

const validateAllFields = ['username','email','password']

const SignupForm = ({navigation}) => {

  const validateInput = (fieldnames) => {
    let isValidForm = true
    let result
    fieldnames.map((fieldname) => {
        switch (fieldname) {
        case 'username':
            result = new ValidateField(username).minlength(6).result()
            isValidForm = result.isValid
            setUsernameError(result.message)
            break
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
        trySignup()
    }
  }
 
  const trySignup = async() => {
    let user
    try {
        await createUserWithEmailAndPassword(auth, email, password)
        userCredentials = auth.currentUser
        await signOut(auth)
    } catch (error) {
        Alert.alert('Firebase Error',error.message)
    }
    try {
        if (userCredentials) {
            await sendEmailVerification(userCredentials)
            Alert.alert('Signup Successful!','You have been sent an email to verify your email address. You have now been routed to the login screen.')
            navigation.navigate('Welcome')
        }
    } catch (error) {
        Alert.alert('Firebase Error',error.message)
    }

  }

  const [username, setUsername] = useState('')
  const [usernameError,setUsernameError] = useState('')
  const [email, setEmail] = useState('')
  const [emailError,setEmailError] = useState('')
  const [password, setPassword] = useState('')
  const [passwordError,setPasswordError] = useState('')  

  return (
    <View style={styles.wrapper}>

      <View style={styles.inputField}>
        <TextInput 
            placeholderTextColor='#444'
            placeholder='username'
            autoCapitalize='none'
            value={username}
            onChangeText={text => {
              setUsername(text)
              setUsernameError('')
            }}
            onEndEditing={() => {
              validateInput(['username'])
            }}
        />
      </View>
      {usernameError &&
          <Text style={styles.errorText}>{usernameError}</Text>
      }

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
      {passwordError &&
          <Text style={styles.errorText}>{passwordError}</Text>
      }
      
      <View style={{marginHorizontal:10,marginTop:20}}>
          <Pressable style={styles.button} onPress={onSubmit}>
              <Text style={styles.buttonText}>Sign Up</Text>
          </Pressable>
      </View>

      <View style={styles.signupContainer}>
          <Text>Already have an account?</Text>
          <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text style={{color:'#6bb0f5'}}> Login</Text>
          </TouchableOpacity>
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

export default SignupForm