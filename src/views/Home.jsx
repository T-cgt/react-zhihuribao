import React, { useEffect, useState } from "react";
import HomeHeader from "../components/HomeHeader";
import _ from "../assets/utils";
import { Swiper, Image } from "antd-mobile";
import api from "../api/index";
import { Link } from "react-router-dom";
import "./Home.less";
export default function Home() {
  //创建所需数据
  let [today, setToday] = useState(_.formatTime(null, "{0}{1}{2}")),
    [bannerData, setBannerData] = useState([]);

  //dom渲染后，去执行里面函数，也可以把第二个参数换成想要监听的数据
  //因为返回值为函数，所以在里面写async不符合，但需要的话，可以使用匿名函数自调用
  useEffect(() => {
    (async () => {
      try {
        let { date, stories, top_stories } = await api.queryNewsLatest();
        date && setToday(date);
        top_stories && setBannerData(top_stories);
      } catch (_) {}
    })();
  }, []);

  return (
    <div className="home-box">
      {/* 头部 */}
      <HomeHeader today={today}></HomeHeader>

      {/* 轮播图片 */}
      <div className="swiper-box">
        {/* 如果没有数据，显示灰色背景 */}
        {bannerData.length > 0 ? (
          <Swiper autoplay={true} loop={true}>
            {bannerData.map((item) => {
              let { id, image, title, hint } = item;
              return (
                <Swiper.Item key={id}>
                  <Link to={{ pathname: `/detail/${id}` }}>
                    <Image src={image} lazy />
                    <div className="desc">
                      <h3 className="title">{title}</h3>
                      <p className="author">{hint}</p>
                    </div>
                  </Link>
                </Swiper.Item>
              );
            })}
          </Swiper>
        ) : null}
      </div>

      {/* 新闻列表 */}
    </div>
  );
}
