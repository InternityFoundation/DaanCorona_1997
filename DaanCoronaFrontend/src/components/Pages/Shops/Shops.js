import React from "react";
import { Input, message, Button, Modal } from "antd";
import classes from "./Shops.module.scss";
import thumbnail from "../../../assets/thumbnail.svg";
import { prodURL as URL, placesAPIKey as key } from "../../../const";
import Navbar from "../../Navbar/Navbar";
import Razorpay from "../../Razorpay/Razorpay";

const { Search } = Input;

class Shops extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            visible: false,
            shops: null,
            recipients: null
        }
    }

    componentWillMount() {
        this.getLoc();
    }

    searchShop = (query) => {
        let searchURL = "https://maps.googleapis.com/maps/api/place/textsearch/json?";
        fetch(searchURL + new URLSearchParams({
            query,
            key
        }), {
            method: "GET"
        })
        .then(response => response.json())
        .then(res => {
            // console.log(res);
            if(res.results.length === 0) {
                message.error("Wo oh! No results found, please use a different search query!");
            } else {
                this.showShops(res.results);
            }
        })
        .catch(err => {
            console.log(err);
        })
    }

    showModal = () => {
        this.setState({
          visible: true
        });
    }
    
    handleCancel = () => {
        console.log("Returning");
        this.setState({ visible: false });
    }

    showShops = (results) => {
        console.log(results);
        if(results.length == 1) {
            let position = {
                coords: {
                    latitude: results[0].geometry.location.lat,
                    longitude: results[0].geometry.location.lng
                }
            }
            this.getShops(position);
        } else {
            this.setState({ shops: results });
            this.setState({ visible: true });
        }
    }

    getLoc = () => {
        if(navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(this.getShops);
        }
    }

    setLoc = (long, lat) => {
        console.log(long,lat);
        let position = {
            coords: {
                latitude: long,
                longitude: lat
            }
        };
        this.getShops(position);
        this.handleCancel();
        message.success("Yaas! Updating results, please wait!");
    };

    getShops = (position) => {
        let token = sessionStorage.getItem('token');
        let formdata = new FormData();
        formdata.append('lat',position.coords.latitude);
        formdata.append('long',position.coords.longitude);
        console.log(position.coords)
        if(!token) {
            window.location.href = "/";
            message.warning("Please login again!");
        }
        fetch(URL+"/api/nearby_recipients/", {
            method: "POST",
            headers: {
                "Authorization":"JWT " + token
            },
            body: formdata
        })
        .then(response => {
            if(response.status == 401) {
                message.warning("You have been logged out! Please login again, redirecting in 2 seconds!");
                setInterval(() => {
                    window.location.href = "/";
                },2000);
            } else {
                return response.json();
            }
        })
        .then(res => {
            if(res) {
                console.log(res);
                this.setState({recipients: res.nearby_recipients});
                message.success('Nearby shops fetched, updated details!');
            } else {
                console.log(res);
                message.error("No nearby shops are registered!");
            }
        })
        .catch((err) => {
            console.log(err);
            message.error('Server error, failed to fetch details!');
        })
    }

    render() {
        let shopsDiv = null;
        if(this.state.shops != null) {
            shopsDiv = (
                <Modal
                    className={classes.resultModal}
                    visible={this.state.visible}
                    title="Click on any result to proceed."
                    onCancel={this.handleCancel}
                    footer={[
                        <Button key="back" onClick={this.handleCancel}>
                        Return
                        </Button>
                    ]} >
                    {/* <p>Some contents...</p>
                    <p>Some contents...</p>
                    <p>Some contents...</p>
                    <p>Some contents...</p>
                    <p>Some contents...</p> */}
                    <ol className={classes.shopList}>
                        {this.state.shops.map((elem, index)=> {
                            return (
                                <li className="shopListItem" key={index} onClick={() => this.setLoc(elem.geometry.location.lat, elem.geometry.location.lng)}>
                                    <p>Name: {elem.name}</p>
                                    <p>Address: {elem.formatted_address}</p>
                                </li>
                            )
                        })}
                    </ol>
                </Modal>
            )
        }
        return (
            <div className={classes.selectShop}>
                {shopsDiv}
                <div className={classes.navigation}>
                    <Search placeholder="Search for a shop, location etc." onSearch={value => this.searchShop(value)} enterButton />
                    <Navbar />
                </div>
                <div className={classes.shops}>
                    {this.state.recipients ? this.state.recipients.map((elem,index) => {
                        return (
                            <div key={index} className={classes.shop}>
                                <img src={URL+elem.business_photo} />
                                <div className={classes.details}>
                                    <h4 className={classes.shopName}>{elem.business_name}</h4>
                                    <p className={classes.ownerName}><strong>Name:</strong> {elem.first_name}+{elem.last_name}</p>
                                    <p className={classes.amount}><strong>Amount:</strong> Rs.500</p>
                                    <p className={classes.phone}><strong>Phone:</strong> +919999988888</p>
                                    <p className={classes.uid}><strong>Unique ID: </strong> {elem.recipient_id}</p>
                                    <p className={classes.address}><strong>Address: </strong> {elem.address}</p>
                                </div>
                                <Razorpay />
                            </div>
                        )
                    }) : null}
                    <div className={classes.shop}>
                        <img src={thumbnail} />
                        <div className={classes.details}>
                            <h4 className={classes.shopName}>Loading</h4>
                            <p className={classes.ownerName}><strong>Name:</strong> Professor</p>
                            <p className={classes.amount}><strong>Amount:</strong> $500</p>
                            <p className={classes.phone}><strong>Phone:</strong> +919999988888</p>
                            <p className={classes.uid}><strong>Unique ID:</strong> XyZ1982</p>
                            <p className={classes.address}><strong>Address:</strong> 333 Alacantra, Madrid, Spain - 110086</p>
                        </div>
                        <Razorpay />
                    </div>
                    <div className={classes.shop}>
                        <img src={thumbnail} />
                        <div className={classes.details}>
                            <h4 className={classes.shopName}>Loading</h4>
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
                            <h4 className={classes.shopName}>Loading</h4>
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
                            <h4 className={classes.shopName}>Loading</h4>
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
                            <h4 className={classes.shopName}>Loading</h4>
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
                            <h4 className={classes.shopName}>Loading</h4>
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
                            <h4 className={classes.shopName}>Loading</h4>
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
                            <h4 className={classes.shopName}>Loading</h4>
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