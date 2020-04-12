import React from "react";
import { Form, Input, Button, message } from 'antd';
import 'antd/dist/antd.css';
import { MobileOutlined, MessageOutlined } from '@ant-design/icons';
import classes from "./Form.module.scss";
import { prodURL as URL } from "../../const";

class LoginForm extends React.Component {
  constructor(props){
    super(props);
    this.mobile = React.createRef();
    this.otp = React.createRef();
  }
  componentDidMount() {
    this.mobile.current.focus();
  }
  state = {
    showOTPInput: false
  }
  submitHandler = () => {
    this.state.showOTPInput === true ? this.otpHandler() : this.getOTP();
  }
  getOTP = () => {
    //   e.preventDefault();
    //   this.props.form.validateFields((err, values) => {
    //     if (!err) {
    //       console.log('Received values of form: ', values);
    //     }
    //   });
    let formdata = new FormData();
    formdata.append('mobile',this.mobile.current.input.value);
    fetch(URL + "/api/mobile/", {
        method: "POST",
        body: formdata
    })
    .then(response => response.json())
    .then(res => {
        if(res.otp) {
          console.log(res);
          this.setState({showOTPInput:true});
          message.success('OTP sent successfully!');
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
  otpHandler = () => {
    let formdata = new FormData();
    formdata.append("mobile",this.mobile.current.input.value);
    formdata.append("token",this.otp.current.input.value);
    fetch(URL + "/api/otp/", {
        method: "POST",
        body: formdata
    })
    .then(response => response.json())
    .then(res => {
        if(res.token) {
          console.log(res);
          message.success('Almost there!');
          sessionStorage.setItem('token',res.token.access);
          sessionStorage.setItem('newUser',res.newUser);
          window.location.href = "/profile";
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
  render() {
    return (
      <Form onSubmit={this.handleSubmit} className={classes.loginForm}>
        <Form.Item>
            <Input
              ref={this.mobile}
              type="tel"
              prefix={<MobileOutlined className="site-form-item-icon" />}
              placeholder="Mobile"
            />
        </Form.Item>
        {this.state.showOTPInput ? 
          <Form.Item>
            <Input
              ref={this.otp} 
              type="text"
              prefix={<MessageOutlined className="site-form-item-icon" />}
              placeholder="OTP"
            />
          </Form.Item> : null}
        <Form.Item>
          <Button type="primary" htmlType="submit" onClick={this.submitHandler} className={classes.loginFormButton}>
            {this.state.showOTPInput ? 'Login/Register' : 'Get OTP'}
          </Button>
        </Form.Item>
      </Form>
    );
  }
}

export default LoginForm;