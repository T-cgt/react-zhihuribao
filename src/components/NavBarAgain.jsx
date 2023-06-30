import React from "react";
import PropTypes from "prop-types";
import { NavBar } from "antd-mobile";

//二次封装导航
export default function NavBarAgain(props) {
  let { title } = props;
  const handleBack = () => {};
  return <NavBar onBack={handleBack}>{title}</NavBar>;
}

NavBarAgain.defaultProps = {
  title: "个人中心",
};
NaBarAgain.propTypes = {
  title: PropTypes.string,
};
