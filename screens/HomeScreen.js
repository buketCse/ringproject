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
import * as firebase from 'firebase';

const {width, height} = Dimensions.get('window');

const LATITUDE = 40.972274;
const LONGITUDE = 29.152570;
const LATITUDE_DELTA = 0.01;
const LONGITUDE_DELTA = 0.0;
var counter=40.974805;
var counter2=29.153323;
var datam = []

const firebaseConfig = {
  apiKey: "AIzaSyDIPZWYh4WluEKii5I6DjcxTaOvh49VtvE",
  authDomain: "ring-project-224713.firebaseapp.com",
  databaseURL: "https://ring-project-224713.firebaseio.com/",
  storageBucket: "ring-project-224713.appspot.com"
};

firebase.initializeApp(firebaseConfig);

class HomeScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      myPosition: {
        latitude: 0,
        longitude: 0,
        timestamp: 0,
      },
      latRegion:LATITUDE,
      longRegion:LONGITUDE,
      mapMarkers : [],
      routeCoordinates: [],
      distanceTravelled: 0,
      prevLatLng: {},
      // coordinate: new AnimatedRegion({
      //   latitude: LATITUDE,
      //   longitude: LONGITUDE
      // }),
        //   image: imageBus,
        // },
        // {
        //   coordinate: {
        //       latitude: 40.972052,
        //       longitude: 29.150542,
        //       latitudeDelta: 0.01,
        //       longitudeDelta: 0.0
        //   },
        //   image: imageBus,
        // },
        // {
        //   coordinate: {
        //       latitude: 40.972407,
        //       longitude: 29.152612
        //   },
        //   title: "Third Best Place",
        //   description: "This is the third best place in Portland",
        //   image: imageBus,
        // },
      
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

  // storeLatLongValue(ringId, lat, long) {
  //   firebase.database().ref('rings/' + ringId).set({
  //     latitude: lat,
  //     longitude: long
  //   });
  // }

  // storeLatLongValue(ringId) {
  //   firebase.database().ref('rings/' + ringId).set({
  //     latitude: lat,
  //     longitude: long
  //   });
  // }

  storeLatLongValue(ringId) {
    console.log('stored new value:',ringId)
    counter=counter+0.2,
    counter2=counter2+0.2,
    firebase.database().ref('rings/' + ringId).set({
      latitude: counter,
      longitude: counter2
    });
  }

  

  //firebase'den bilgi geldikçe snaphot.val().lat değeri yenilenir, ama fonksiyon çalışmaz.
  setupRingListener() {
  
    let markers2 = []
     
     firebase.database().ref('rings/').on('value', (snapshot) => {
       myRingObj = snapshot.val()
    
      var keys =Object.keys(myRingObj)
      keys.map(k=>{
      this.addToData(myRingObj[k])
    })
  })
    //   keys.map(k=>{
      
    //   markers2.push({latitude : myRingObj[k].latitude, longitude : myRingObj[k].longitude})
    //  console.log(markers2.length)
    //  this.setState({mapMarkers : markers2})
     
     //})
  
    
  }
  
  addToData (a) {
   
    console.log('a.lat',a.latitude)
  }

      // firebase.database().ref('rings/' + ringId).on('value', (snapshot) => {
    //   const lat = snapshot.val().latitude;
    //   const long = snapshot.val().longitude;
    //   console.log("New values: " + lat + " " + long);
     //  this.renderRings(lat, long)
    // });

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
  latitude: this.state.latRegion,
  longitude: this.state.longRegion,
  latitudeDelta: LATITUDE_DELTA,
  longitudeDelta: LONGITUDE_DELTA
});

myGetCurrentLocation(){
  navigator.geolocation.getCurrentPosition(
    position => {
      // console.log('position===========================', position)
      // this.socket.emit('position', {
      //   data: position,
      //   id: this.id,
      // });

    
      let tempPosition = { ...this.state.myPosition };
      tempPosition.latitude = position.coords.latitude;
      tempPosition.longitude = position.coords.longitude;

      
      this.setState({
        myPosition: tempPosition,
        isLoading: false,
      });
    },
    error => console.log(error),
    { enableHighAccuracy: true, timeout: 20000, distanceFilter: 10 }
  );

  // this.watchID = navigator.geolocation.watchPosition(lastPosition => {
  //   console.log('watching...')
  //   //var { distanceTotal, record } = this.state;
  //   this.setState({lastPosition});
  //   //if(record) {
  //       var newLatLng = {latitude:lastPosition.coords.latitude, longitude: lastPosition.coords.longitude}
  //       firebase.database().ref('myPosition/bus1').set({
  //           latitude: lastPosition.coords.latitude,
  //           longitude: lastPosition.coords.longitude
  //         })
  //       // this.setState({ track: this.state.track.concat([newLatLng]) });
  //       // this.setState({ distanceTotal: (distanceTotal + this.calcDistance(newLatLng)) });
  //       this.setState({ prevLatLng: newLatLng })
      
  //     });
}

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

    // All_location.map(item => {
    //   doAnimattion = item => {
    //     this.mapRef.animateToRegion(item, 4000);
    //     this.marker._component.animateMarkerToCoordinate(item, 3000);
    //   };

    //   doAnimattion(item);
    // });
    this.myGetCurrentLocation();
}


// renderDraggable(){
//   return (
//         <Animated.Marker image={imageBus} coordinate={}/>
// );
// }


getMyRings(){
  this.setupRingListener()

  return this.state.mapMarkers.map((mar,idx) =>{
    return(
      <Marker key={idx} image={imageBus} coordinate={{latitude:mar.latitude, longitude:mar.longitude}}/>
        )}
  )


 
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
    let myLat = this.state.myPosition.latitude;
    let myLong = this.state.myPosition.longitude;

    const coords = {
      latitude: myLat,
      longitude: myLong,
    };
    const myMetadata = `ME!`;
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
          //  minZoomLevel={15.5}  
          // maxZoomLevel={18}
        >
        <MapView.Marker
              coordinate={coords}
              timestamp={this.state.myPosition.timestamp}
              description={myMetadata}
            />
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
                 {/* <Marker.Animated
                  coordinate={this.state.coordinate}
                  ref={marker => {
                    this.marker = marker;
                  }}
                /> */}
                {this.getMyRings()}
        </MapView>
        <TouchableOpacity
        onPress={() => this.myGetCurrentLocation()} style={styles.touchableOpacity}>
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