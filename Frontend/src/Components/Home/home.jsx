import React, { useEffect } from "react";
import {
    NavLink
} from 'react-router-dom';

function Home() {
    useEffect(() => {
    }, [])

    return (
        <div>
            <div class="home-logo">
                <img src={process.env.PUBLIC_URL + "/logo.png"} height="250px"></img>
            </div>

            <div class="invoiceapp-head">
                <h1>Invoice App</h1>
            </div>

            <NavLink to='/create_invoice'> <button class="btn btn-primary invoice-button btn-lg">Create Invoice</button></NavLink>
            <NavLink to='/add_item'> <button class="btn btn-primary invoice-button btn-lg">Add Items</button></NavLink>
            <NavLink to='/check_invoice_status'> <button class="btn btn-primary invoice-button btn-lg">Check Invoice Status</button></NavLink>
        </div>
    )
}

export default Home;