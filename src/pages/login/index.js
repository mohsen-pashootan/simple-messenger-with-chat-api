import React, { useState, useEffect } from "react";
import { signIn } from "../../services/main";
import { userSingedIn } from "../../stateManager/actionCreator";
import { useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
// import { useDispatch } from "../../context/dispatcherContext";
// import { useAppState } from "../../context/appStateContext";

export default function Index() {
  const [name, setName] = useState("");
  const { userId } = useSelector((state) => state);
  const history = useHistory();
  const dispatch = useDispatch();

  function handleSignIn() {
    // TODO: validate `name` first.
    signIn(name).then(({ success, result: user }) => {
      if (success) {
        dispatch(userSingedIn(user));
      }
    });
  }

  useEffect(() => {
    if (userId) {
      history.push("/chat");
    }
  }, [userId, history]);

  return (
    <div>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button onClick={handleSignIn}>Sign in</button>
    </div>
  );
}
