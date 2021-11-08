import axios from "axios";
import React, { useState } from "react";

function CheckStatus() {
    var [invoiceID, setInvoiceID] = useState('');

    function handleInvoiceStatus() {
        axios.get(`invoice/${invoiceID}`)
            .then(res => {
                var s = res.data.invoice_status;
                alert(`invoice_status: ${s}`);
            })
            .catch(err => {
                alert(err)
                console.log(err.error)
            })
    }

    return (
        <div className='container mt-3'>
            <h1>Check Status</h1>
            <label htmlFor='invoice'></label>
            <input type='text' placeholder='Invoice Number' val={invoiceID} onChange={(e) => setInvoiceID(e.target.value)} />
            <button className='btn btn-primary p-1' onClick={handleInvoiceStatus}>Check Status</button>

        </div>
    )
}

export default CheckStatus;