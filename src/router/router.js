import { lazy } from "react";
import Home from "../views/Home";
import { withKeepAlive } from "keepalive-react-component";

//使用keepalive-react-component插件实现组件缓存
//用KeepAliveProvider和withKeepAlive KeepAliveProvider---提供缓存条件，withKeepAlive---指定缓存的组件
//cacheId：指缓存的id，scroll，回到缓存组件的时候，还是在之前的滚动位置
//懒加载组件可以--component: withKeepAlive(lazy(() => import("../views/Personal")),{cacheId:'home',scroll:true}) ,
//包裹的组件的父组件不能设置overflow，不然scroll属性不生效或者错乱
const routes = [
  {
    path: "/",
    name: "home",
    component: withKeepAlive(Home, { cacheId: "home", scroll: true }),
    meta: {
      title: "知乎日报-webApp",
    },
  },
  {
    path: "/personal",
    name: "personal",
    component: lazy(() => import("../views/Personal")),
    meta: {
      title: "个人中心-知乎日报",
    },
  },
  {
    path: "/store",
    name: "store",
    component: lazy(() => import("../views/Store")),
    meta: {
      title: "我的收藏-知乎日报",
    },
  },
  {
    path: "/detail/:id",
    name: "detail",
    component: lazy(() => import("../views/Detail")),
    meta: {
      title: "新闻详情-知乎日报",
    },
  },
  {
    path: "/update",
    name: "update",
    component: lazy(() => import("../views/Update")),
    meta: {
      title: "修改个人中心-知乎日报",
    },
  },
  {
    path: "/login",
    name: "login",
    component: lazy(() => import("../views/Login")),
    meta: {
      title: "登录/注册-知乎日报",
    },
  },
  {
    path: "*",
    name: "404",
    component: lazy(() => import("../views/Page404")),
    meta: {
      title: "404页面-知乎日报",
    },
  },
];
export default routes;
