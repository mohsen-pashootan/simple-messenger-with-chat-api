import { createStore, applyMiddleware } from "redux";
import { reducer } from "../stateManager/reducer";
import thunk from "redux-thunk";

export default createStore(reducer, applyMiddleware(thunk));
