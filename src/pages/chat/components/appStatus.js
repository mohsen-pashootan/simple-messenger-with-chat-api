import React, { useState, useRef, useEffect } from "react";
import TitleBar from "./titleBar";
import SideBar from "./sideBar";
import OwnerStatus from "./ownerStatus";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faSearch,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";
import styles from "./appStatus.module.scss";
import { startChat } from "../../../services/main";
// import { useAppState } from "../../../context/appStateContext";
// import { useDispatch } from "../../../context/dispatcherContext";
import { useSelector, useDispatch } from "react-redux";

export default function AppStatus({ onSearch, selfStatusMode, userName }) {
  const [mode, setMode] = useState("list");
  const input = useRef(null);
  const { contacts, userId } = useSelector((state) => state);
  const dispatch = useDispatch();

  function gotoSearchMode() {
    setMode("search");
  }

  function gotoStatusMode() {
    setMode((prevMode) => {
      return "status";
    });
    selfStatusMode("status");
  }
  function gotoListMode() {
    setMode("list");
    selfStatusMode("");
  }

  function handleClose() {
    setMode((prevMode) => {
      return "list";
    });
  }

  function handleContactClick({ id: peerId, name }) {
    startChat(peerId, userId).then(({ result }) => {
      const resultId = result.id;
      setMode("list");
      dispatch({
        type: "CHAT_CREATED",
        payload: { resultId, name },
      });
    });
  }

  useEffect(() => {
    if (mode === "search") {
      input.current.focus();
    }
  }, [mode]);

  const listMode = mode === "list";
  const statusMode = mode === "status";
  const searchMode = mode === "search";

  return (
    <>
      <SideBar toggle={statusMode} onClose={handleClose}>
        {
          <OwnerStatus
            userName={userName}
            list={contacts}
            onContactClick={handleContactClick}
            onListModeClick={gotoListMode}
          />
        }
      </SideBar>
      <TitleBar
        first={
          <React.Fragment>
            {searchMode ? (
              <FontAwesomeIcon
                icon={faArrowLeft}
                size="lg"
                color="#009588"
                className={styles["pointer"]}
                onClick={gotoListMode}
              />
            ) : (
              <FontAwesomeIcon
                icon={faBars}
                size="lg"
                color="#009588"
                className={styles["pointer"]}
                onClick={gotoStatusMode}
              />
            )}
          </React.Fragment>
        }
        middle={
          <div className={styles["app-title"]}>
            {listMode && "Fancy Messenger"}
            {searchMode && (
              <input
                type="text"
                className={styles["search-text"]}
                ref={input}
                onChange={(e) => onSearch(e.target.value)}
              />
            )}
          </div>
        }
        last={
          listMode && (
            <FontAwesomeIcon
              icon={faSearch}
              size="lg"
              color="#009588"
              className={styles["pointer"]}
              onClick={gotoSearchMode}
            />
          )
        }
      />
    </>
  );
}
