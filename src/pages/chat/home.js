import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
import styles from "./home.module.scss";
import { signIn } from "../../services/main";
// import { useDispatch } from "../../context/dispatcherContext";
// import { useAppState } from "../../context/appStateContext";
import { useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

export default function Home() {
  const [name, setName] = useState("");
  const dispatch = useDispatch();
  const { userId } = useSelector((state) => state);
  const history = useHistory();

  function handleSignIn() {
    // TODO: validate `name` first.
    signIn(name).then(({ success, result: user }) => {
      if (success) {
        // TODO: for auto sign in:
        // localStorage.setItem("userId", user.id);
        // localStorage.setItem("username", user.name);
        dispatch({ type: "USER_SIGNED_IN", payload: user });
      }
    });
  }

  useEffect(() => {
    if (userId) {
      history.push("/chat-panel");
    }
  }, [userId, history]);

  // TODO: for auto sign in:
  // useEffect(() => {
  //   const userId = localStorage.getItem("userId");
  //   const name = localStorage.getItem("username");
  //   dispatch({
  //     type: "USER_SIGNED_IN",
  //     payload: {
  //       id: userId,
  //       name,
  //     },
  //   });
  // }, [dispatch]);

  function handleKeyDown(e) {
    if (e.keyCode === 13) {
      handleSignIn();
    }
  }

  return (
    <div className={styles["home-wrapper"]}>
      <div className={styles["home-container"]}>
        <div className={styles["home-title"]}>
          <h1> HELLO DEAR CUSTOMER</h1>
        </div>
        <div className={styles["home-name"]}>
          <h3>Please Write Your Name:</h3>
          <input
            className={styles["home-input"]}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={handleKeyDown}
            type="text"
            placeholder="Your name.."
          ></input>
          <button className={styles["home-button"]} onClick={handleSignIn}>
            Sign in
          </button>
        </div>

        {/* <Link
        className={styles["home-button"]}
        to={`/chat-panel/${name}`}
        params={{ name }}
      >
        Start A Conversation
      </Link> */}
      </div>
    </div>
  );
}
