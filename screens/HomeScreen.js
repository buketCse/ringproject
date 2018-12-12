/**
 * Uygulamada kullanılan tek ekran,
 * Map direk buradan acılıyor,
 * App.js ile baglantılı tek ekran.
 */


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
  PermissionsAndroid
} from 'react-native';
import MapView, 
  {Marker, AnimatedRegion, ProviderPropType, Polyline, PROVIDER_GOOGLE
  } from 'react-native-maps';

import _ from 'lodash';
import imageBus from "../assets/images/icon-yellow-bus-96.png";

const {width, height} = Dimensions.get('window');

const LATITUDE = 40.972274;
const LONGITUDE = 29.152570;
const LATITUDE_DELTA = 0.01;
const LONGITUDE_DELTA = 0.0;

class HomeScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      latitude: LATITUDE,
      longitude: LONGITUDE,
      routeCoordinates: [],
      distanceTravelled: 0,
      prevLatLng: {},
      coordinate: new AnimatedRegion({
        latitude: LATITUDE,
        longitude: LONGITUDE
      }),
      // coordinate: new AnimatedRegion({
      //   latitude: 40.972189,
      //   longitude: 29.153667
      // }),
      myMarkers: [
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
      ]
    }

    //this.renderRingMarkers=this.renderRingMarkers.bind(this);
    //this.animate=this.animate.bind(this);
  }

  _requestLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          'title': 'Ring App Location Permission',
          'message': 'Ring App needs access to your location ' +
                    'so you can take locations.'
        }
      )
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("You can use the GPS")
      } else {
        console.log("GPS permission denied")
      }
    } catch (err) {
      console.log('err',err)
    }
  }

  renderRingMarkers() {
    console.log('renderRing')
    return this.state.myMarkers.map((eachMarker, index) => {
      
      this.animate()
      return (
        <Marker.Animated key={index} coordinate={ eachMarker.coordinate} image={eachMarker.image}
        ref={marker => {
          this.marker = marker;
        }} />
      );
      console.log(11,eachMarker)

    })
  }

  // setModalVisible(visible) {
  //   this.setState({modalVisible: visible});
  // }

  animate() {
    console.log('animate')
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


getMapRegion = () => ({
  latitude: this.state.latitude,
  longitude: this.state.longitude,
  latitudeDelta: LATITUDE_DELTA,
  longitudeDelta: LONGITUDE_DELTA
});


  componentDidMount() {


    const { coordinate } = this.state;

    this.mapRef.setMapBoundaries(
      northEast = {
        latitude: 40.973867,
        longitude: 29.154676,
      },southWest = {
        latitude: 40.972178,
        longitude: 29.150028,
      });

    // console.log('didMount')
    // this.mapRef.setMapBoundaries(
    //     northEast = {
    //         latitude: 40.973867,
    //         longitude: 29.154676,
    //     },southWest = {
    //         latitude: 40.972178,
    //         longitude: 29.150028,
    //     }
    // )

    // setTimeout(() => {
    //   const { coordinate } = this.state;

    //   const that=this;

    //     doAnimattion = item => {
    //       //that.mapRef.animateToRegion(item.coordinate, 6000);
    //       that.marker._component.animateMarkerToCoordinate(item.coordinate, 5000);
    //       console.log('time')
    //     };
    // }, 2000);
}


markers(location, imageLoc) {
  return (
      <Marker coordinate={{
          latitude: location.latitude,
          longitude: location.longitude
      }} image= {imageLoc}>
      </Marker>
      
  )
}

  render() {
    let props = this.props;
    return (
      <View style={styles.container}>
        <MapView
        provider={PROVIDER_GOOGLE}
        showsUserLocation={true}
        showsMyLocationButton={true}
        region={this.getMapRegion()}
        ref={mapRef => {
          this.mapRef = mapRef;
        }}
          style={{position: 'absolute', marginTop:20, 
            ...StyleSheet.absoluteFillObject}}
           minZoomLevel={15.5}  
          maxZoomLevel={18}
        >
        {
                    props.source ?
                    this.markers(props.source, {imageBus}): null
                }
                {
                    props.destination ?
                    this.markers(props.destination, {imageBus}): null
                }
                {
                    props.coords ?
                    <Polyline
                        coordinates={props.coords}
                        strokeWidth={4}
                        strokeColor="#666" />
                    : null
                }
          {this.renderRingMarkers()}
        </MapView>
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
  },
  buttonContainer: {
    flexDirection: "row",
    marginVertical: 20,
    backgroundColor: "transparent"
  }

});

export default HomeScreen;