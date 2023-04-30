import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
  root: {
    flexDirection:'row',
    margin:10,
    backgroundColor:'#fff'
  },
  image: {
    width:150,
    height:150,
    resizeMode:'contain',
    flex:2
  },
  rightContainer: {
    marginTop:5,
    paddingLeft:10,
    flex:3
  },
  title: {
    fontSize:16
  },
  price: {
    fontSize:16,
    fontWeight:'bold'
  },
  ratingsContainer: {
    marginTop:3,
    flexDirection:'row',
    alignItems:'center'
  },
  noOfRatings: {
    marginLeft:10
  },
  priceDetails: {
    flexDirection:'row',
    alignItems:'center',
    marginTop:5
  },
  oldPrice: {
    textDecorationLine:'line-through',
    marginLeft:10
  }
})

export default styles