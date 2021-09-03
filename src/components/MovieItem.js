import React from "react";
import classes from "./MovieItem.module.css";

function MovieItem({ title, url, thumbnailUrl }) {
  
  return <div className={classes.card_item}>
    <div className={classes.image_content}>
      <img className={classes.thumbnail} src ={url}></img>
    </div>

    <div className={classes.text_content}>
      <p className={classes.title}>{title}</p>
    </div>
  </div>;
}

export default React.memo(MovieItem);
