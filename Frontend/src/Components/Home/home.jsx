import React, { useEffect } from "react";
import {
    NavLink
} from 'react-router-dom';

function Home() {
    useEffect(() => {
    }, [])

    return (
        <div>
            <NavLink to='/create_invoice'>Create Invoice</NavLink>
            <NavLink to='/add_item'>Add Items</NavLink>
            <NavLink to='/check_invoice_status'>Check Invoice Status</NavLink>
        </div>
    )
}

export default Home;