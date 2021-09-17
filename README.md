기존 browser 리플로우문제를 개선함
Observer Intersction 을 활용한 무한스크롤 로더 입니다. 

## 사용 예제 (핵심코드)

MovieList.js

~~~jsx
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
    <InfiniteScroll ref = {observedElement} isLoading={isLoading} paging={paging} size = {6} onLoad={load}>
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

~~~



InfiniteScroll.js

~~~jsx
import React, { forwardRef, useRef, useEffect } from "react";
import {useDispatch,useSelector} from 'react-redux';
import {load} from '../api/load';

function InfiniteScroll(props, ref) {
  
  const dispatch = useDispatch();
  const isLoading = props.isLoading;
  const paging = props.paging;
  const size = props.size;
  const onLoad = props.onLoad;

  const loader = useRef(null);
  const observedElement = ref;

  
  const loadHandler = () => {
    dispatch(onLoad(paging.start,size)) 
    
  };
  
  loader.current = loadHandler; 

  const observer = useRef(
    new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            loader.current();
          }
        });
      },
      { threshold: 1 }
    )
  );

  useEffect(() => {
    const currentObservedElement = observedElement.current;
    const currentObserver = observer.current;
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
  }, [isLoading,observedElement.current]);
  
  

  return <React.Fragment>{props.children}</React.Fragment>;
}

export default forwardRef(InfiniteScroll);

~~~



MovieSlice.js (리덕스)

~~~jsx
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoading: false,
  list:[],
  paging:{
    start:0,
    more:true
  },
  error:null
};

export const movieSlice = createSlice({
  name: "movie",
  initialState,
  reducers: {
    setIsLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    addItem: (state,action)=>{
      state.list = [...state.list].concat(action.payload)
    },
    setPaging:(state,action)=>{
      state.paging = action.payload
    },
   
  },
});


export const movieActions = movieSlice.actions;

export default movieSlice;

~~~



onLoad.js 

~~~js
import axios from "axios";
import { movieActions } from "../store/modules/movieSlice";

export const load = (start, perPage) => {
  return async (dispatch) => {
    dispatch(movieActions.setIsLoading(true));
    let data;
    try {
      const response = await axios.get(
        `https://jsonplaceholder.typicode.com/photos?_start=${start}&_limit=${
          perPage + 1
        }`
      );
      data = response.data;
    } catch (err) {
      // Error 처리
      console.log(err);
      return;
    }
    let paging = {}; //

    if (data.length === perPage + 1) {
      // 다음 데이터가 있는지 미리 확인하기 위해서 +1 만큼 데이터를 가져옵니다.
      paging = { start: start + perPage, more: true };
    } else {
      paging = { start: start + data.length, more: false };
    }
    data.pop(); // 마지막데이터는 다음 데이터가 있는지 확인하기위한 용도이므로 마지막에 빼주어야 합니다.
    dispatch(movieActions.addItem(data));
    dispatch(movieActions.setIsLoading(false));
    dispatch(movieActions.setPaging(paging));
  };
};

~~~



## 필수 컴포넌트

- List : 아이템 배열을 관리하는 컴포넌트
- Item : 단일 아이템을 나타낼 컴포넌트
- InfiniteScroll 



## 매개변수

 <b>InfiniteScroll </b>

- ref : Observer Intersction의 감시대상이 될 DOM 요소
- isLoading: 현재 요청 상태
- paging: MovieSlice State의 paging을 참고해주세요.
- size: 요청시 받아올 데이터의 갯수
- onLoad: api요청 코드 입니다. 리덕스의 경우, 분리된 thunk 함수를 전달합니다.



## 부가정보

Observer 객체를 useRef로 감싸서 사용하게 됩니다. 

-> 리렌더링시, 계속해서 Observer 객체가 생성되는 것을 막습니다.

-> 이에따라 loader라는 useRef객체 사용합니다. 

loader.current 에는 항상 새로운 스코프를 참조하는 loadHandler 함수가 들어있습니다. loadHandler 안에서, onLoad (API 요청함수)를 실행합니다.



<b>주의)</b>  만약 아래와 같이, useRef객체를 생성하지않고, 바로 loadHandler 함수를 실행한다면, onLoad함수에 전달되는 매개변수(paging.start, size)는 클로저에 의해 이전에 참조한 값이 계속 참조될 것입니다.

~~~js
const observer = useRef(
    new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
           	loadHandler(); // Caution
          }
        });
      },
      { threshold: 1 }
    )
  );
~~~

