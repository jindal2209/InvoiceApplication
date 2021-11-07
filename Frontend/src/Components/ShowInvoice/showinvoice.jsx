import axios from "axios";
import React, { useEffect } from "react";
import { useParams } from "react-router";

function ShowInvoice() {
    var { invoice_id } = useParams();
    useEffect(() => {
        axios.post()
            .then()
            .catch()
    }, [])
    return (
        <div>
            Show invoice {invoice_id}
        </div>
    )
}

export default ShowInvoice;

// import React, { useState } from 'react'
// import logo from './logo.svg'
// import './App.css'

// function loadScript(src) {
// 	return new Promise((resolve) => {
// 		const script = document.createElement('script')
// 		script.src = src
// 		script.onload = () => {
// 			resolve(true)
// 		}
// 		script.onerror = () => {
// 			resolve(false)
// 		}
// 		document.body.appendChild(script)
// 	})
// }

// const __DEV__ = document.domain === 'localhost'

// function App() {
// 	const [name, setName] = useState('Mehul')

// 	async function displayRazorpay() {
// 		const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js')

// 		if (!res) {
// 			alert('Razorpay SDK failed to load. Are you online?')
// 			return
// 		}

// 		const data = await fetch('https://9f2da5ead625.ngrok.io/api/payment', { method: 'POST' }).then((t) =>
// 			t.json()
// 		)

// 		console.log(data)

// 		const options = {
// 			key: __DEV__ ? 'rzp_test_efCADVgg8VMqeR' : 'PRODUCTION_KEY',
// 			currency: data.currency,
// 			amount: data.amount.toString(),
// 			order_id: data.id,
// 			name: 'Donation',
// 			description: 'Thank you for nothing. Please give us some money',
// 			image: 'http://localhost:3000/logo.svg',
// 			handler: function (response) {
// 				// const verify = await fetch('http://localhost:5000/api/payment/verification', {
// 				// 	method: 'POST',
// 				// 	body: JSON.stringify({
// 				// 		razorpay_payment_id: response.razorpay_payment_id,
// 				// 		razorpay_order_id: response.razorpay_order_id,
// 				// 		razorpay_signature: response.razorpay_signature,

// 				// 	}),
// 				// })
// 				// 	.then((t) =>
// 				// 		t.json()
// 				// 	)
// 				console.log(response)
// 				// alert(response.razorpay_payment_id)
// 				// alert(response.razorpay_order_id)
// 				// alert(response.razorpay_signature)
// 			},
// 			prefill: {
// 				name: "patient_name",
// 				email: 'email',
// 				phone_number: 'phone number'
// 			}
// 		}
// 		const paymentObject = new window.Razorpay(options)
// 		paymentObject.open()
// 	}

// 	return (
// 		<div className="App">
// 			<header className="App-header">
// 				<img src={logo} className="App-logo" alt="logo" />
// 				<p>
// 					Edit <code>src/App.js</code> and save to reload.
// 				</p>
// 				<a
// 					className="App-link"
// 					onClick={displayRazorpay}
// 					target="_blank"
// 					rel="noopener noreferrer"
// 				>
// 					Donate ₹1
// 				</a>
// 			</header>
// 		</div>
// 	)
// }

// export default App
