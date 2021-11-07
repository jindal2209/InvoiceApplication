import axios from "axios";
import React, { useEffect } from "react";
import { useParams } from "react-router";

function AddItem() {
    var { invoice_id } = useParams();
    // useEffect(() => {
    //     axios.post()
    //         .then()
    //         .catch()
    // }, [])
    return (
        <div>
            Add item {invoice_id}
        </div>
    )
}

export default AddItem;