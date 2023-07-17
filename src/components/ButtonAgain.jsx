import { Button } from "antd-mobile";
import React, { useState } from "react";

export default function ButtonAgain(props) {
  /* props中包含了调用<button></button>组件的属性---使用公共组件传进来的属性 */
  let options = { ...props };
  let { children, onClick: handle } = options;
  //避免改动传进来的属性---直接删除
  delete options.children;

  /* 状态 */
  let [loading, setLoading] = useState(false);
  const clickHandle = async () => {
    setLoading(true);
    try {
      await handle();
    } catch (_) {}
    setLoading(false);
  };

  //考虑没有传入onClick参数
  if (handle) {
    options.onClick = clickHandle;
  }

  return (
    <div>
      <Button {...options} loading={loading}>
        {children}
      </Button>
    </div>
  );
}
