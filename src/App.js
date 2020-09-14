import React from "react";
import Chat from "./pages/chat/index";
import Home from "./pages/chat/home";
import styles from "./app.module.scss";
import { Route, Switch, BrowserRouter as Router } from "react-router-dom";
// import { reducer } from "./stateManager/reducer";
// import { Provider as AppStateProvider } from "./context/appStateContext";
// import { Provider as DispatchProvider } from "./context/dispatcherContext";
// import useThunkReducer from "react-hook-thunk-reducer";

function App() {
  // const [state, dispatch] = useThunkReducer(reducer, );

  return (
    // <DispatchProvider dispatch={dispatch}>
    //   <AppStateProvider state={state}>
    <Router>
      <div className={styles["app"]}>
        <div className={styles["head"]} />
        <div className={styles["main"]}>
          <Switch>
            <Route path="/chat-panel" component={Chat}></Route>
            <Route path="/" component={Home}></Route>
          </Switch>
        </div>
      </div>
    </Router>
    //   </AppStateProvider>
    // </DispatchProvider>
  );
}

export default App;
