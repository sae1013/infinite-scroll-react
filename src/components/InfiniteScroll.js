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
    // dispatch(load(paging.start, 6)); 
    
  };
  
  loader.current = loadHandler; // 로더의 current에 항상 새로운 함수를 넣어준다.

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
