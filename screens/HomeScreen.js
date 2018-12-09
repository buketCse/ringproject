import React from 'react';
import {
  Image,
  Animated,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
} from 'react-native';
import { WebBrowser } from 'expo';
import MapView, {Marker, AnimatedRegion, ProviderPropType} from 'react-native-maps';
import { DrawerNavigator } from 'react-navigation';

import _ from 'lodash';
import imageBus from "../assets/images/icon-yellow-bus-96.png";
//import menuIcon from "../assets/images/ic_view_list2.png";
//import {width , height} from '../constants/Layout.js';

import { MonoText } from '../components/StyledText';

const {width, height} = Dimensions.get('window');

const LATITUDE = 40.972274;
const LONGITUDE = 29.152570;
const LATITUDE_DELTA = 0.01;
const LONGITUDE_DELTA = 0.0;

export default class HomeScreen extends React.Component {
  
  // static navigationOptions = {
  //   header: null,
  // };

  constructor(props) {
    super(props);
    //console.log('props',this.props) //props will get logged.

    this.state = {
      modalVisible: false,
      coordinate: new AnimatedRegion({
        latitude: 40.972189,
        longitude: 29.153667
      }),
      markers: [
        {
          coordinate: {
              latitude: 40.974805,
              longitude: 29.153323,
              latitudeDelta: 0.01,
              longitudeDelta: 0.0
              
          },
          image: imageBus,
        },
        {
          coordinate: {
              latitude: 40.972052,
              longitude: 29.150542,
              latitudeDelta: 0.01,
              longitudeDelta: 0.0
          },
          image: imageBus,
        },
        // {
        //   coordinate: {
        //       latitude: 40.972407,
        //       longitude: 29.152612
        //   },
        //   title: "Third Best Place",
        //   description: "This is the third best place in Portland",
        //   image: imageBus,
        // },
      ],
      region: {
        latitude:40.972274,
        longitude: 29.152570,
        latitudeDelta: 0.01,
        longitudeDelta: 0.0
      }
    }
  }

  renderRingMarkers() {
    return this.state.markers.map((eachMarker, index) => {
      console.log(11,eachMarker)
      this.animate()
      return (
        <Marker.Animated key={index} coordinate={ eachMarker.coordinate} image={eachMarker.image}
        ref={marker => {
          this.marker = marker;
        }} />
      );
    })
  }

  setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }

  animate() {
    const { coordinate } = this.state;
    const newCoordinate = {
      latitude: (Math.floor(LATITUDE  /10  + 0.3)),
      longitude: (Math.floor(LONGITUDE /10  + 0.3)),
    };

    if (Platform.OS === 'android') {
      if (this.marker) {
        this.marker._component.animateMarkerToCoordinate(newCoordinate, 500);
      }
    } else {
      coordinate.timing(newCoordinate).start();
    }
  }

  componentDidMount() {
    this.mapRef.setMapBoundaries(
        northEast = {
            latitude: 40.973867,
            longitude: 29.154676,
        },southWest = {
            latitude: 40.972178,
            longitude: 29.150028,
        }
    )

    setTimeout(() => {
      const { coordinate } = this.state;

      const that=this;

        doAnimattion = item => {
          //that.mapRef.animateToRegion(item.coordinate, 6000);
          that.marker._component.animateMarkerToCoordinate(item.coordinate, 5000);
        };
    }, 2000);
}


  render() {
    return (
      <View style={styles.container}>
        <MapView
          ref={mapRef => this.mapRef = mapRef}
          initialRegion={this.state.region}
          //{...StyleSheet.absoluteFillObject}} means mapview will be filled the screen (altına öğe gelirse haritanın üstünde gözükecek)
          style={{marginTop:20, 
            ...StyleSheet.absoluteFillObject}}
          minZoomLevel={16.2}  
          maxZoomLevel={18}
        >
          {this.renderRingMarkers()}
        </MapView>
        {/* <View style={styles.popupIcon}></View> */}
        <TouchableOpacity
        onPress={() => console.log('click')} style={styles.touchableOpacity}>
        <Image source={require('../assets/images/list_menu.png')} style={styles.menuIcon}/>
        </TouchableOpacity>
      </View>
    );
  }
}

HomeScreen.propTypes = {
  provider: ProviderPropType,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //backgroundColor: '#ffa41c',
    backgroundColor: '#ffae35',
  },
  touchableOpacity:{
    width: 50,
     height: 50,
    marginTop: (height*7) / 100,
    marginLeft: (width*80) / 100,
  },
  menuIcon:{
     width: 50,
     height: 50,
     borderRadius:35,
     backgroundColor: '#ffa41c',
    
    // shadowRadius:35,
    // shadowOffset:{  width: 10,  height: 10,  },
    // shadowColor: 'black',
    // shadowOpacity: 3.0,
    // elevation: 1
  }

});
