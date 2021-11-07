import axios from "axios";
import React, { useState } from "react";

function AddItem() {
    var [itemName, setItemName] = useState('');
    var [itemPrice, setItemPrice] = useState('');

    function handleItemAdd() {
        if (itemName.trim() === '' || itemPrice.trim() === '') {
            alert("please fill the details correctly")
            return;
        }
        axios.post('create_item/', { 'item_name': itemName, 'item_price': itemPrice })
            .then(res => {
                alert('item added successfully')
            })
            .catch(err => {
                alert('Error in adding data try again later')
            })
    }

    return (
        <div className='container mt-3'>
            <h1>Add Item</h1>
            <input type='text' placeholder='Item Name' val={itemName} onChange={(e) => setItemName(e.target.value)} />
            <input type='text' placeholder='Item Price' val={itemPrice} onChange={(e) => setItemPrice(e.target.value)} />
            <button className='btn btn-primary p-1' onClick={handleItemAdd}>Add Item</button>
        </div>
    )
}

export default AddItem;