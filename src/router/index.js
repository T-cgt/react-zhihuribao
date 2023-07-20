import React, { Suspense, useEffect, useState } from "react";
import {
  Routes,
  Route,
  useNavigate,
  useLocation,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { Mask, DotLoading, Toast } from "antd-mobile";

import store from "../store/index";
import action from "../store/action/index";
import routes from "./router";

const isCheckLogin = (path) => {
  let {
      base: { info },
    } = store.getState(),
    checkList = ["/personal", "/store", "/update"];
  return !info && checkList.includes(path);
};

/* 统一路由配置 */
const Element = function (props) {
  let { component: Component, meta, path } = props;
  let isShow = !isCheckLogin(path);
  let [_, setRandom] = useState(0);
  //登录动态校验
  useEffect(() => {
    if (isShow) return;
    (async () => {
      //如果redux里面的info没有，且眺转页面是符合这几个的
      let infoAction = await action.base.queryUserInfoAsync(); //这里只是单纯调用，没有派发
      let info = infoAction.info;
      if (!info) {
        //如果获取接口还是获取不到，说明没有登录
        Toast.show({
          icon: "fail",
          content: "请先登录",
        });
        // 跳转到登录页
        navigate(
          {
            pathname: "/login",
            search: `?to=${path}`,
          },
          { replace: true }
        );
        return;
      }
      store.dispatch(infoAction); //infoAction是一个派发的对象（数据和type类型）
      setRandom(+new Date());
    })();
  });

  //修改页面title
  let { title } = meta || "知乎日报-webapp";
  document.title = title;

  //获取路由信息，基于属性传递给组件 --方便路由组件获取传参，不需要每次都使用hook函数，直接通过props获取就行
  const navigate = useNavigate(),
    location = useLocation(),
    params = useParams(),
    [usp] = useSearchParams();

  return (
    <>
      {isShow ? (
        <Component
          navigate={navigate}
          location={location}
          params={params}
          usp={usp}
        />
      ) : (
        <Mask visible={true}>
          <DotLoading color="white" />
        </Mask>
      )}
    </>
  );
};

//其实也可以用useRouter这个hook，但是不方便做到统一配置
//这个hook 获取到的返回值作为路由容器存放使用，类似于vue的<router-view>

export default function RouterView() {
  return (
    <Suspense
      fallback={
        <Mask visible={true}>
          <DotLoading color="white" />
        </Mask>
      }
    >
      <Routes>
        {routes.map((item) => {
          let { name, path } = item;
          return (
            <Route key={name} path={path} element={<Element {...item} />} />
          );
        })}
      </Routes>
    </Suspense>
  );
}
