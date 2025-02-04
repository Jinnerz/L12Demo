import React,{useState, useEffect} from 'react';
import {StatusBar, Button, StyleSheet, Text, View} from 'react-native';

import {Audio} from 'expo-av';
import {Sound} from "expo-av/build/Audio/Sound";

const styles = StyleSheet.create({
  container: {

  },
});


//sound - npx expo install expo-av
export default function App() {

    const [mySound, setMySound] = useState();

    //to help prevent issues from arising if user spams the button, unloading the sound before the next plays
    async function playSound() {
        const soundfile = require('../short1.wav');
        const {sound} = await Audio.Sound.createAsync(soundfile);
        setMySound(sound);
        await sound.playAsync();
    }


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
      <Button title="Play Sound" onPress={
      ()=>{
        playSound();
      }}
      />
    </View>
  );
}


