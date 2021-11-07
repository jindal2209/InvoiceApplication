import React from "react";
import { NavLink } from "react-router-dom";

function Header() {
    return (
        <div>
            <header className='bg-light p-3 fw-bold border'><NavLink to='/' className='text-decoration-none text-dark'>Invoice Application</NavLink></header>
        </div >
    )
}

export default Header;