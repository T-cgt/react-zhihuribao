import React from "react";
import PropTypes from "prop-types";
import { NavBar } from "antd-mobile";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

//二次封装导航
export default function NavBarAgain(props) {
  let { title } = props;
  const navigate = useNavigate();
  const location = useLocation();
  const [usp] = useSearchParams();
  const handleBack = () => {
    //特殊：当前为登录页，而且是从详情页眺转进来的
    let to = usp.get("to");
    if (location.pathname === "/login" && /^\/detail\/\d+$/.test(to)) {
      navigate(to, { replace: true });
      return;
    }
    navigate(-1);
  };
  return <NavBar onBack={handleBack}>{title}</NavBar>;
}

NavBarAgain.defaultProps = {
  title: "个人中心",
};
NavBarAgain.propTypes = {
  title: PropTypes.string,
};
