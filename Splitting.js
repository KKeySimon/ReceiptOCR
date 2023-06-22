import React, { useState } from 'react';
import { Table, Row, Rows } from "react-native-table-component";
import { ScrollView, StyleSheet, View } from 'react-native';
import { ButtonGroup, ListItem } from '@rneui/base';
import { Button } from '@rneui/themed';

export default function Splitting(imageData) {
    console.log(imageData['imageData'])
    const tableData = imageData['imageData'];
    
    const [checked, setChecked] = React.useState(new Array(imageData.length).fill(false));
    const [numPeople, setNumPeople] = React.useState(0);
    const [totalPrice, setTotalPrice] = React.useState(0);
    const [evenOrIndiv, setEvenOrIndiv] = React.useState(0);
    const [dataConfirmed, setDataConfirmed] = React.useState(false);


    tableData.forEach(item => setTotalPrice(totalPrice + item['PRICE']));
    
    
    return (

        /*
        1. OCR CAMERA
        2. LIST ITEMS VIEW OF RECEIPT  (USER SELECTS LOOKS GOOD OR TAKE AGAIN) 
        3. TOTAL PRICE, CHOOSE NUM PEOPLE, ONLY SHOW CHECKBOX TABLE IF USER SELECTS INDIVIDUAL
        */
    <ScrollView>
        {!dataConfirmed ?
        <View>
            {tableData.map((rowData) => (
                <ListItem bottomDivider>
                    <ListItem.Content>
                        <ListItem.Title>{rowData['ITEM']}</ListItem.Title>
                        <ListItem.Subtitle>Price: {rowData['PRICE']}</ListItem.Subtitle>
                    </ListItem.Content>
                    <ListItem.Chevron />
                </ListItem>
            ))}
            <Button size="md" onPress={() => setDataConfirmed(true)}>Looks Good!</Button>
        </View>
        :
        <View>
            <Text h2 align = "center" containerStyle={{ marginBottom: 20 }}>Total Price: {totalPrice}</Text>
            
            <Text h4 align = "center" containerStyle={{ marginBottom: 20 }}> Number of People</Text>
            <Stack row align="center" spacing={4}>
                <Button size="md" onPress={() => {if (numPeople != 0) {
                    setNumPeople(numPeople - 1)
                }}}>-</Button>
                <Text h4> {numPeople}</Text>
                <Button size="md" onPress={() => setNumPeople(numPeople + 1)}>+</Button>
            </Stack>
            


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
            

            <View style = {styles.container} align = "center">
                

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
                        <ListItem.Chevron />
                    </ListItem>
                ))}

            </View>
        
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