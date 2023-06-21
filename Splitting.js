import React, { useState } from 'react';
import { Table, Row, Rows } from "react-native-table-component";
import { StyleSheet, View } from 'react-native';

export default function Splitting(imageData) {
    console.log(imageData['imageData'])
    const tableData = imageData['imageData'];
    

    return (
        <View style={styles.container}>
            <Table borderStyle={styles.table}>
                <Row
                    data={Object.keys(tableData[0])} // Use the keys of the first object as table headers
                    style={styles.head}
                    textStyle={styles.headText}
                />
                <Rows
                    data={tableData.map((rowData) => Object.values(rowData))}
                    textStyle={styles.rowText}
                />
            </Table>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, paddingTop: 30, backgroundColor: '#fff' },
    table: { borderWidth: 1, borderColor: '#c1c0b9' },
    head: { height: 40, backgroundColor: '#f1f8ff' },
    headText: { margin: 6, fontWeight: 'bold' },
    rowText: { margin: 6 },
});