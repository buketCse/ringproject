import React from 'react';
import { Platform, StatusBar, StyleSheet, View, Image } from 'react-native';
import { AppLoading, Asset, Font, Icon, SplashScreen } from 'expo';
import HomeScreen from './screens/HomeScreen';
import StaticMap from './screens/StaticMap';



export default class App extends React.Component {
  state = {
    isSplashReady: false,
    isAppReady: false,
  };

  render() {
    if (!this.state.isSplashReady ) {
      return (
        <AppLoading
          startAsync={this._cacheSplashResourcesAsync}
          onError={this._handleLoadingError}
          onFinish={this._handleFinishLoading}
          autoHideSplash={false}
        />
      );
    }else if (!this.state.isAppReady) {
      return (
        <View style={{ flex: 1 , justifyContent:"center", alignItems:"center"}}>
          <Image
            source={require('./assets/images/loading.gif')}
            onLoad={this._cacheResourcesAsync}
          />
        </View>
      );
    }else {
      return (
        
          <HomeScreen />
       
      );
    }
  }

  _cacheSplashResourcesAsync = async () => {
    const gif = require('./assets/images/loading.gif');
    return Asset.fromModule(gif).downloadAsync()
  }

  _cacheResourcesAsync = async () => {
    SplashScreen.hide();
    const images = [
      require('./assets/images/icon-yellow-bus-48.png'),
      
    ];

    const cacheImages = images.map((image) => {
      return Asset.fromModule(image).downloadAsync();
    });

    await Promise.all(cacheImages);
    this.setState({ isAppReady: true });
  }

  // _loadResourcesAsync = async () => {
  //   return Promise.all([
  //     Asset.loadAsync([
  //       require('./assets/images/robot-dev.png'),
  //       require('./assets/images/robot-prod.png'),
  //     ]),
  //     Font.loadAsync({
  //       // This is the font that we are using for our tab bar
  //       ...Icon.Ionicons.font,
  //       // We include SpaceMono because we use it in HomeScreen.js. Feel free
  //       // to remove this if you are not using it in your app
  //       'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf'),
  //     }),
  //   ]);
  // };

  _handleLoadingError = error => {
    // In this case, you might want to report the error to your error
    // reporting service, for example Sentry
    console.log('ERR',error);
  };

  _handleFinishLoading = () => {
    this.setState({ isSplashReady: true });
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
