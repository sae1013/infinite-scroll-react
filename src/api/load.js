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
