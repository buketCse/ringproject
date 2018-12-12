/**
 * Socketin kullanıldığı ringlerin anlık konumunun da içinde olduğu
 * Map ekranı, sockete bağlı olmadığı için projeye de henüz baglanmadı. 
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
  import io from 'socket.io-client';
import _ from 'lodash';
import imageBus from "../assets/images/icon-yellow-bus-96.png";

const {width, height} = Dimensions.get('window');

const LATITUDE = 40.972274;
const LONGITUDE = 29.152570;
const LATITUDE_DELTA = 0.01;
const LONGITUDE_DELTA = 0.0;

class MapShareLocation extends React.Component {
  constructor(props) {
    super(props);

    this.id = this.makeID();
    this.state = {
      isLoading: true,
      rings: {},
      latitude: LATITUDE,
      longitude: LONGITUDE,
      routeCoordinates: [],
      distanceTravelled: 0,
      prevLatLng: {},
      coordinate: new AnimatedRegion({
        latitude: LATITUDE,
        longitude: LONGITUDE
      }),
    };
    this.socket = io.connect('http://625809ac.ngrok.io');
    this.getPositionRingMarkers=this.getPositionRingMarkers.bind(this);
 }

 makeID() {
    var text = '';
    var possible =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (var i = 0; i < 5; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
  }

  componentDidMount() {

    navigator.geolocation.getCurrentPosition(
        position => {
          // console.log('position===========================', position)
          this.socket.emit('position', {
            data: position,
            id: this.id,
          });
  
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

    // const { coordinate } = this.state;

    // this.mapRef.setMapBoundaries(
    //   northEast = {
    //     latitude: 40.973867,
    //     longitude: 29.154676,
    //   },southWest = {
    //     latitude: 40.972178,
    //     longitude: 29.150028,
    //   });
}


  getPositionRingMarkers() {
    console.log('renderRing')
    return this.state.ringsPositionsArr.map(marker => {
        // console.log('state friends ----------------', this.state.friends)
        const ringsCoords = {
          latitude: marker.data.coords.latitude,
          longitude: marker.data.coords.longitude,
        };

        const metadata = `id: ${marker.id}`;

        return (
          <MapView.Marker
            key={marker.id}
            coordinate={ringsCoords}
            timestamp={marker.data.timestamp}
            description={metadata}
            title={marker.id}
            image={imageBus}
          />
        );
      })
  }

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

  render() {
    this.socket.on('otherPositions', positionsData => {
        // console.log('positionsData from server broadcast')
        let tempRings = { ...this.state.friends };
        tempRings[positionsData.id] = { ...positionsData };
  
        this.setState({
          friends: tempFriends,
        });
      });

      let ringsPositionsArr = Object.values(this.state.rings);

    //let props = this.props;

    return (
      <View style={styles.container}>
      {this.state.isLoading ? (
          <Text>loading...</Text>
        ) : (
        <MapView
        region={this.getMapRegion()}
          style={{position: 'absolute', marginTop:20, 
            ...StyleSheet.absoluteFillObject}}
          minZoomLevel={15.5}  
          maxZoomLevel={18}
        >
        {this.getPositionRingMarkers}
        </MapView>
        )
        }
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
  }
});

export default HomeScreen;