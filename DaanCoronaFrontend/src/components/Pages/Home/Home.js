import React from "react";
import classes from "./Home.module.scss";

import LoginForm from "../../LoginForm/Form";

import logo from "../../../assets/money.svg";
import gifts from "../../../assets/gift.svg";
import select from "../../../assets/select.svg";
import login from "../../../assets/login.svg";

class Home extends React.Component {
    render() {
        return (
            <div className={classes.home}>
                <div className={classes.details}>
                    <h1>DaanCorona</h1>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                    <img src={logo} />
                </div>
                <div className={classes.login}>
                    <div className={classes.loginForm}>
                        <h2>Register in just 1 minute!</h2>
                        <LoginForm />
                    </div>
                    <div className={classes.steps}>
                        <h2>3 easy steps -</h2>
                        <div>
                            <h3>1. Register</h3>
                            <img src={login} />
                        </div>
                        <div>
                            <h3>2. Select a shop</h3>
                            <img src={select} />
                        </div>
                        <div>
                            <h3>3. Donate and get your voucher</h3>
                            <img src={gifts} />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Home;