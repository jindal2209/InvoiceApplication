import axios from "axios";
import React, { useEffect, useState } from "react";

function ItemComponent(props) {
    var [qty, setQty] = useState(0);
    var [itemTotal, setItemTotal] = useState(0);
    var [itemPrice, setItemPrice] = useState(0);
    var [itemID, setItemID] = useState('-1');
    var { invoiceItems, itemsList, setTotalAmount, deleteInvoiceItem, setInvoiceItem } = props;

    useEffect(() => {
        setTotalAmount(prev => prev - itemTotal + qty * itemPrice)
        setItemTotal(qty * itemPrice)
        // eslint-disable-next-line
    }, [qty])

    function decrementQuantity() {
        setQty(prev => {
            if (prev <= 0)
                return 0;
            return prev - 1;
        });
        var val = itemsList.filter(obj => obj.item_no === itemID)
        val = val[0]
        var arr = [...invoiceItems];
        arr = arr.filter(obj => obj.item_no !== itemID)
        val['quantity'] = (qty <= 0) ? 0 : qty + 1;
        val['item_total_price'] = qty * val.item_price;
        arr.push(val);
        setInvoiceItem(arr);
    }

    function incrementQuantity() {
        setQty(prev => prev + 1);
        var val = itemsList.filter(obj => obj.item_no === itemID)
        val = val[0]
        var arr = [...invoiceItems];
        arr = arr.filter(obj => obj.item_no !== itemID)
        val['quantity'] = qty + 1;
        val['item_total_price'] = qty * val.item_price;
        arr.push(val);
        setInvoiceItem(arr);
    }

    function handleItemDelete() {
        setTotalAmount(prev => prev - itemTotal)
        deleteInvoiceItem(itemID)
    }

    function selectObject(val) {
        setItemPrice(val.item_price);
        setItemID(val.item_no);
        var arr = [...invoiceItems]
        arr = arr.filter(obj => obj.item_no !== itemID)
        val['quantity'] = qty;
        val['item_total_price'] = itemTotal;
        arr.push(val);
        setInvoiceItem(arr);
    }

    return (
        <tr>
            <th className='text-center' scope="row">{itemID}</th>
            <td className='text-center'>
                <select>
                    <option>SELECT</option>
                    {itemsList.map((val, idx) => {
                        return (
                            <option key={idx} onClick={() => selectObject(val)}>{val.item_name}</option>
                        )
                    })}
                </select>
            </td>
            <td className='text-center'>
                <button className='btn btn-sm btn-outline-primary mx-2' onClick={decrementQuantity}><i className="bi bi-dash"></i></button>
                <span className='px-2'>{qty}</span>
                <button className='btn btn-sm btn-outline-primary mx-2' onClick={incrementQuantity}><i className="bi bi-plus"></i></button>
            </td>
            <td className='text-center'>{itemPrice}</td>
            <td className='text-center'>{itemTotal}</td>
            <td className='text-center'><button className='btn btn-sm btn-danger' onClick={handleItemDelete}><i className="bi bi-trash-fill"></i></button></td>
        </tr>
    )
}

function CreateInvoice() {
    // list data
    var [itemsList, setItemsList] = useState([]);
    // eslint-disable-next-line
    var [companiesList, setCompaniesList] = useState([]);

    // invoice data
    var [customerName, setCustomerName] = useState('');
    var [customerEmail, setCustomerEmail] = useState('');
    var [totalAmount, setTotalAmount] = useState(0);
    var [invoiceItems, setInvoiceItem] = useState([])

    var d = new Date();

    useEffect(() => {
        // get data
        axios.get('get_companies/')
            .then((company_res) => {
                setCompaniesList(company_res.data)
                axios.get('get_items/')
                    .then((items_res) => {
                        setItemsList(items_res.data)
                    })
                    .catch((err) => {
                        console.log(err)
                    })
            })
            .catch((err) => {
                console.log(err)
            })
    }, [])

    function addInvoiceItem() {
        if (itemsList.length === invoiceItems.length) {
            alert('Cannot add items more than the number of available items check for duplicate enteries in invoice');
            return;
        }
        setInvoiceItem(prev => [...prev, { item_no: '-1', item_name: '', item_price: 0, quantity: 0, item_total_price: 0 }])
    }

    function deleteInvoiceItem(id) {
        var arr = [...invoiceItems];
        arr = arr.filter(obj => obj.item_no !== id)
        console.log(arr)
        setInvoiceItem(arr)
    }

    function handleInvoiceGenerate() {
        if (invoiceItems.length === 0 || totalAmount === 0) {
            alert('Please add atleast one item')
            return;
        }
        if (customerEmail.trim() === '') {
            alert('Please add customer email')
            return;
        }
        if (customerName.trim() === '') {
            alert('Please add customer name')
            return;
        }
        axios.post('create_invoice/', {
            'customer_name': customerName,
            'customer_email': customerEmail,
            'company_id': 1,
            'total_amount': totalAmount,
            'items_list': invoiceItems
        })
            .then((res) => {
                alert('invoice created your invoice number is: ', res.data.invoice_id)
            })
            .catch(err => {
                console.log(err)
            })
    }

    return (
        <div className='container py-3'>
            <div className="row">
                <div className="col-12">
                    <div className="float-start">
                        <img src={process.env.PUBLIC_URL + "/logo.png"} height="80" alt='logo' />
                    </div>
                    <div className="float-end h1">Invoice</div>
                </div>
            </div>
            <div className="row">
                <div className="col-md-12">
                    <div className="mb-5 mt-3">
                        <div className="customer-info">
                            <b>Billing Date: {d.toLocaleDateString()}</b>
                            <br />
                            <b>Bill To:</b>
                            <div className="row g-3">
                                <div className="col-md-6">
                                    <label htmlFor="inputname" className="form-label">Customer Name</label>
                                    <input type="text" className="form-control form-control-sm" id="inputname" placeholder='Customer Name' value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
                                </div>
                                <div className="col-md-6">
                                    <label htmlFor="inputEmail4" className="form-label form-label-sm">CustomerEmail</label>
                                    <input type="email" className="form-control form-control-sm" id="inputEmail4" placeholder='Customer Email' value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)} />
                                </div>
                            </div>
                        </div>
                    </div>

                    <table className="table">
                        <thead className="table-dark">
                            <tr>
                                <th className='text-center' scope="col">Item ID</th>
                                <th className='text-center' scope="col">Item Name</th>
                                <th className='text-center' scope="col">Quantity</th>
                                <th className='text-center' scope="col">Price (Rs)</th>
                                <th className='text-center' scope="col">Total Price (Rs)</th>
                                <th className='text-center' scope="col">Remove</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                invoiceItems.map((data, idx) => {
                                    return (
                                        <ItemComponent
                                            key={idx}
                                            invoiceItems={invoiceItems}
                                            itemsList={itemsList}
                                            setInvoiceItem={setInvoiceItem}
                                            setTotalAmount={setTotalAmount}
                                            deleteInvoiceItem={deleteInvoiceItem}
                                        />
                                    )
                                })
                            }
                        </tbody>
                    </table>
                    <div className="float-end text-end"><b>Total Amount: Rs {totalAmount}</b></div>
                    <button className='float-start btn btn-sm btn-success' onClick={addInvoiceItem}><i className="bi bi-plus-lg"></i></button>
                </div>
            </div>
            <div className="row px-5 mx-5 mt-5">
                <button className='btn btn-primary' onClick={handleInvoiceGenerate}>Generate Invoice</button>
            </div>
        </div>
    )
}

export default CreateInvoice;