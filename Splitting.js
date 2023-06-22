import React, { useState } from 'react';
import { Table, Row, Rows } from "react-native-table-component";
import { ScrollView, StyleSheet, View } from 'react-native';
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
        <View>
            {tableData.map((rowData, index) => (
                <ListItem bottomDivider key={index}>
                    <ListItem.Content>
                        <ListItem.Title>{rowData['ITEM']}</ListItem.Title>
                        <ListItem.Subtitle>Price: {rowData['PRICE']}</ListItem.Subtitle>
                    </ListItem.Content>
                    <ListItem.Chevron />
                </ListItem>
            ))}
            <Button size="md" onPress={() => {setDataConfirmed(true); calcTotalPrice()}}>Looks Good!</Button>
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
    container: { flex: 1, padding: 16, paddingTop: 30, backgroundColor: '#fff' },
    table: { borderWidth: 1, borderColor: '#c1c0b9' },
    head: { height: 40, backgroundColor: '#f1f8ff' },
    headText: { margin: 6, fontWeight: 'bold' },
    rowText: { margin: 6 },
});