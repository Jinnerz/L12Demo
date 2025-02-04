import React,{useState, useEffect} from 'react';
import {StatusBar, StyleSheet, Text, View} from 'react-native';

import {Barometer} from "expo-sensors";

const styles = StyleSheet.create({
  container: {

  },
});

// Installing sensors - npx expo install expo-sensors
export default function App() {

  const [{ pressure, relativeAltitude}, setData] = useState({pressure: 0, relativeAltitude: 0});

  useEffect(()=>{
      const subscription = Barometer.addListener(setData)
      return () => subscription.remove();
  }, []);

  return (
    <View>
      <StatusBar/>
        <Text>Pressure: {pressure}hPa</Text>
        {/*altitude appears blank due to singapore being at sea level*/}
        <Text>Relative Altitude: {relativeAltitude}m</Text>
    </View>
  );
}


