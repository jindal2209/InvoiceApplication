import React, { useEffect } from "react";
import {
    NavLink
} from 'react-router-dom';

function Home() {
    useEffect(() => {
    }, [])

    return (
        <div className='p-3 my-2'>
            <ul>
                <li>
                    <NavLink to='/create_invoice'>Create Invoice</NavLink>
                </li>
                <li>
                    <NavLink to='/add_item'>Add Items</NavLink>
                </li>
                <li>
                    <NavLink to='/check_invoice_status'>Check Invoice Status</NavLink>
                </li>
            </ul>
        </div>
    )
}

export default Home;