export default function Result({usersItems, numPeople, imageData}) {
    const tableData = imageData

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
                usersPrices[users[j]].items.push([tableData[i]['PRICE'],[tableData[i]['ITEM']], users.length])
            }
        }
    
        return usersPrices;
    }
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
        </ScrollView>
    )
}