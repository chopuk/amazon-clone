import { View, FlatList, Image, StyleSheet, Dimensions } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { ref, getDownloadURL, getStorage  } from 'firebase/storage'

const ImageCarousal = ({images}) => {
  const [activeIndex,setActiveIndex] = useState(0)
  const [imageData,setImageData] = useState([])
  const onFlatlistUpdate = useCallback(({viewableItems}) => {
    if (viewableItems.length > 0) {
      setActiveIndex(viewableItems[0].index || 0)
    }
  }, [])
  
  useEffect(() => {
    // add key for keyextractor..
    const addKey = async () => {
      let data = []
      let index=0
      const storage = getStorage()
  
      for (const image of images) {
        const storageRef = ref(storage, `computer/${image}`)
        const url = await getDownloadURL(storageRef)
        data[index] = {key: index+1, url: url}
        index = index + 1
      }
      setImageData(data)
    }
    addKey()                          
  }, [])

  return (
    <View>
      <FlatList 
        data={imageData}
        renderItem={({item}) => (
            <Image 
                style={styles.image}
                source={{ uri: item.url}}
            />
        )}
        //keyExtractor={(item,index)=> item.key}
        showsHorizontalScrollIndicator={false}
        horizontal
        snapToInterval={Dimensions.get('window').width - 20}
        snapToAlignment={'center'}
        decelerationRate={'fast'}
        viewabilityConfig={{
            viewAreaCoveragePercentThreshold:50
        }}
        onViewableItemsChanged={onFlatlistUpdate}
      />
      <View style={styles.dots}>
            {images.map((image,index) => (
                <View key={index} style={[
                    styles.dot, 
                    {
                        backgroundColor: index === activeIndex ? '#c9c9c9' : '#ededed'
                    }]
                }></View>
            ))}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
    root: {

    },
    image: {
        height:250,
        width:Dimensions.get('window').width - 20,
        resizeMode:'contain'
    },
    dot: {
        width:10,
        height:10,
        borderRadius:25,
        borderWidth:1,
        borderColor:'#c9c9c9',
        margin:8
    },
    dots: {
        flexDirection:'row',
        justifyContent:'center'
    }
})

export default ImageCarousal