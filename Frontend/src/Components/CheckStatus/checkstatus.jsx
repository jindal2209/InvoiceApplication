import axios from "axios";
import React, { useState } from "react";
import { NavLink } from "react-router-dom";

function CheckStatus() {
    var [invoiceID, setInvoiceID] = useState('');
    var [ele, setEle] = useState(<div></div>);

    function handleInvoiceStatus() {
        if (invoiceID.length === 0) {
            setEle(<span className='text-danger fw-bold h5 mx-2'>Enter Invoice Number</span>)
            return;
        }
        axios.get(`invoice/${invoiceID}`)
            .then(res => {
                setEle(<NavLink to={`invoice/${invoiceID}`} className='text-success fw-bold h5 mx-2'>Check Status here</NavLink>)
            })
            .catch(err => {
                setEle(<span className='text-danger fw-bold h5 mx-2'>Invoice Number not found</span>)
            })
    }

    return (
        <div className='container mt-3'>
            <h1 className='mb-3'>Check Status</h1>
            <input className='mx-2' type='text' placeholder='Invoice Number' val={invoiceID} onChange={(e) => setInvoiceID(e.target.value)} />
            <br />
            <button className='btn btn-primary p-1 m-2' onClick={handleInvoiceStatus}>Check Status</button>
            <br />
            {ele}
        </div>
    )
}

export default CheckStatus;