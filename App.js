import { StatusBar } from 'expo-status-bar';
import { Camera, CameraType } from 'expo-camera';
import { StyleSheet, Text, View, Image } from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import React, { useState, useEffect, useRef } from 'react';
import Splitting from './Splitting';
import CustomButton from './src/components/CustomButton';

export default function App() {
  const [cameraPermission, setCameraPermission] = useState(null);
  //current image that user has taken
  const [image, setImage] = useState(null);
  const [base64Image, setBase64Image] = useState(null);
  //front/back camera
  const [cameraType, setCameraType] = useState(Camera.Constants.Type.back);
  const [flash, setFlash] = useState(Camera.Constants.FlashMode.off);
  //reference for camera
  const cameraRef = useRef(null);
  const [imageData, setImageData] = useState(null);
  const [loading, setLoading] = useState(false);

  const updateImageData = () => {
    setImageData(null);
  }

  const API_URL = `https://jzsggwpl40.execute-api.us-east-1.amazonaws.com/processImage`;

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
    quality: 0.1,
  }

  const takePicture = async () => {
    
    if (cameraRef.current) {
      try {
        const data = await cameraRef.current.takePictureAsync(options);
        setImage(data.uri)
        setBase64Image(data.base64)
      } catch (e) {
        console.log(e);
      }
    }
  }
  
  const processImage = async () => {
    if (image) {
      try {
        const data = {
          "image": base64Image,
        };

        const body = JSON.stringify(data)
        const res = await fetch(API_URL, {
          method: "POST",
          body: body
        });
        
        if (res.ok) {
          const responseBody = await res.text();
        
          console.log(typeof JSON.parse(responseBody));
          console.log(typeof imageData)
          setImageData(JSON.parse(responseBody));
          
        } else {
          console.log(res.status);
        }

        // const string = '[{"ITEM": "CBR", "PRICE": "18.60"}, {"ITEM": "S FF", "PRICE": "6.76"}, {"ITEM": "FISH CH", "PRICE": "3.18"}, {"ITEM": "CKN CH", "PRICE": "3.38"}]';
        // const objects = JSON.parse(string);
        // setImageData(objects)
        setLoading(false);
        setImage(null);
        setBase64Image(null);
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
      {!imageData
        ?
        !image
          ? <View style={styles.container}> 
            <Camera
              style={styles.camera}
              type={cameraType}
              flashMode={flash}
              ref={cameraRef}
            >
              <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                padding: 30,
              }}>
                <CustomButton icon={'retweet'} onPress={() => {
                  setCameraType(cameraType === CameraType.back ? CameraType.front : CameraType.back);
                }} />
                <CustomButton icon={'flash'}
                  color={flash === Camera.Constants.FlashMode.off ? 'gray' : '#f1f1f1'}
                  onPress={() => {
                  setFlash(flash === Camera.Constants.FlashMode.off 
                    ? Camera.Constants.FlashMode.on
                    : Camera.Constants.FlashMode.off);
                }}/>
              </View>
            
            </Camera>
            <View style={styles.buttonContainer}>
              <CustomButton title={'Take a picture'} icon="camera" onPress={takePicture}/>
            </View>
          </View>
    
          : <View style={styles.container}>
              <Image source={{uri: image}} style={styles.camera}/> 
                
                  
                  {!loading
                    ? <View style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      paddingHorizontal: 50,
                    }}><CustomButton title={'Re-take'} icon="retweet" onPress={() => setImage(null)}/><CustomButton title={"Process Image"} icon= "check" onPress={() => {processImage(); setLoading(true)}}/></View> 
                    : <CustomButton title={"Loading"} icon= "dots-three-horizontal"/>}
            
            </View>
        : 
        <View>
          <Splitting imageData={imageData} onUpdateImageData={updateImageData}/>
        </View>
      }
      
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'stretch',
  },
  camera: {
    flex: 1,
    borderRadius: 20,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
});
