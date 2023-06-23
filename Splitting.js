import React, { useState } from 'react';
import { Table, Row, Rows } from "react-native-table-component";
import { ScrollView, StyleSheet, View, Dimensions } from 'react-native';
import { ButtonGroup, ListItem } from '@rneui/base';
import { Button, Text } from '@rneui/themed';

export default function Splitting(imageData) {
    const tableData = imageData['imageData'];
    //Todo: When editing arrays, should make a copy and then use the setter method to avoid
    
    const [checked, setChecked] = React.useState(new Array(imageData.length).fill(false));
    const [numPeople, setNumPeople] = React.useState(0);
    const [selectedUser, setSelectedUser] = React.useState(0);
    const [totalPrice, setTotalPrice] = React.useState(0);
    const [evenOrIndiv, setEvenOrIndiv] = React.useState(0);
    const [dataConfirmed, setDataConfirmed] = React.useState(false);
    //2D array (item, users)
    const [usersItems, setUsersItems] = React.useState(Array.from({length : tableData.length}, () => Array.from({length: numPeople}, () => null)))

    function calcTotalPrice() {
        var price = 0;
        tableData.forEach(item => price += Number(item['PRICE']));
        setTotalPrice(price.toFixed(2));
    }
    
    return (

        /*
        1. OCR CAMERA
        2. LIST ITEMS VIEW OF RECEIPT  (USER SELECTS LOOKS GOOD OR TAKE AGAIN) 
        3. TOTAL PRICE, CHOOSE NUM PEOPLE, ONLY SHOW CHECKBOX TABLE IF USER SELECTS INDIVIDUAL
        */
    <ScrollView>
        {!dataConfirmed ?
        <View style = {styles.container}>
            
            <View style = {{ marginTop: 150, marginBottom: -150}}>
                <Text h1 style = {{textAlign: 'center', fontWeight: 'bold', color: '#02c736'}}>Looks Good?</Text>
                <Text style = {{textAlign: 'center', marginTop: 30, marginBottom: -30}}> Check if all the information is correct.</Text>
            </View>

            <View style = {styles.listItemContainer}>
                {tableData.map((rowData, index) => (
                    <ListItem bottomDivider key={index}>
                        <ListItem.Content style = {styles.listItemContent}>
                            <ListItem.Title style = {{color: "#02c736", fontWeight: 'bold'}}>{rowData['ITEM']}</ListItem.Title>
                            <ListItem.Subtitle>Price: ${rowData['PRICE']}</ListItem.Subtitle>
                        </ListItem.Content>
                    </ListItem>
                ))}
            </View>
            <View style = {styles.buttonContainer}>
                <Button color="#02c736" buttonStyle = {{borderRadius: 10}} size="md" onPress={() => {setDataConfirmed(true); calcTotalPrice()}}>Continue</Button>
            </View>
        </View>
        :
        <View>
            <Text h2 align = "center" containerStyle={{ marginBottom: 20 }}>Total Price: {totalPrice}</Text>
            
            <Text h4 align = "center" containerStyle={{ marginBottom: 20 }}> Number of People</Text>
            <Button size="md" onPress={() => {if (numPeople != 0) {
                setNumPeople(numPeople - 1)
            }}}>-</Button>
            <Text h4> {numPeople}</Text>
            <Button size="md" onPress={() => setNumPeople(numPeople + 1)}>+</Button>

            <Text align = "center" style = {styles.subHeader}
                containerStyle={{ marginBottom: 20 }}
            >Choose How To Split</Text>
            <ButtonGroup
                align = "center"
                buttons= {["EVENLY", "INDIVIDUALLY"]}
                selectedIndex = {evenOrIndiv}
                onPress = {(value) => {
                    setEvenOrIndiv(value);
                }}
                containerStyle={{ marginBottom: 20 }} />
            {evenOrIndiv !== 0 ?
                <View style = {styles.container} align = "center">
                    <Text>Select Which User Ordered Which Dish</Text>
                    <ButtonGroup 
                        buttons={ Array.from({length: numPeople}, (_, i) => i + 1)}
                        selectedIndex={selectedUser}
                        onPress={(value => 
                            {
                                setSelectedUser(value);
                                for (let i = 0; i < usersItems.length; i++) {
                                    if (usersItems[i][value] === true) {
                                        checked[i] = true;
                                    } else {
                                        checked[i] = false;
                                    }
                                }
                            }
                        )}
                    />
                    {tableData.map((rowData, index) => (
                        <ListItem 
                            key={index}
                        bottomDivider>
                            <ListItem.CheckBox
                            // Use ThemeProvider to change the defaults of the checkbox
                            iconType="material-community"
                            checkedIcon="checkbox-marked"
                            uncheckedIcon="checkbox-blank-outline"
                            checked={checked[index]}
                            onPress={() => setChecked((prevList) => {
                                    const newList = [...prevList];
                                    newList[index] = !newList[index];
                                    return newList;
                                })
                            }
                            />
                            <ListItem.Content>
                                <ListItem.Title>{rowData['ITEM']}</ListItem.Title>
                                <ListItem.Subtitle>{rowData['PRICE']}</ListItem.Subtitle>
                            </ListItem.Content>

                            {usersItems[index].map((item, index) => {
                                if (item) {
                                    return <Text key={index}>{index + 1}</Text>
                                }
                            })}
                            <ListItem.Chevron />
                        </ListItem>
                    ))}
                <Button align="center" onPress={() => 
                    checked.forEach((item, index) => {if (item) {
                        const updatedItems = [...usersItems];
                        updatedItems[index][selectedUser] = true;
                        setUsersItems(updatedItems);
                    } else {
                        const updatedItems = [...usersItems];
                        updatedItems[index][selectedUser] = false;
                        setUsersItems(updatedItems);
                    }})
                }>Add</Button> 
                </View>
                : <View></View>
            }
        
            <Button align = "center">CONTINUE</Button> 

            
        </View>

    }
    </ScrollView>
        /* // <View style={styles.container}>
        //     <Table borderStyle={styles.table}>
        //         <Row
        //             data={Object.keys(tableData[0])} // Use the keys of the first object as table headers
        //             style={styles.head}
        //             textStyle={styles.headText}
        //         />
        //         <Rows
        //             data={tableData.map((rowData) => Object.values(rowData))}
        //             textStyle={styles.rowText}
        //         />
        //     </Table>
        // </View> */
    );
};

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
        position: 'absolute',
        bottom: 20,
        width: '100%',
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
      },
});