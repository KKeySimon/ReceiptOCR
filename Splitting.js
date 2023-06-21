import React, { useState } from 'react';
import Table from "react-native-table-component";

export default function Splitting(imageData) {
    console.log(imageData['imageData'])
    const [data, setData] = useState(imageData['imageData']);
    console.log(data)
    const columns = [
        {
            title: "Item Name",
            dataKey: "ITEM",
        },
        {
            title: "Price",
            dataKey: "PRICE",
        }
    ];
    console.log(typeof data)
    const styles = {
        table: {
            borderRadius: 10,
            borderColor: "#ccc",
            borderWidth: 1,
        },
        row: {
            padding: 10,
        },
        cell: {
            fontSize: 16,
        },
    };

    return (
        <Table
            data={data}
            columns={columns}
            styles={styles}
        />
    );
};