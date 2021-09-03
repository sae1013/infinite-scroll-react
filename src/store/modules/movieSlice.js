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
