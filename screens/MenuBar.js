/**
 * Sag üste koyulan menunun icerigi buraya eklenebilir.
 */

import React from 'react'
import { Modal, View, Image, Text, StyleSheet,Dimensions } from 'react-native';
const {width, height} = Dimensions.get('window');
const MenuBar = (props) => (
  <Modal visible={ props.modalVisible } animationType = "slide" 
         onRequestClose={ () => console.log('closed') }>>
    <View>
      <Image 
      source={require('../assets/images/list_menu.png')}
        style = { styles.image } />
      
    </View>
  </Modal>
)

const styles = StyleSheet.create({
  image:{
    width: 50,
     height: 50,
    marginTop: (height*7) / 100,
    marginLeft: (width*80) / 100,
  }
})

export default MenuBar;