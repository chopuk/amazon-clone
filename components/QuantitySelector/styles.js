import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
 root: {

 },
 componentGroup: {
  flexDirection:'row',
  alignItems:'center'
 },
 button: {
  width:35,
  height:35,
  backgroundColor:'lightblue',
  alignItems: 'center',
  justifyContent:'center',
 },
 buttonText: {
  fontWeight:'bold'
 },
 quantityText: {
  fontWeight:'bold'
 },
 quantity: {
  width:35,
  height:35,
  backgroundColor: 'lightgrey',
  alignItems: 'center',
  justifyContent:'center',
  marginHorizontal:2
 },
 text: {
    fontWeight:'bold',
    marginRight:10
 }
})

export default styles