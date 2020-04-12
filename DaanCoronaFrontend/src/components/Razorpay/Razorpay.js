import React, { useEffect } from "react";
import { Button, message } from "antd";
import { devURL as URL } from "../../const";
import cd from "../../assets/CORONADAAN.png";

const Razorpay = () => {
    let details = {};
    let options = {
        "key": "rzp_test_cxBvdprdwiST2G", // Enter the Key ID generated from the Dashboard
        "amount": "50000", // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
        "currency": "INR",
        "name": "Acme Corp",
        "description": "Test Transaction",
        "image": cd,
        "order_id": "order_9A33XWu170gUtm", //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
        "handler": function (response){
            sendPaymentDetails(response);
        },
        "prefill": {
            "name": "Gaurav Kumar",
            "email": "gaurav.kumar@example.com",
            "contact": "9999999999"
        },
        "notes": {
            "address": "Razorpay Corporate Office"
        },
        "theme": {
            "color": "#F37254"
        }
    };
    const sendPaymentDetails = (response) => {
        let token = sessionStorage.getItem("token");
        let formdata = new FormData();
        formdata.append("razorpay_payment_id",response.razorpay_payment_id);
        formdata.append("razorpay_order_id",response.razorpay_order_id);
        formdata.append("razorpay_signature",response.razorpay_signature);
        fetch(URL+"/api/pay_callback/", {
            method: "POST",
            headers: {
                "Authorization": "JWT " + token
            },
            body: formdata
        })
        .then(response => response.json())
        .then(res => {
            console.log(res);
            message.success("Yipee! Thanks for donating, check your payment and voucher details in the Payment section!");
        })
        .catch(err => {
            console.log(err);
            message.success("Yipee! Thanks for donating, check your payment and voucher details in the Payment section!");

            // message.warning("Uh oh! Server error, please try again!");
        })
    };
    const payment = async (recepient_id = 1,amount = 50000) => {
        let token = sessionStorage.getItem('token');
        let formdata = new FormData();
        formdata.append('recepient_id',recepient_id);
        formdata.append('amount',amount);
        if(!token) {
            window.location.href = "/";
            message.warning("Please login again!");
        }
        await fetch(URL+"/api/pay/", {
            method: "POST",
            headers: {
                "Authorization":"JWT " + token
            },
            body: formdata
        })
        .then(response => response.json())
        .then(res => {
            if(res) {
                console.log(res);
                details = res;
                options["order_id"] = res.order_id;
                message.success('Success, wait till we redirect you!');
                return res;
            }
        })
        .catch((err) => {
            console.log(err);
            message.error('Server error!');
        })
    };
    const openPayModal = async () => {
        await payment();
        var rzp1 = new window.Razorpay(options);
        rzp1.open();
    };
    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        document.body.appendChild(script);
    }, []);
    return (
        <form action="http://127.0.0.1:8000/dummy/callback/" method="POST">
            <Button onClick={openPayModal}>Pay with Razorpay</Button>
        </form>
    )
}

export default Razorpay;