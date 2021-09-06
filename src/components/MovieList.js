import React, { useEffect, useRef } from "react";
import MovieItem from "./MovieItem";
import InfiniteScroll from "./InfiniteScroll";
import classes from "./MovieList.module.css";

import { load } from "../api/load";
import { useDispatch, useSelector } from "react-redux";

function MovieList() {
  const dispatch = useDispatch();
  const isLoading = useSelector((state) => state.movie.isLoading);
  const dataList = useSelector((state) => state.movie.list);
  const paging = useSelector((state) => state.movie.paging);
  const observedElement = useRef(null);

  return (
    <InfiniteScroll ref = {observedElement} isLoading={isLoading} paging={paging}>
      <ul className={classes.container}>
        {dataList.map((movie) => (
          <MovieItem
            key={movie.id}
            id={movie.id}
            title={movie.title}
            url={movie.url}
            thumbnailUrl={movie.thumbnailUrl}
          />
        ))}
        {isLoading && <div className={classes.spinner}>Loading.....</div>}
        
        {!isLoading && paging.more && (
          <div
            ref={observedElement}
            style={{ background: "transparent" }}
          ></div>
        )}

        {!isLoading && !paging.more && dataList.length === 0 && (
          <div> 앗! 데이터가 없어요...</div>
        )}
      </ul>
    </InfiniteScroll>
  );
}

export default MovieList;
