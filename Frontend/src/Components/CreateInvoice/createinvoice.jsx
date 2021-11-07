import axios from "axios";
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";

function CreateInvoice() {
    var { invoice_id } = useParams();
    useEffect(() => {
        axios.post()
            .then()
            .catch()
    }, [])
    return (
        <div>
            <div class="sympatico-logo">
                <img src={process.env.PUBLIC_URL+"/logo.png"} height="200px"></img>
            </div>

            <div class="invoice-head">
                <h1>INVOICE</h1>
            </div>

            <div class="customer-info">
                <b>Bill To:</b>
                <br />
                Tushar Gupta
                <br />
                Customer ID: 2109
            </div>

            <br />

            <table class="table">
                <thead class="table-dark">
                    <tr>
                        <th scope="col">Item ID</th>
                        <th scope="col">Item Name</th>
                        <th scope="col">Quantity</th>
                        <th scope="col">Price (Rs)</th>
                        <th scope="col">Total Price (Rs)</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <th scope="row">102</th>
                        <td>Sugar (1kg)</td>
                        <td>2</td>
                        <td>40.00</td>
                        <td>80.00</td>
                    </tr>
                    <tr>
                        <th scope="row">205</th>
                        <td>Coffee</td>
                        <td>1</td>
                        <td>150.00</td>
                        <td>300.00</td>
                    </tr>
                    <tr>
                        <th scope="row">103</th>
                        <td>Honey</td>
                        <td>4</td>
                        <td>250.00</td>
                        <td>1000.00</td>
                    </tr>
                    <tr>
                        <th scope="row">503</th>
                        <td>Oil</td>
                        <td>3</td>
                        <td>200.00</td>
                        <td>600.00</td>
                    </tr>
                </tbody>
            </table>

            <div class="plus">
                <a href="#" class="more">+</a>
                Add Item
            </div>

            <div class="total">
                <b>Total: Rs 1980.00</b>
            </div>
        </div>
    )
}

export default CreateInvoice;