import React, { useEffect, useRef } from "react";
import MovieItem from "./MovieItem";
import classes from "./MovieList.module.css";
import { load } from "../api/load";
import { useDispatch, useSelector } from "react-redux";

function MovieList() {
  const dispatch = useDispatch();
  const isLoading = useSelector((state) => state.movie.isLoading);
  const dataList = useSelector((state) => state.movie.list);
  const paging = useSelector((state) => state.movie.paging);
  const observedElement = useRef(null);
  const loader = useRef(null);

  const loadHandler = () => {
    dispatch(load(paging.start, 6));
  };

  loader.current = loadHandler; //추가코드

  const observer = useRef(new IntersectionObserver( // 추가한 코드
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          loader.current(); // 추가코드 (메모리 최적화)
        }
      });
    },
    { threshold: 1 }
  ));

  useEffect(() => {
    
    const currentObservedElement = observedElement.current;
    const currentObserver = observer.current; //추가코드
    if (isLoading) {
      return;
    }
    if (currentObservedElement) {
      currentObserver.observe(currentObservedElement);
    }

    return () => {
      if (currentObservedElement) {
        currentObserver.unobserve(currentObservedElement);
      }
    };
  }, [observedElement?.current, observer?.current]);

  return (
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
        <div ref={observedElement} style={{ background: "transparent" }}></div>
      )}

      {!isLoading && !paging.more && dataList.length === 0 && (
        <div> 앗! 데이터가 없어요...</div>
      )}
    </ul>
  );
}

export default MovieList;
