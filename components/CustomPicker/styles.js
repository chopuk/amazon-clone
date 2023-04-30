import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
    text: {
        fontSize:16
    },
    touchableOpacity: {
        backgroundColor:'white',
        borderRadius:5,
        borderColor:'lightgrey',
        borderWidth:1,
        width:200,
        padding:5,
        flexDirection:'row'
    },
    modelContainer: {
        flex:1,
        alignItems:'center',
        justifyContent:'center'
    },
    modal: {
        backgroundColor:'#c2d6d5',
        borderRadius:10
    },
    option: {
        alignItems:'flex-start'
    },
    textOption: {
        marginHorizontal:20,
        marginBottom:2,
        fontSize:18,
        fontWeight:'bold'
    },
    icon: {
        
    }
})

export default styles