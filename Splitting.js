import React, { useState, useEffect} from 'react';
import { Table, Row, Rows } from "react-native-table-component";
import { ScrollView, StyleSheet, View, Dimensions } from 'react-native';
import { ButtonGroup, ListItem } from '@rneui/base';
import { Button, Text } from '@rneui/themed';
import { ListItemChevron } from '@rneui/base/dist/ListItem/ListItem.Chevron';


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
    <ScrollView scrollEnabled = {false}>
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
                    <Button color="#02c736" size="md" onPress={() => {setDataConfirmed(true); calcTotalPrice()}}>Continue</Button>
                </View>
        </View>
        : 
        <View style = {styles.container}>

            <View style = {{marginTop: 125, marginBottom:0}}>
                <Text h2 style = {{textAlign: 'center',  marginBottom: 20}} >Total Price:</Text>
                <Text h1 style = {{textAlign: 'center', fontWeight: 'bold', color: '#02c736'}} containerStyle = {{marginBottom: 20}}>{totalPrice}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20, marginTop:30 }}>
                    <Text h4 align = "center" containerStyle={{ marginBottom: 20 }}> Number of People:</Text>
                    <View style = {{marginLeft: 20 , flexDirection: 'row', alignItems: 'center'}}>
                        <Button buttonStyle = {{marginRight: 30}} color = '#fff' titleStyle = {{color:'#02c736'}} size="md" onPress={() => {if (numPeople != 0) {
                            setNumPeople(numPeople - 1)
                        }}}>-</Button>
                        <Text h4 style = {{fontWeight: 'bold'}}> {numPeople}</Text>
                        <Button buttonStyle = {{marginLeft: 30}} color = '#fff' titleStyle = {{color:'#02c736'}} size="md" onPress={() => setNumPeople(numPeople + 1)}>+</Button>
                    </View>
                </View>
                <Text style = {{textAlign: 'center'}}
                    containerStyle={{ marginBottom: 20 }}
                >Choose How To Split</Text>
                <ButtonGroup
                    align = "center"
                    buttons= {["EVENLY", "INDIVIDUALLY"]}
                    selectedIndex = {evenOrIndiv}
                    onPress = {(value) => {
                        setEvenOrIndiv(value);
                    }}
                    containerStyle={{ marginBottom: 20}}
                    selectedButtonStyle = {{backgroundColor: '#02c736'}}
                    selectedTextStyle = {{color: 'white'}}

                     />
                </View>    
                <View style = {styles.listItemContainer}>
                {evenOrIndiv !== 0 ?
                    <View style = {styles.container} align = "center">
                        <Text style = {{textAlign: 'center'}}>Select Which User Ordered Which Dish</Text>
                        <ButtonGroup
                            selectedButtonStyle = {{backgroundColor: '#02c736'}}
                            selectedTextStyle = {{color: 'white'}}
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
                        <ScrollView>
                        {tableData.map((rowData, index) => (
                            <ListItem 
                                key={index}
                            bottomDivider>
                                <ListItem.CheckBox
                                // Use ThemeProvider to change the defaults of the checkbox
                                checkedColor='#02c736'
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
                                    <ListItem.Title style = {{color: "#02c736", fontWeight: 'bold'}}>{rowData['ITEM']}</ListItem.Title>
                                    <ListItem.Subtitle>${rowData['PRICE']}</ListItem.Subtitle>
                                </ListItem.Content>
                                {usersItems[index].map((item, index) => {
                                    if (item) {
                                        return <Text style = {{color: '#02c736'}} key={index}>{index + 1}</Text>
                                    }
                                })}
                 
                            </ListItem>
                        ))}
                        </ScrollView>
                    <Button align="center" size = 'md' color="#02c736" buttonStyle = {{borderRadius: 10}} style = {{width: '100%', justifyContent: 'center', alignItems: 'center', marginTop: 20}} onPress={() => 
                        checked.forEach((item, index) => {if (item) {
                            const updatedItems = [...usersItems];
                            updatedItems[index][selectedUser] = true;
                            setUsersItems(updatedItems);
                        } else {
                            const updatedItems = [...usersItems];
                            updatedItems[index][selectedUser] = false;
                            setUsersItems(updatedItems);
                        }})
                    }>Confirm Selection</Button> 
                    </View>
                    : <View></View>
                }
            </View>
            
            <View style = {styles.buttonContainer}>
                <Button color="#02c736"  size="md">CONTINUE</Button> 
            </View>

            
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
        marginTop: 50,
        width: '100%',

      },
    
});

