import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, View, Dimensions } from 'react-native';
import CustomButton from './src/components/CustomButton';
import { ButtonGroup, ListItem } from '@rneui/base';
import { Button, Text, Icon } from '@rneui/themed';

export default function Result({data}) {
    const finalPrices = data
    console.log(finalPrices)

    return (
        <ScrollView scrollEnabled = {false}>
            <View style = {styles.container}>
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    padding: 30,
                }}><CustomButton icon='level-up' onPress={() => handleClick()} color='gray' />
                </View>
                <View style = {{ marginTop: 150, marginBottom: -150}}>
                    <Text h1 style = {{textAlign: 'center', fontWeight: 'bold', color: '#02c736'}}>Final Costs</Text>
                    <Text style = {{textAlign: 'center', marginTop: 30, marginBottom: -30}}>Check if all the information is correct.</Text>
                </View>

                <View style = {styles.listItemContainer}>
                    {finalPrices.map((rowData, index) => (
                        <ListItem bottomDivider topDivider key={index}>
                            <ListItem.Content style = {styles.listItemContent}>
                                <ListItem.Title style = {{color: "#02c736", fontWeight: 'bold'}}>User {index + 1}: ${rowData.totalPrice.toFixed(2)}</ListItem.Title>
                                {rowData.items.map((innerRowData, innerIndex) => (
                                    <ListItem.Subtitle>Item: {innerRowData[1]}, Price: ${innerRowData[0]}, Split Amongst {innerRowData[2]} People</ListItem.Subtitle>
                                ))}
                            </ListItem.Content>
                        </ListItem>
                    ))}
                </View>
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