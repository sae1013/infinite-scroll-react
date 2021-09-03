import { createStore, combineReducers, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";
import logger from "redux-logger";
import { createBrowserHistory } from "history";

import movieSlice from "./modules/movieSlice";

export const customHistory = createBrowserHistory();

const rootReducer = combineReducers({
  movie: movieSlice.reducer,
});
const middlewares = [thunk,thunk.withExtraArgument({ history: customHistory })]

if (process.env.NODE_ENV === 'development') { 
  middlewares.push(logger)
}

const middlewareEnhancer = applyMiddleware(...middlewares) 
const enhancers = [middlewareEnhancer] 
const composedEnhancer = composeWithDevTools(...enhancers) 

const store = createStore(
  rootReducer,
  composedEnhancer
);

export default store;
