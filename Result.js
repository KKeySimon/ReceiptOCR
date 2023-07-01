import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, View, Dimensions, Alert, Share } from 'react-native';
import CustomButton from './src/components/CustomButton';
import { ButtonGroup, ListItem } from '@rneui/base';
import { Button, Text, Icon } from '@rneui/themed';

//import * as SMS from 'expo-sms'

export default function Result({data, onUpdateFinalPrices, onUpdateImageData}) {
    const finalPrices = data;
    const parseFinalPrices = () => {
        let finalString = "";
        finalPrices.forEach((rowData, index) => {
            finalString = finalString + "User " + (index + 1) + ": $" + rowData.totalPrice.toFixed(2) + "\n";
            rowData.items.forEach(innerRowData => {
                finalString = finalString + (1/innerRowData[2]).toFixed(2) * 100 + "% of Item: " + innerRowData[1] + ", Price: $" + innerRowData[0] + "\n";
            });
            finalString = finalString + "___________________________________ \n";
        });
        return finalString;
    }

    const handleClick = () => {
        onUpdateFinalPrices();
    };
    
    const onShare = async () => {
        try {
            const result = await Share.share({
                message:
                parseFinalPrices(),
            });
            if (result.action === Share.sharedAction) {
                if (result.activityType) {
              // shared with activity type of result.activityType
                } else {
              // shared
                }
            } else if (result.action === Share.dismissedAction) {
            // dismissed
            }
        } catch (error) {
            Alert.alert(error.message);
        }
    };

    return (
        <ScrollView scrollEnabled = {false}>
            <View style = {styles.container}>
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    padding: 30,
                }}><CustomButton icon='level-up' onPress={() => handleClick()} color='gray' />
                </View>
                <View>
                    <Text h1 style = {{textAlign: 'center', fontWeight: 'bold', color: '#02c736'}}>Final Costs</Text>
                    <Text style = {{textAlign: 'center', padding: 20}}>Check if all the information is correct.</Text>
                </View>

                <ScrollView scrollEnabled = {true}>
                {finalPrices.map((rowData, index) => (
                    <ListItem bottomDivider topDivider key={index}>
                        <ListItem.Content style = {styles.listItemContent}>
                            <ListItem.Title style = {{color: "#02c736", fontWeight: 'bold'}}>User {index + 1}: ${rowData.totalPrice.toFixed(2)}</ListItem.Title>
                            {rowData.items.map((innerRowData, innerIndex) => (
                                <ListItem.Subtitle key={innerIndex}>{((1/innerRowData[2]).toFixed(2) * 100).toFixed(0)}% of Item: {innerRowData[1]}, Price: ${innerRowData[0]}</ListItem.Subtitle>
                            ))}
                        </ListItem.Content>
                    </ListItem>
                ))}
            </ScrollView>
            <CustomButton icon='forward' title="Share The Bill" color="black" onPress={onShare} />
            <CustomButton icon='cw' title="Scan Another Receipt" color="black" onPress={onUpdateImageData} />
        </View>
    </ScrollView>
    )
}
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff', width: Dimensions.get('window').width, height: Dimensions.get('window').height},

    listItemContainer: {
        flex: 1,
        justifyContent: 'center',
      },
      listItemContent: {
        justifyContent: 'center',
        alignItems: 'center',
      },
    buttonContainer: {
        width: '100%',

      },
    priceTextBox: {
        backgroundColor: '#02c736',
        borderColor: 'none',
        borderRadius: 15,
        padding: 10,
        width: '50%',
        justifyContent: 'center',

      },
    
});