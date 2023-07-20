import { Input, Form, Toast } from "antd-mobile";
import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import action from "../store/action";

import NavBarAgain from "../components/NavBarAgain";
import ButtonAgain from "../components/ButtonAgain";
import "./Login.less";
import api from "../api";
import _ from "@/assets/utils";

//表单验证规则
const rules = {
  phone(_, value) {
    value = value.trim();
    let reg = /^(?:(?:\+|00)86)?1\d{10}$/;
    if (value.length === 0) return Promise.reject(new Error("手机号是必填项!"));
    if (!reg.test(value)) return Promise.reject(new Error("手机号格式有误!"));
    return Promise.resolve();
  },
  code(_, value) {
    value = value.trim();
    let reg = /^\d{6}$/;
    if (value.length === 0) return Promise.reject(new Error("验证码是必填项!"));
    if (!reg.test(value)) return Promise.reject(new Error("验证码格式有误!"));
    return Promise.resolve();
  },
};

const Login = function Login(props) {
  let { queryUserInfoAsync, navigate, usp } = props;

  /* 获取实例 */
  const [formIns] = Form.useForm();

  // //表单提交
  // function submit(values) {
  //   //表单验证成功了
  //   //values是form自动收集的每个表单项的值
  // }

  // const delay = () => {
  //   return new Promise((resovle) => {
  //     setTimeout(() => {
  //       resovle();
  //     }, 3000);
  //   });
  // };

  //自定义表单提交
  async function submit() {
    try {
      await formIns.validateFields();
      let { code, phone } = formIns.getFieldValue(); //获取表单的值
      let { code: codeHttp, token } = await api.login(phone, code);
      if (+codeHttp !== 0) {
        Toast.show({
          icon: "fail",
          content: "登录失败",
        });
        formIns.resetFields(["code"]);
        return;
      }
      //登录成功，存储Token、存储登录者信息到redux、提示眺转
      _.storage.set("tk", token);
      await queryUserInfoAsync(); //派发action，存储信息到redux
      Toast.show({
        icon: "success",
        content: "登录/注册成功",
      });

      let to = usp.get("to");
      to ? navigate(to, { replace: true }) : navigate(-1);

      // //route5和6分别的眺转方式
      // history.pushState({
      //   pathname: "/xxx",
      //   search: "",
      //   state: "",
      // });

      // //6
      // navigate(
      //   {
      //     pathname: "",
      //     search: "",
      //   },
      //   {
      //     state: "",
      //   }
      // );

      // history.replaceState("/xxx");
      // navigate("/xxx", { repaace: true });
    } catch (_) {}
  }

  const [disabled, setDisable] = useState(false),
    [sendText, setSendText] = useState("发送验证码");
  let num = 31;
  let timer = null;
  //设计倒计时
  const countDown = () => {
    num--;
    if (num === 0) {
      clearInterval(timer);
      timer = null;
      setSendText("发送验证码");
      setDisable(false);
      return;
    }
    setSendText(`${num}秒后重发`);
  };

  //发送验证码
  const send = async () => {
    try {
      await formIns.validateFields(["phone"]);
      let phone = formIns.getFieldValue("phone");
      let { code } = await api.sendPhoneCode(phone);
      if (+code !== 0) {
        Toast.show({
          icon: "fail",
          content: "发送失败",
        });
        return;
      }

      //发送成功
      setDisable(true);
      countDown();
      if (!timer) timer = setInterval(countDown, 1000);
    } catch (_) {}
  };
  useEffect(() => {
    return () => {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
    };
  }, []);
  return (
    <div className="login-box">
      <NavBarAgain title="登录/注册" />

      <Form
        layout="horizontal"
        style={{
          "---border-top": "none",
        }}
        footer={
          <ButtonAgain color="primary" onClick={submit}>
            提交
          </ButtonAgain>
        }
        /* 如果按钮是type为submit类型，就会触发提交时间，提交的内容符合验证，就会触发onfinish事件 */
        // onFinish={submit}
        /* 获取form实例用于能调用form方法 */
        form={formIns}
        /* 设置初始值 */
        initialValues={{ phone: "", code: "" }}
        requiredMarkStyle={false}
      >
        <Form.Item
          name="phone"
          label="手机号"
          rules={[{ validator: rules.phone }]}
        >
          <Input placeholder="请输入手机号" />
        </Form.Item>
        <Form.Item
          name="code"
          label="验证码"
          extra={
            <ButtonAgain
              size="small"
              color="primary"
              onClick={send}
              disabled={disabled}
            >
              {sendText}
            </ButtonAgain>
          }
          rules={[
            { required: "true", message: "验证码是必填项" },
            { pattern: /^\d{6}$/, message: "验证码格式错误" },
          ]}
        >
          <Input />
        </Form.Item>
      </Form>
    </div>
  );
};
export default connect(null, action.base)(Login);
