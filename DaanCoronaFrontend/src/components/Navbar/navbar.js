import React from "react";
import { Link, withRouter } from "react-router-dom";
import { SmileTwoTone, ShopTwoTone, GiftTwoTone } from "@ant-design/icons";

import classes from "./Navbar.module.scss";

const Navbar = () => {
    return (
        <div className={classes.navbar}>
            <Link className={classes.link} to="profile"><SmileTwoTone twoToneColor="#eb2f96"/> Profile</Link>
            <Link className={classes.link} to="/shops"><ShopTwoTone /> Shops</Link>
            <Link className={classes.link} to="/payment"><GiftTwoTone twoToneColor="#52c41a" /> Donations</Link>
        </div>
    );
}

export default withRouter(Navbar);