import React, { useEffect, useMemo } from "react";
import time from "../assets/images/timg.jpg";
import "./HomeHead.less";
import { connect } from "react-redux";
import action from "../store/action";
import { useNavigate } from "react-router-dom";

const HomeHead = function HomeHeader(props) {
  let { today, info, queryUserInfoAsync } = props;
  //计算属性--useMemo
  let times = useMemo(() => {
    let [, month, day] = today.match(/^\d{4}(\d{2})(\d{2})$/),
      area = [
        "零",
        "一",
        "二",
        "三",
        "四",
        "五",
        "六",
        "七",
        "八",
        "九",
        "十",
        "十一",
        "十二",
      ];
    return {
      month: area[+month] + "月",
      day,
    };
  }, [today]);
  const navigate = useNavigate();
  //第一次渲染完，如果info没有信息，尝试派发一次，有就显示头像，没有就算了
  useEffect(() => {
    if (!info) {
      queryUserInfoAsync();
    }
  }, []);
  return (
    <header className="home-head-box">
      <div className="info">
        <div className="time">
          <span>{times.day}</span>
          <span>{times.month}</span>
        </div>
        <h2>知乎日报</h2>
      </div>
      <div
        className="picture"
        onClick={() => {
          navigate("/personal");
        }}
      >
        <img src={info ? info.pic : time} alt="" />
      </div>
    </header>
  );
};

export default connect((state) => state.base, action.base)(HomeHead);
