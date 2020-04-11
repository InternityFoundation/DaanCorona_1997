import React from "react";
import { Form, Input, Button, Checkbox } from 'antd';
import 'antd/dist/antd.css';
import Icon from "@ant-design/icons";
import classes from "./Form.module.scss";

class LoginForm extends React.Component {
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
    });
  };

  render() {
    // const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSubmit} className={classes.loginForm}>
        <Form.Item>
            <Input
              prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="Full name"
            />
        </Form.Item>
        <Form.Item>
            <Input
              prefix={<Icon type="email" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="Email"
            />
        </Form.Item>
        <Form.Item>
            <Input
              prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
              type="password"
              placeholder="Password"
            />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" className={classes.loginFormButton}>
            Register
          </Button>
        </Form.Item>
      </Form>
    );
  }
}

export default LoginForm;