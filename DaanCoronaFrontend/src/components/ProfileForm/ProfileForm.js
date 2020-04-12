import React from "react";
import { Form, Input, Button, message } from 'antd';
import { devURL as URL } from "../../const";

import classes from "./ProfileForm.module.scss";

class ProfileForm extends React.Component {
    constructor(props){
        super(props);
        this.fname = React.createRef();
        this.lname = React.createRef();
        this.email = React.createRef();
        this.photo = React.createRef();
        this.state = {
            first_name: this.props.first_name,
            last_name: this.props.last_name,
            email: this.props.email,
            donor_photo: null
        };
    }
    
    layout = {
        labelCol: { span: 8 },
        wrapperCol: { span: 12 },
    };
      
    validateMessages = {
        required: '${label} is required!',
        types: {
            email: '${label} is not validate email!',
            number: '${label} is not a validate number!',
        },
        number: {
            range: '${label} must be between ${min} and ${max}',
        },
    };

    submitDetails = () => {
        let token = sessionStorage.getItem('token');
        let fileInput = this.photo.current.input.files[0];
        console.log(fileInput);
        let formdata = new FormData();
        formdata.append('first_name',this.fname.current.input.value);
        formdata.append('last_name',this.lname.current.input.value);
        formdata.append('donor_photo',fileInput);
        formdata.append('email',this.email.current.input.value);
        fetch(URL + "/api/donor_profile/", {
            method: "POST",
            headers: {
                "Authorization":" JWT " + token
            },
            body: formdata
        })
        .then(res => {
            if(res.status == 201) {
              console.log(res);
              message.success('Details updated successfully!');
            } else {
              console.log(res);
              message.error('Server error!');
            }
        })
        .catch(err => {
            console.log(err);
            message.error('Network error!');
        });
    }

    onFirstNameChange = (value) => {
        this.setState({first_name: value});
    }
    
    onLastNameChange = (value) => {
        this.setState({last_name: value});
    }

    onEmailChange = (value) => {
        this.setState({email: value});
    }
      
    render() {
        return (
            <Form className={classes.form} encType="multipart/form-data" onFinish={this.onFinish} validateMessages={this.validateMessages}>
                    <Form.Item {...this.layout} className={classes.fields} name={['user', 'firstname']} label="First Name" rules={[{ required: true }]}>
                        <Input value={this.state.first_name} onChange={e => this.onFirstNameChange(e.target.value)} ref={this.fname} />
                    </Form.Item>
                    <Form.Item {...this.layout} className={classes.fields} name={['user', 'lastname']} label="Last Name" rules={[{ required: true }]}>
                        <Input value={this.state.last_name} onChange={e => this.onLastNameChange(e.target.value)} ref={this.lname} />
                    </Form.Item>
                    <Form.Item {...this.layout} className={classes.fields} name={['user', 'email']} label="Email" rules={[{ type: 'email', required: true }]}>
                        <Input value={this.state.email} onChange={e => this.onEmailChange(e.target.value)} ref={this.email} />
                    </Form.Item>
                    <Form.Item {...this.layout} className={classes.fields} label="Profile Photo">
                        <Input type="file" accept="image/*" name={['user', 'photo']} ref={this.photo}>
                        </Input>
                    </Form.Item>
                    <Form.Item>
                        <Button shape="round" type="primary" htmlType="submit" onClick={this.submitDetails}>
                            Save details
                        </Button>
                    </Form.Item>
                </Form>
        )
    }
}

export default ProfileForm;