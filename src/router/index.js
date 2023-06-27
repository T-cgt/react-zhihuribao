import React, { Suspense } from "react";
import {
  Routes,
  Route,
  useNavigate,
  useLocation,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { Mask, DotLoading } from "antd-mobile";

import routes from "./router";

/* 统一路由配置 */
const Element = function (props) {
  let { component: Component, meta } = props;

  //修改页面title
  let { title } = meta || "知乎日报-webapp";
  document.title = title;

  //获取路由信息，基于属性传递给组件 --方便路由组件获取传参，不需要每次都使用hook函数，直接通过props获取就行
  const navigate = useNavigate(),
    location = useLocation(),
    params = useParams(),
    [usp] = useSearchParams();

  return (
    <Component
      navigate={navigate}
      location={location}
      params={params}
      usp={usp}
    />
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
