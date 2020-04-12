import React from "react";
import classes from "./profile.module.scss";
import { message, Button } from 'antd';

import profile from "../../../assets/profile.svg";
import profilePic from "../../../assets/profile_pic.svg";
import { devURL as URL } from "../../../const";
import Navbar from "../../Navbar/Navbar";
import ProfileForm from "../../ProfileForm/ProfileForm";

class Profile extends React.Component {
    state = {
        first_name: null,
        last_name: null,
        email: null,
        donor_id: null,
        donor_photo: null,
        edit_details: true
    }

    componentWillMount() {
        let token = sessionStorage.getItem("token");
        fetch(URL+"/api/donor_profile/", {
            method: "GET",
            headers: {
                "Authorization": "JWT " + token
            }
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
                this.setState({first_name: res.first_name, last_name: res.last_name, email: res.email, donor_id:res.donor_id,donor_photo: res.donor_photo, edit_details: false})
                message.success('Details fetched successfully!');
            }
        })
        .catch(err => {
            console.log(err);
            message.warning('Details not found, please register first!');
        });
    }

    toggleEditDetails = () => {
        this.setState({edit_details: !this.state.edit_details});
    }

    render() {
        let detailsDiv = (<div className={classes.userDetails}>
            <h1><span>Hello,</span> {this.state.first_name}!</h1>
            <p><span>First name:</span> {this.state.first_name}</p>
            <p><span>Last name:</span> {this.state.last_name}</p>
            <p><span>Email:</span> {this.state.email}</p>
            <p><span>Donor_ID:</span> {this.state.donor_id}</p>
            <Button type="primary" shape="round" onClick={this.toggleEditDetails} className={classes.editBtn}>Click to edit</Button>
        </div>);
        return (
            <div className={classes.profile}>
                <Navbar />
                <div className={classes.profileInfo}>
                    <img src={this.state.donor_photo ? URL + this.state.donor_photo : profilePic} className={classes.profilePic} />
                    {(this.state.edit_details == false) 
                        ?   detailsDiv 
                        :   <div className={classes.formDiv}>
                                <ProfileForm 
                                    first_name={this.state.first_name}
                                    last_name={this.state.last_name}
                                    email={this.state.email} />
                                <Button type="primary" shape="round" onClick={this.toggleEditDetails} className={classes.goBackBtn}>Go back!</Button>
                            </div>
                    }
                </div>
                <div className={classes.profileSVG}>
                    <img src={profile} />
                </div> 
            </div>
        );
    }
}

export default Profile;