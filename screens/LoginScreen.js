import { View, Image, StyleSheet } from 'react-native'
import React from 'react'
import LoginForm from '../components/LoginForm'

const LoginScreen = ({navigation}) => (
    <View style={styles.container}>
        <View style={styles.logoContainer}>
            <Image
                style={styles.logo}
                source={require('../assets/images/amazonlogo.png')}
            />
        </View>
        <LoginForm navigation={navigation}/>
    </View>
)

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ebe7d5',
        paddingTop:30
    },
    logoContainer: {
        alignItems:'center',
        marginTop:60
    },
    logo: {
        width: 100,
        height: 100
    }
})

export default LoginScreen