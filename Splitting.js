import React, { useState, useEffect} from 'react';
import { Table, Row, Rows } from "react-native-table-component";
import { ScrollView, StyleSheet, View, Dimensions } from 'react-native';
import { ButtonGroup, ListItem } from '@rneui/base';
import { Button, Text, Icon } from '@rneui/themed';
import { ListItemChevron } from '@rneui/base/dist/ListItem/ListItem.Chevron';
import CustomButton from './src/components/CustomButton';
import Result from './Result';


export default function Splitting({imageData, onUpdateImageData}) {
    const tableData = imageData;
    //Todo: When editing arrays, should make a copy and then use the setter method to avoid
    
    const [checked, setChecked] = React.useState(new Array(imageData.length).fill(false));
    const [numPeople, setNumPeople] = React.useState(1);
    const [selectedUser, setSelectedUser] = React.useState(0);
    const [totalPrice, setTotalPrice] = React.useState(0);
    const [evenOrIndiv, setEvenOrIndiv] = React.useState(0);
    const [dataConfirmed, setDataConfirmed] = React.useState(false);
    //2D array (item, users)
    const [usersItems, setUsersItems] = React.useState(Array.from({length : tableData.length}, () => Array.from({length: numPeople}, () => null)));
    const [showFinalPrices, setShowFinalPrices] = React.useState(false);
    const [finalPrices, setFinalPrices] = React.useState([]);

    const updateFinalPrices = () => {
        setShowFinalPrices(false);
    }

    const isUsersItemsOutOfbounds = () => {
        const updatedItems = [...usersItems]
        updatedItems.forEach((row, index) => {
            if (row.length === numPeople) {
                updatedItems[index] = row.slice(0, row.length - 1);
            }
        });
        setUsersItems(updatedItems)

        if (selectedUser + 1 === numPeople) {
            for (let i = 0; i < usersItems.length; i++) {
                if (usersItems[i][selectedUser - 1] === true) {
                    checked[i] = true;
                } else {
                    checked[i] = false;
                }
            }
            setSelectedUser(selectedUser - 1);
        }
        
    }

    function calcFinalPrices() {
        let usersPrices = [];
        for (let i = 0; i < usersItems.length; i++) {
            
            let itemPrice = Number(tableData[i]['PRICE']);
            
            let selected = false;
            let users = [];
            
            for (let j = 0; j < usersItems[i].length; j++) {
                if (usersItems[i][j] === true) {
                    selected = true;
                    users.push(j);
                }
            }
            if (!selected) {
                for (let j = 0; j < numPeople; j++) {
                    users.push(j);
                }
            }
            itemPrice = itemPrice / users.length;
            for (let j = 0; j < users.length; j++) {
                if (usersPrices[users[j]] === undefined) {
                    usersPrices[users[j]] = {
                        totalPrice: 0,
                        items: [],
                    };                
                }
                usersPrices[users[j]].totalPrice += itemPrice;
                usersPrices[users[j]].items.push([itemPrice.toFixed(2),[tableData[i]['ITEM']], users.length])
            }
        }
    
        setFinalPrices(usersPrices)
    }

    function calcTotalPrice() {
        var price = 0;
        tableData.forEach(item => price += Number(item['PRICE']));
        setTotalPrice(price.toFixed(2));
    }

    function updateUsersItems(index) {
        const updatedItems = [...usersItems];
        updatedItems[index][selectedUser] = !usersItems[index][selectedUser];
        setUsersItems(updatedItems);
    }

    const handleClick = () => {
        onUpdateImageData();
    };
    
    

    return (

        /*
        1. OCR CAMERA
        2. LIST ITEMS VIEW OF RECEIPT  (USER SELECTS LOOKS GOOD OR TAKE AGAIN) 
        3. TOTAL PRICE, CHOOSE NUM PEOPLE, ONLY SHOW CHECKBOX TABLE IF USER SELECTS INDIVIDUAL
        */
    !showFinalPrices 
        ?
        <ScrollView scrollEnabled = {false}>
            {!dataConfirmed ?
            <View style = {styles.container}>
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    padding: 30,
                }}><CustomButton icon='level-up' onPress={() => handleClick()} color='gray' />
                </View>
                <View style = {{ marginTop: 150, marginBottom: -150}}>
                
                    <Text h1 style = {{textAlign: 'center', fontWeight: 'bold', color: '#02c736'}}>Looks Good?</Text>
                    <Text style = {{textAlign: 'center', marginTop: 30, marginBottom: -30}}> Check if all the information is correct.</Text>
                </View>

                <View style = {styles.listItemContainer}>
                    {tableData.map((rowData, index) => (
                        <ListItem bottomDivider topDivider key={index}>
                            <ListItem.Content style = {styles.listItemContent}>
                                <ListItem.Title style = {{color: "#02c736", fontWeight: 'bold'}}>{rowData['ITEM']}</ListItem.Title>
                                <ListItem.Subtitle>Price: ${rowData['PRICE']}</ListItem.Subtitle>
                            </ListItem.Content>
                        </ListItem>
                    ))}
                </View>
            
                <View style = {styles.buttonContainer}>
                    <Button color="#02c736" size="lg" buttonStyle = {{height: 70}} titleStyle = {{fontSize: 24, fontWeight: 'bold'}} onPress={() => {setDataConfirmed(true); calcTotalPrice()}}>CONTINUE</Button>
                </View>
            </View>
            : 
            <View style = {styles.container}>
                <View style={{
                    marginBottom: -100,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    padding: 30,
                }}>
                    <CustomButton icon='level-up' onPress={() => handleClick()} color='gray' />
                </View>
                <View style = {{marginTop: 125, marginBottom:0}}>
                    <Text h2 style = {{textAlign: 'center',  marginBottom: 20}} >Total Price:</Text>
                    <View style={styles.listItemContent}>
                        <View style={styles.priceTextBox}>
                        <Text h1 style={{ textAlign: 'center', fontWeight: 'bold', color: '#fff' }}>
                            ${totalPrice}
                        </Text>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20, marginTop:30 }}>
                        <Text h4 align = "center" style = {{marginLeft: 10}}> Number of People:</Text>
                        <View style = {{marginLeft: 20 , flexDirection: 'row', alignItems: 'center'}}>
                            <Button buttonStyle = {{marginRight: 30}} color = '#fff' titleStyle = {{color:'#02c736'}} size="md" onPress={() => {if (numPeople != 1) {
                                setNumPeople(numPeople - 1);
                                isUsersItemsOutOfbounds();
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
                            <Text style = {{textAlign: 'center'}}>If an item isn't selected, it will be evenly distributed.</Text>
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
                                bottomDivider
                                topDivider>
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
                                            updateUsersItems(index)
                                            return newList;
                                        })  
                                    }
                                    />
                                    <ListItem.Content>
                                        <ListItem.Title style = {{color: "#02c736", fontWeight: 'bold'}}>{rowData['ITEM']}</ListItem.Title>
                                        <ListItem.Subtitle>${rowData['PRICE']}</ListItem.Subtitle>
                                    </ListItem.Content>
                                    {usersItems[index].map((item, index) => {
                                        if (item === true) {
                                            return <Text style = {{color: '#02c736'}} key={index}>{index + 1}</Text>;
                                        }
                                    })}
                                </ListItem>
                            ))}
                            </ScrollView>
                        </View>
                        : <View></View>
                    }
                </View>
                
                <View style = {styles.buttonContainer}>
                    <Button color="#02c736"  size="lg" buttonStyle = {{height: 70}} onPress={() => {calcFinalPrices(); setShowFinalPrices(true)}} titleStyle = {{fontSize: 24, fontWeight: 'bold'}}>CONTINUE</Button> 
                </View>

                
            </View>

            }
        </ScrollView>
        :
        <View>
            <Result data={finalPrices} onUpdateFinalPrices={updateFinalPrices} onUpdateImageData={onUpdateImageData}/>
        </View>
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

