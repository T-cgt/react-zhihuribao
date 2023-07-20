import { Badge, Toast } from "antd-mobile";
import {
  LeftOutline,
  MessageOutline,
  MoreOutline,
  StarOutline,
  LinkOutline,
} from "antd-mobile-icons";
import React, { useEffect, useState, useMemo } from "react";
import "./Detail.less";
import SkeletonAgain from "../components/SkeletonAgain";
import api from "../api";
import { flushSync } from "react-dom";
import { connect } from "react-redux";
import action from "../store/action/index";
const Detail = function Detail(props) {
  const { navigate, params } = props;

  //初始数据
  let [info, setInfo] = useState(null),
    [extra, setExtra] = useState(null);

  //离开组件后要销毁样式，不然一直存在
  let cssLinkArr = [];

  let handleStyle = function (info) {
    let { css } = info;
    if (!Array.isArray(css)) return;
    css.forEach((item, index) => {
      if (item) {
        cssLinkArr[index] = document.createElement("link");
        cssLinkArr[index].rel = "stylesheet";
        cssLinkArr[index].href = item;
        document.head.appendChild(cssLinkArr[index]);
      }
    });
  };
  let handleImgae = function (info) {
    let imgPlaceHolder = document.querySelector(".img-place-holder");
    if (!imgPlaceHolder) return;
    let tempImg = new Image();
    tempImg.src = info.image;
    tempImg.onload = () => {
      imgPlaceHolder.appendChild(tempImg);
    };
    tempImg.onerror = () => {
      let parent = imgPlaceHolder.parentNode;
      parent.parentNode.removeChild(parent);
    };
  };

  useEffect(() => {
    (async () => {
      try {
        let result = await api.queryNewsInfo(params.id);

        //因为setInfo数据跟新视图，react中用的是异步机制
        //而处理图片需要获取dom，所以会导致页面还没更新就已经执行了handleImage函数了
        //所以可以使用flushSync来使得setInfo执行后，更新视图后才执行下边代码，使得变成同步代码逻辑
        //flushSync是一个用于控制渲染的同步方法。它可以用来强制同步执行React更新，而不是使用默认的异步更新机制。

        //React使用异步更新来提高性能。当状态或属性发生变化时，React会将更新放入队列中，并在适当的时机批量处理这些更新。
        //这种异步更新机制可以减少不必要的重渲染和优化性能。

        flushSync(() => {
          setInfo(result);
          //处理样式 & 图片
          handleStyle(result);
        });

        handleImgae(result);
      } catch (_) {}
    })();

    return () => {
      if (cssLinkArr.length > 0) {
        cssLinkArr.forEach((item) => {
          document.head.removeChild(item);
        });
      }
    };
  }, []);
  useEffect(() => {
    (async () => {
      try {
        let result = await api.queryNewsInfo(params.id);
        setInfo(result);
      } catch (_) {}
    })();
  }, []);

  //==============下边是关于登录和收藏的逻辑

  let {
    base: { info: userInfo },
    queryUserInfoAsync,
    location,
    store: { list: storeList },
    queryStoreListAsync,
    removeStoreListById,
  } = props;

  useEffect(() => {
    (async () => {
      //第一次渲染完，如果userInfo没存在,需要派发查询时候登录
      if (!userInfo) {
        let { info } = await queryUserInfoAsync();
        userInfo = info;
      }

      //如果已经登录 && 且没有收藏信息
      if (userInfo && !storeList) {
        queryStoreListAsync();
      }
    })();
  }, []);

  //计算属性，用于文章是否收藏
  const isStore = useMemo(() => {
    if (!storeList) return false;
    return storeList.some((item) => {
      return +item.news.id === +params.id;
    });
  }, [storeList, params]);

  //点击收藏按钮
  async function handleStore() {
    if (!userInfo) {
      //未登录
      Toast.show({
        icon: "fail",
        content: "请先登录",
      });

      navigate(`/login?to=${location.pathname}`, { replace: true });
      return;
    }

    //已经登录
    if (isStore) {
      //移除收藏
      let item = storeList.find((item) => {
        return +item.news.id === +params.id;
      });
      if (!item) return; //这个可以不要，毕竟已经有收藏的了，肯定找得到
      let { code } = await api.storeRemove(item.id);
      if (+code !== 0) {
        Toast.show({
          icon: "success",
          content: "操作失败",
        });
        return;
      }
      Toast.show({
        icon: "success",
        content: "操作成功",
      });

      removeStoreListById(item.id); //告诉redux中也把这一项移除掉
      return;
    }

    //未收藏---点击要收藏
    try {
      let { code } = await api.store(params.id);
      if (+code !== 0) {
        Toast.show({
          icon: "fail",
          content: "收藏失败",
        });
        return;
      }
      Toast.show({
        icon: "success",
        content: "收藏成功",
      });
      queryStoreListAsync(); //同步最新的收藏列表到redux容器中
    } catch (_) {}
  }

  return (
    <div className="detail-box">
      {/* 新闻内容 */}
      {!info ? (
        <SkeletonAgain />
      ) : (
        <div
          className="content"
          dangerouslySetInnerHTML={{ __html: info.body }}
        ></div>
      )}

      {/* 底部图标 */}
      <div className="tab-bar">
        <div
          className="back"
          onClick={() => {
            navigate(-1);
          }}
        >
          <LeftOutline />
        </div>
        <div className="icons">
          <Badge content="128">
            <MessageOutline />
          </Badge>
          <Badge content="128">
            <LinkOutline />
          </Badge>
          <span className={isStore ? "stored" : ""} onClick={handleStore}>
            <StarOutline />
          </span>
          <span>
            <MoreOutline />
          </span>
        </div>
      </div>
    </div>
  );
};
export default connect((state) => ({ base: state.base, store: state.store }), {
  ...action.base,
  ...action.store,
})(Detail);
