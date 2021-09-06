import React, { forwardRef, useRef, useEffect } from "react";
import {useDispatch,useSelector} from 'react-redux';
import {load} from '../api/load';

function InfiniteScroll(props, ref) {
  
  const dispatch = useDispatch();
  const isLoading = props.isLoading;
  const paging = props.paging;
  
  const loader = useRef(null);
  const observedElement = ref;

  const loadHandler = () => {
    dispatch(load(paging.start, 6));
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
