import React,{useState, useEffect} from 'react';
import {StatusBar, Button, StyleSheet, Text, View} from 'react-native';

import {Audio} from 'expo-av';
import {Sound} from "expo-av/build/Audio/Sound";
import {Accelerometer, Gyroscope} from "expo-sensors";
import soundfile from "./short1.wav";

//sound - npx expo install expo-av
export default function App() {
    //due to how the data gets passed in from the sensors, i rename x y z to something else, which can then print out to show changes in the app directly
    const [{x: Ax, y: Ay, z: Az}, setAccelerometer] = useState({x:0,y:0,z:0});
    const [{x: Gx, y: Gy, z: Gz}, setGyroscope] = useState({x:0,y:0,z:0});
    const [showText, setShowText] = useState(false);
    const [mySound, setMySound] = useState();

    const [previousGyro, setPreviousGyro] = useState({x:0,y:0,z:0});
    const [previousAcc, setPreviousAcc] = useState({x:0,y:0,z:0});

    //this useEffect is to change the data value of the x y z for the accel and gyro
    useEffect(()=>{
        const Accsubscription = Accelerometer.addListener( (accData) => {
            setAccelerometer(accData);
        })
        //to set the gyroscope to have intervals of 100 ms
        Gyroscope.setUpdateInterval(100);
        const Gyrosubscription = Gyroscope.addListener((gyroData) => {
            setGyroscope(gyroData)
        })

        return () => {
            Accsubscription.remove();
            Gyrosubscription.remove();
        }
    }, [Ax, Ay, Az, Gx, Gy, Gz]);



    // This useEffect detects if there's a change in the accelerometer or gyroscope values
    useEffect(() => {
        if (
            //Current Accelerometer's x value, not equal to the previously saved x value for the Accelerometer = TRUE
            Ax !== previousAcc.x ||
            Ay !== previousAcc.y ||
            Az !== previousAcc.z ||
            Gx !== previousGyro.x ||
            Gy !== previousGyro.y ||
            Gz !== previousGyro.z
        ) {
            //only if any of the comparisons turned out to be true, due to the value not being originally the same
            //set showText to be true for a while, set the previous to what it is currently
            setShowText(true);
            setPreviousAcc({ x: Ax, y: Ay, z: Az });
            setPreviousGyro({ x: Gx, y: Gy, z: Gz });
            playSound()

            // Hide the text after a few seconds (e.g., 2 seconds)
            setTimeout(() => {
                setShowText(false);
            }, 2000); // 2 seconds
        }
    }, [Ax, Ay, Az, Gx, Gy, Gz, previousGyro, previousAcc]);


    async function playSound() {
        const soundfile = require('./short1.wav');
        const {sound} = await Audio.Sound.createAsync(soundfile);
        setMySound(sound);
        await sound.playAsync();
    }

    //to help prevent issues from arising if user spams the button, unloading the sound before the next plays
    useEffect(() => {
        return mySound
        ? () => {
            console.log('Unloading Sound');
                mySound.unloadAsync();
        }
        :undefined
    }, [mySound]);

  return (
    <View>
      <StatusBar />

        <Text>Gyroscope X: {Gx}</Text>
        <Text>Gyroscope Y: {Gy}</Text>
        <Text>Gyroscope Z: {Gz}</Text>
        <Text>Accelerometer X: {Ax}</Text>
        <Text>Accelerometer Y: {Ay}</Text>
        <Text>Accelerometer Z: {Az}</Text>

        <View style={{marginTop: 50}}>
            <Text style={{textAlign: 'center', fontSize: 50, fontWeight: 'bold', color: 'red'}}>
                {showText && <Text>SHAKE!</Text>}
            </Text>
        </View>
    </View>
  );
}


