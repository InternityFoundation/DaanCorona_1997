import React from "react";
import { Input } from "antd";
import classes from "./Shops.module.scss";
import thumbnail from "../../../assets/thumbnail.jpg";

const { Search } = Input;

class Shops extends React.Component {
    render() {
        return (
            <div className={classes.selectShop}>
                <Search placeholder="Find nearby shops.." onSearch={value => console.log(value)} enterButton />
                <div className={classes.shops}>
                    <div className={classes.shop}>
                        <img src={thumbnail} />
                        <div className={classes.details}>
                            <h4 className={classes.shopName}>Royal Mint of Spain</h4>
                            <p className={classes.ownerName}><strong>Name:</strong> Professor</p>
                            <p className={classes.amount}><strong>Amount:</strong> $500</p>
                            <p className={classes.phone}><strong>Phone:</strong> +919999988888</p>
                            <p className={classes.uid}><strong>Unique ID:</strong> XyZ1982</p>
                            <p className={classes.address}><strong>Address:</strong> 333 Alacantra, Madrid, Spain - 110086</p>
                        </div>
                    </div>
                    <div className={classes.shop}>
                        <img src={thumbnail} />
                        <div className={classes.details}>
                            <h4 className={classes.shopName}>Royal Mint of Spain</h4>
                            <p className={classes.ownerName}><strong>Name:</strong> Professor</p>
                            <p className={classes.amount}><strong>Amount:</strong> $500</p>
                            <p className={classes.phone}><strong>Phone:</strong> +919999988888</p>
                            <p className={classes.uid}><strong>Unique ID:</strong> XyZ1982</p>
                            <p className={classes.address}><strong>Address:</strong> 333 Alacantra, Madrid, Spain - 110086</p>
                        </div>
                    </div>
                    <div className={classes.shop}>
                        <img src={thumbnail} />
                        <div className={classes.details}>
                            <h4 className={classes.shopName}>Royal Mint of Spain</h4>
                            <p className={classes.ownerName}><strong>Name:</strong> Professor</p>
                            <p className={classes.amount}><strong>Amount:</strong> $500</p>
                            <p className={classes.phone}><strong>Phone:</strong> +919999988888</p>
                            <p className={classes.uid}><strong>Unique ID:</strong> XyZ1982</p>
                            <p className={classes.address}><strong>Address:</strong> 333 Alacantra, Madrid, Spain - 110086</p>
                        </div>
                    </div>
                    <div className={classes.shop}>
                        <img src={thumbnail} />
                        <div className={classes.details}>
                            <h4 className={classes.shopName}>Royal Mint of Spain</h4>
                            <p className={classes.ownerName}><strong>Name:</strong> Professor</p>
                            <p className={classes.amount}><strong>Amount:</strong> $500</p>
                            <p className={classes.phone}><strong>Phone:</strong> +919999988888</p>
                            <p className={classes.uid}><strong>Unique ID:</strong> XyZ1982</p>
                            <p className={classes.address}><strong>Address:</strong> 333 Alacantra, Madrid, Spain - 110086</p>
                        </div>
                    </div>
                    <div className={classes.shop}>
                        <img src={thumbnail} />
                        <div className={classes.details}>
                            <h4 className={classes.shopName}>Royal Mint of Spain</h4>
                            <p className={classes.ownerName}><strong>Name:</strong> Professor</p>
                            <p className={classes.amount}><strong>Amount:</strong> $500</p>
                            <p className={classes.phone}><strong>Phone:</strong> +919999988888</p>
                            <p className={classes.uid}><strong>Unique ID:</strong> XyZ1982</p>
                            <p className={classes.address}><strong>Address:</strong> 333 Alacantra, Madrid, Spain - 110086</p>
                        </div>
                    </div>
                    <div className={classes.shop}>
                        <img src={thumbnail} />
                        <div className={classes.details}>
                            <h4 className={classes.shopName}>Royal Mint of Spain</h4>
                            <p className={classes.ownerName}><strong>Name:</strong> Professor</p>
                            <p className={classes.amount}><strong>Amount:</strong> $500</p>
                            <p className={classes.phone}><strong>Phone:</strong> +919999988888</p>
                            <p className={classes.uid}><strong>Unique ID:</strong> XyZ1982</p>
                            <p className={classes.address}><strong>Address:</strong> 333 Alacantra, Madrid, Spain - 110086</p>
                        </div>
                    </div>
                    <div className={classes.shop}>
                        <img src={thumbnail} />
                        <div className={classes.details}>
                            <h4 className={classes.shopName}>Royal Mint of Spain</h4>
                            <p className={classes.ownerName}><strong>Name:</strong> Professor</p>
                            <p className={classes.amount}><strong>Amount:</strong> $500</p>
                            <p className={classes.phone}><strong>Phone:</strong> +919999988888</p>
                            <p className={classes.uid}><strong>Unique ID:</strong> XyZ1982</p>
                            <p className={classes.address}><strong>Address:</strong> 333 Alacantra, Madrid, Spain - 110086</p>
                        </div>
                    </div>
                    <div className={classes.shop}>
                        <img src={thumbnail} />
                        <div className={classes.details}>
                            <h4 className={classes.shopName}>Royal Mint of Spain</h4>
                            <p className={classes.ownerName}><strong>Name:</strong> Professor</p>
                            <p className={classes.amount}><strong>Amount:</strong> $500</p>
                            <p className={classes.phone}><strong>Phone:</strong> +919999988888</p>
                            <p className={classes.uid}><strong>Unique ID:</strong> XyZ1982</p>
                            <p className={classes.address}><strong>Address:</strong> 333 Alacantra, Madrid, Spain - 110086</p>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Shops;