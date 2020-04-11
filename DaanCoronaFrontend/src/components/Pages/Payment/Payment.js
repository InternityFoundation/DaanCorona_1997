import React from "react";
import classes from "./Payment.module.scss";

import confirmed from "../../../assets/confirmed-red.svg";
import voucher from "../../../assets/voucher.svg";
class Payment extends React.Component {
    render() {
        return (
            <div className={classes.details}>
                <div className={classes.payment}>
                    <img src={confirmed} />
                    <div className={classes.pSummary}>
                        <h2>Thanks for donating to Lalu ki Tapri!</h2>
                        <h3>Payment Summary</h3>
                        <div>
                            <p><b>Amount:</b> $500</p>
                            <p><b>Owner Name:</b> Lalu</p>
                            <p><b>Phone Number:</b> +919999988888</p>
                            <p><b>Address:</b> Shop No: 153A, F. Market, Aman Vihar, New Delhi - 41</p>
                        </div>
                    </div>
                </div>
                <div className={classes.voucher}>
                    <img src={voucher} />
                    <div className={classes.vSummary}>
                        <h3>Voucher details</h3>
                        <div>
                            <p><b>Value:</b> $400</p>
                            <p><b>Unique Voucher No:</b> xYz919</p>
                            <p><b>User ID:</b> ABX91</p>
                            <p><b>Username:</b> Nikhil Vats</p>
                            <p><b>Email:</b> nikvats5199@gmail.com</p>
                            <p><b>Expiry date:</b> 3 years from now</p>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Payment;