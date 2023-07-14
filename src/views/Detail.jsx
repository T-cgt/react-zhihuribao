import { Badge } from "antd-mobile";
import {
  LeftOutline,
  MessageOutline,
  MoreOutline,
  StarOutline,
  LinkOutline,
} from "antd-mobile-icons";
import React, { useEffect, useState } from "react";
import "./Detail.less";
import SkeletonAgain from "../components/SkeletonAgain";
import api from "../api";
import { flushSync } from "react-dom";

export default function Detail(props) {
  const {
    navigate,
    params: { id },
  } = props;

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
        let result = await api.queryNewsInfo(id);

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
        let result = await api.queryNewsInfo(id);
        setInfo(result);
      } catch (_) {}
    })();
  }, []);
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
          <span className="stored">
            <StarOutline />
          </span>
          <span>
            <MoreOutline />
          </span>
        </div>
      </div>
    </div>
  );
}
