import { SwipeAction, Toast } from "antd-mobile";
import styled from "styled-components";
import React from "react";
import { connect } from "react-redux";
import action from "../store/action/index";
import NavBarAgain from "../components/NavBarAgain";
import SkeletonAgain from "../components/SkeletonAgain";
import NewsItem from "../components/NewsItem";
import { useEffect } from "react";
import api from "../api";

/* 样式 */
const StoreBox = styled.div`
  .box {
    padding: 30px;
  }
`;
const Store = function (props) {
  let { list: storeList, queryStoreListAsync, removeStoreListById } = props;
  useEffect(() => {
    // 第一次加载完毕:如果redux中没有收藏列表,则异步派发获取
    if (!storeList) queryStoreListAsync();
  }, []);
  const handleRemove = async (id) => {
    try {
      let { code } = await api.storeRemove(id);
      if (+code !== 0) {
        Toast.show({
          icon: "fail",
          content: "移除失败",
        });
        return;
      }
      Toast.show({
        icon: "success",
        content: "移除成功",
      });

      removeStoreListById(id);
    } catch (_) {}
  };
  return (
    <StoreBox>
      <NavBarAgain title="我的收藏" />
      <div className="box">
        {storeList ? (
          storeList.map((item) => {
            let { id, news } = item;
            return (
              <SwipeAction
                key={id}
                rightActions={[
                  {
                    key: "delete",
                    text: "删除",
                    color: "danger",
                    onClick: () => {
                      handleRemove(id);
                    },
                    //另外写法
                    // onClick: handleRemove.bind(null, id),
                  },
                ]}
              >
                <NewsItem info={news}></NewsItem>
              </SwipeAction>
            );
          })
        ) : (
          <SkeletonAgain />
        )}
      </div>
    </StoreBox>
  );
};
export default connect((state) => state.store, {
  queryStoreListAsync: action.store.queryStoreListAsync,
  removeStoreListById: action.store.removeStoreListById,
})(Store);
