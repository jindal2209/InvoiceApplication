import axios from "axios";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router";

function loadScript(src) {
    return new Promise((resolve) => {
        const script = document.createElement('script')
        script.src = src
        script.onload = () => {
            resolve(true)
        }
        script.onerror = () => {
            resolve(false)
        }
        document.body.appendChild(script)
    })
}

function ShowInvoice() {
    var { invoice_id } = useParams();
    var [customerName, setCustomerName] = useState('')
    var [customerEmail, setCustomerEmail] = useState('')
    var [companyName, setCompanyName] = useState('')
    var [invoiceDate, setInvoiceDate] = useState('')
    var [totalAmount, setTotalAmount] = useState(0)
    var [invoiceStatus, setInvoiceStatus] = useState('')
    var [itemsData, setItemsData] = useState([])

    useEffect(() => {
        axios.get(`invoice/${invoice_id}`)
            .then(res => {
                var data = res.data;
                setCompanyName(data.company_name);
                setInvoiceDate(data.invoice_date);
                setCustomerName(data.customer_name);
                setCustomerEmail(data.customer_email);
                setTotalAmount(data.total_amount);
                setInvoiceStatus(data.invoice_status);
                setItemsData(data.items_data);
            })
            .catch(err => alert(err))
    }, [invoice_id])


    async function createOrder() {
        const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js')

        if (!res) {
            alert('Razorpay SDK failed to load. Are you online?')
            return
        }

        var data = {}, options = {};
        axios.post('create_order/', { 'amount': totalAmount })
            .then((res) => {
                data = res.data
                options = {
                    key: data.razorpay_merchant_key,
                    currency: data.currency,
                    amount: data.razorpay_amount.toString(),
                    order_id: data.razorpay_order_id,
                    name: `Invoice-${invoice_id} Payment`,
                    description: 'Thank you for paying invoice. Please give us some money',
                    // image: 'http://localhost:3000/logo.svg',
                    callback_url: data.callback_url,
                    handler: function (response) {
                        axios.post(data.callback_url, { ...response, 'amount': data.razorpay_amount, 'customer_name': customerName, 'customer_email': customerEmail, 'invoice_id': invoice_id })
                            .then((verification_res) => {
                                alert('Payment Successful');
                                window.location.reload();
                            })
                    },
                    prefill: {
                        name: customerName,
                        email: customerEmail,
                    }
                }
                const paymentObject = new window.Razorpay(options)
                paymentObject.open()
            })
            .catch((err) => {
                console.log('error: ', err)
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
                    <div className="mb-4 mt-3">
                        <div className="customer-info">
                            <div className="float-end text-end">
                                <b>Status: {invoiceStatus}</b>
                                <br />
                                {
                                    invoiceStatus === 'pending' ?
                                        <button className='btn btn-primary' onClick={createOrder}>Pay Now</button>
                                        :
                                        invoiceStatus === 'overdue' ?
                                            <button className='btn btn-danger' onClick={createOrder}>Overdue</button>
                                            :
                                            <div className='btn btn-success'>Paid</div>
                                }
                            </div>
                            <b>Company: {companyName}</b>
                            <br />
                            <b>Billing Date: {invoiceDate}</b>
                            <br />
                            <b>Billed To: {customerName}</b>
                            <br />
                            <b>Email ID: {customerEmail}</b>
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
                            </tr>
                        </thead>
                        <tbody>
                            {
                                itemsData.map((data, idx) => {
                                    return (
                                        <tr key={idx}>
                                            <th className='text-center' scope="row">{data.item_id}</th>
                                            <td className='text-center'>{data.item_name}</td>
                                            <td className='text-center'>{data.quantity}</td>
                                            <td className='text-center'>{data.item_price}</td>
                                            <td className='text-center'>{data.item_price * data.quantity}</td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </table>
                    <div className="float-end text-end"><b>Total Amount: Rs {totalAmount}</b></div>
                </div>
            </div>
        </div>
    )
}

export default ShowInvoice;