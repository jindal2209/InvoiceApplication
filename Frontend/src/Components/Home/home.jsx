import React, { useEffect } from "react";
import {
    NavLink
} from 'react-router-dom';

function Home() {
    useEffect(() => {
    }, [])

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
            <div className="row mt-5">
                <NavLink to='/create_invoice'> <button class="btn btn-primary btn-lg">Create Invoice</button></NavLink>
            </div>
            <div className="row my-2">
                <NavLink to='/add_item'> <button class="btn btn-primary btn-lg">Add Items</button></NavLink>
            </div>
            <div className="row">
                <NavLink to='/check_invoice_status'> <button class="btn btn-primary btn-lg">Check Invoice Status</button></NavLink>
            </div>
        </div>
    )
}

export default Home;