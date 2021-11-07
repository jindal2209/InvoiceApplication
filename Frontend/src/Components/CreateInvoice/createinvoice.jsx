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
            Show invoice {invoice_id}
        </div>
    )
}

export default CreateInvoice;