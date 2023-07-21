import React from "react";
import "./NewsItem.less";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { Image } from "antd-mobile";

export default function NewsItem(props) {
  let { info } = props;
  if (!info) return null;

  let { id, title, hint, images, image } = info;
  if (!Array.isArray(images)) images = image ? [image] : [""];
  return (
    <div className="news-item-box">
      <Link to={{ pathname: `/detail/${id}` }}>
        <div className="content">
          <h4 className="title">{title}</h4>
          {hint ? <p className="author">{hint}</p> : null}
        </div>
        <Image src={images[0]} lazy></Image>
      </Link>
    </div>
  );
}

NewsItem.defaultProps = {
  info: null,
};
NewsItem.propTypes = {
  info: PropTypes.object,
};
