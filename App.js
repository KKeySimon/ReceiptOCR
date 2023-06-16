import { StatusBar } from 'expo-status-bar';
import { Camera, CameraType } from 'expo-camera';
import { StyleSheet, Text, View, Image } from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import React, { useState, useEffect, useRef } from 'react';
import Button from './src/components/Button';

export default function App() {
  const [cameraPermission, setCameraPermission] = useState(null);
  //current image that user has taken
  const [image, setImage] = useState(null);
  //front/back camera
  const [cameraType, setCameraType] = useState(Camera.Constants.Type.back);
  const [flash, setFlash] = useState(Camera.Constants.FlashMode.off);
  //reference for camera
  const [camera, setCamera] = useState(null);

  //When stuff in list changes, command runs
  useEffect(() => {
    (async () => {
      MediaLibrary.requestPermissionsAsync();
      const cameraStatus = await Camera.requestCameraPermissionsAsync();
      setCameraPermission(cameraStatus.status == 'granted');
    })();
  }, []);

  const options = {
    base64: true,
  }

  const takePicture = async () => {
    console.log("hello")
    
    if (camera) {
      try {
        const data = await camera.takePictureAsync(options);
        setImage(data.uri)
        console.log(data);
      } catch (e) {
        console.log(e);
      }
    }
  }
  
  const saveImage = async () => {
    if (image) {
      try {
        await MediaLibrary.createAssetAsync(image);
        alert('Picture Taken!');
        setImage(null);
      } catch (e) {
        console.log(e);
      }
    }
  }
  
  if (cameraPermission === false) {
    return <Text>No access to camera</Text>
  }
  

  return (
    <View style={styles.container}>
      {/* If we don't have image show Camera, and if we do, load an image with the saved uri */}
      {!image ?
        <Camera
          style={styles.camera}
          type={cameraType}
          flashMode={flash}
          ref={(ref) => setCamera(ref)}
        >
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            padding: 30,
          }}>
            <Button icon={'retweet'} onPress={() => {
              setCameraType(cameraType === CameraType.back ? CameraType.front : CameraType.back);
            }} />
            <Button icon={'flash'}
              color={flash === Camera.Constants.FlashMode.off ? 'gray' : '#f1f1f1'}
              onPress={() => {
              setFlash(flash === Camera.Constants.FlashMode.off 
                ? Camera.Constants.FlashMode.on
                : Camera.Constants.FlashMode.off);
            }}/>
          </View> 
        </Camera>
  
        : <Image source={{uri: image}} style={styles.camera}/> 
      }
      <View>
        {image ?
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingHorizontal: 50,
          }}>
            <Button title={'Re-take'} icon="retweet" onPress={() => setImage(null)}/>
            <Button title={"Save"} icon="check" onPress={saveImage}/>
          </View> 
          : <Button title={'Take a picture'} icon="camera" onPress={takePicture}/>
        }
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    paddingBottom: 20
  },
  camera: {
    flex: 1,
    borderRadius: 20,
  }
});
