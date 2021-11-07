import axios from "axios";
import React, { } from "react";
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
    // useEffect(() => {
    //     axios.post()
    //         .then()
    //         .catch()
    // }, [])

    // const [name, setName] = useState('Mehul')

    async function createOrder() {
        const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js')

        if (!res) {
            alert('Razorpay SDK failed to load. Are you online?')
            return
        }

        var data = {}, options = {};
        axios.post('create_order/')
            .then((res) => {
                data = res.data
                options = {
                    key: data.razorpay_merchant_key,
                    currency: data.currency,
                    amount: data.razorpay_amount.toString(),
                    order_id: data.razorpay_order_id,
                    name: 'Invoice Payment',
                    description: 'Thank you for paying invoice. Please give us some money',
                    // image: 'http://localhost:3000/logo.svg',
                    callback_url: data.callback_url,
                    handler: function (response) {
                        axios.post(data.callback_url, { ...response, 'amount': data.razorpay_amount })
                            .then((verification_res) => {
                                alert('Payment Successful')
                            })
                    },
                    prefill: {
                        name: "patient_name",
                        email: 'email',
                        phone_number: 'phone number'
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
        <div className='p-3 my-2'>
            Show invoice {invoice_id}
            <span onClick={createOrder}>Pay</span>
        </div>
    )
}

export default ShowInvoice;