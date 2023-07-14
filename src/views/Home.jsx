import React, { useEffect, useRef, useState } from "react";
import HomeHeader from "../components/HomeHeader";
import SkeletonAgain from "../components/SkeletonAgain";
import NewsItem from "../components/NewsItem";
import _ from "../assets/utils";
import { Swiper, Image, Divider, DotLoading } from "antd-mobile";
import api from "../api/index";
import { Link } from "react-router-dom";
import "./Home.less";
export default function Home() {
  //创建所需数据
  let [today, setToday] = useState(_.formatTime(null, "{0}{1}{2}")),
    [bannerData, setBannerData] = useState([]),
    [newsList, setNewsList] = useState([]);

  //dom渲染后，去执行里面函数，也可以把第二个参数换成想要监听的数据
  //因为返回值为函数，所以在里面写async不符合，但需要的话，可以使用匿名函数自调用
  useEffect(() => {
    (async () => {
      try {
        let { date, stories, top_stories } = await api.queryNewsLatest();
        if (date) {
          setToday(date);

          newsList.push({
            date,
            stories,
          });
          setNewsList([...newsList]);
        }
        top_stories && setBannerData(top_stories);
      } catch (_) {}
    })();
  }, []);

  //获取dom元素
  const loadMore = useRef();

  /* 第一次渲染完毕，设置监听器，实现触底加载 */
  /* useEffect，如果没有设置对应的依赖项数据，那么拿到的值就只会是数据的初始地址的值，所以这里的更新数据只能这么写
    newsList.push(result); //这样会更新到初始地址的值
    setNewsList([...newsList]);

    不能这么写
    const list = [...newsList,[ stories, date };
    setNewsList(list);
  */
  useEffect(() => {
    let ob = new IntersectionObserver(async (changes) => {
      let { isIntersecting } = changes[0];
      //加载更多的dom显示在视口界面上，就去获取以前的新闻
      if (isIntersecting) {
        try {
          let time = newsList.slice(-1)[0]["date"]; //获取数据中最之前的日期
          let result = await api.queryNewsBefore(time);
          newsList.push(result);
          setNewsList([...newsList]);
        } catch (_) {}
      }
    });
    ob.observe(loadMore.current); //这里监听几个，change就有几个值

    let loadMoreDom = loadMore.current; //为了销毁时拿到dom元素，因为useEffect的返回函数（清除副作用函数，是在完全组件卸载后才执行的）

    //在组件销毁释放时候，手动销毁监听器
    return () => {
      // console.log("----打印：", loadMore.current); //为null
      ob.unobserve(loadMoreDom);
      ob = null;
    };
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
      {newsList.length === 0 ? (
        <SkeletonAgain />
      ) : (
        <>
          {newsList.map((item, index) => {
            let { date, stories } = item;
            return (
              <div className="news-box" key={date}>
                {index !== 0 ? (
                  <Divider contentPosition="left">
                    {_.formatTime(date, "{1}月{2}日")}
                  </Divider>
                ) : null}
                <div className="list">
                  {stories.map((cur) => {
                    return <NewsItem key={cur.id} info={cur}></NewsItem>;
                  })}
                </div>
              </div>
            );
          })}
        </>
      )}

      {/* 加载更多 */}
      <div
        className="loadmore-box"
        ref={loadMore}
        style={{ display: newsList.length === 0 ? "none" : "block" }}
      >
        <DotLoading />
        数据加载中
      </div>
    </div>
  );
}
