import React, { useMemo } from "react";
import time from "../assets/images/timg.jpg";
import "./HomeHead.less";
export default function HomeHeader(props) {
  let { today } = props;
  //计算属性
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
  return (
    <header className="home-head-box">
      <div className="info">
        <div className="time">
          <span>{times.day}</span>
          <span>{times.month}</span>
        </div>
        <h2>知乎日报</h2>
      </div>
      <div className="picture">
        <img src={time} alt="" />
      </div>
    </header>
  );
}
