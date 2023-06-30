import React from "react";
import { Skeleton } from "antd-mobile";
export default function SkeletonAgain() {
  return (
    <div>
      <Skeleton.Title animated />
      <Skeleton.Paragraph lineCount={5} animated />
    </div>
  );
}
