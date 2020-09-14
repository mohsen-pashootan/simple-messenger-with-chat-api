import React, { useState, useRef, useEffect } from "react";
import TitleBar from "./titleBar";
import ContactStatus from "./contactStatus";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEllipsisV,
  faTimes,
  faPaperPlane,
  faPaperclip,
  faArrowRight,
} from "@fortawesome/free-solid-svg-icons";
import Avatar from "./avatar";
import styles from "./chatDetail.module.scss";
import { getChatMessages } from "../../../services/main";
import TextMessage from "./textMessage";
import Spinner from "../../../sharedComponents/spinner";
import { useSelector, useDispatch } from "react-redux";
// import { useAppState } from "../../../context/appStateContext";
// import { useDispatch } from "../../../context/dispatcherContext";

export default function ChatDetail({
  name,
  messages,
  avatar,
  onSubmit,
  selectedChatId,
  onClose,
  loading,
}) {
  const [text, setText] = useState("");
  const [info, setInfo] = useState("chat");
  const dispatch = useDispatch();
  const { userId } = useSelector((state) => state);
  const myInput = useRef(null);
  const lastMessage = useRef("");
  const lastEmptyMessage = useRef(null);
  const messageContainer = useRef(null);

  useEffect(() => {
    if (lastEmptyMessage.current && messages.length > 0) {
      if (messages[messages.length - 1].text === lastMessage.current) {
        lastEmptyMessage.current.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [messages]);

  useEffect(() => {
    myInput.current.focus();
    if (lastEmptyMessage.current) {
      lastEmptyMessage.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedChatId]);

  useEffect(() => {
    function handleScroll() {
      if (messageContainer.current.scrollTop === 0) {
        getChatMessages(
          selectedChatId,
          userId,
          messages[messages.length - 1].id
        ).then((data) => {
          const dataResult = data.result;
          dispatch({
            type: "PREPEND_CHAT_MESSAGES",
            payload: { dataResult, selectedChatId },
          });
        });
      }
    }
    const msgContainer = messageContainer.current;
    msgContainer.addEventListener("scroll", handleScroll);
    return () => {
      msgContainer.removeEventListener("scroll", handleScroll);
    };
  }, [selectedChatId, messages, userId, dispatch]);

  function handleSubmitMessage() {
    if (text !== "") {
      onSubmit(text);
      setText("");
      lastMessage.current = text;
      myInput.current.focus();
    }
  }
  function handleKeyDown(e) {
    if (e.keyCode === 13) {
      handleSubmitMessage();
    }
  }

  function handleContactStatus() {
    setInfo("chatInfo");
  }

  function handleStatusClose() {
    setInfo("chat");
  }
  const chatMode = info === "chat";
  console.log(messages);
  return (
    <>
      <TitleBar
        first={
          <FontAwesomeIcon
            onClick={onClose}
            icon={faTimes}
            size="lg"
            color="#009588"
            className={styles["pointer"]}
          />
        }
        middle={
          <div className={styles["app-title"]}>
            <Avatar name={name} url={avatar} />
            <div className={styles["name"]}>{name}</div>
          </div>
        }
        last={
          chatMode ? (
            <FontAwesomeIcon
              onClick={handleContactStatus}
              icon={faEllipsisV}
              size="lg"
              color="#009588"
              className={styles["pointer"]}
            />
          ) : (
            <FontAwesomeIcon
              onClick={handleStatusClose}
              icon={faArrowRight}
              size="lg"
              color="#009588"
              className={styles["pointer"]}
            />
          )
        }
      />
      <div className={styles["chat-box"]}>
        <Spinner loading={loading} />
        {info === "chatInfo" ? (
          <ContactStatus name={name} avatar={avatar} />
        ) : (
          <>
            <ul className={styles["messages-panel"]} ref={messageContainer}>
              {messages.map((message, index) => {
                return (
                  <TextMessage
                    key={message.id}
                    ref={
                      messages.length === index + 1 ? lastEmptyMessage : null
                    }
                    me={message.me}
                    text={message.text}
                    time={message.time}
                  />
                );
              })}
            </ul>
            <div className={styles["input-section"]}>
              <input
                ref={myInput}
                type="text"
                value={text}
                onKeyDown={handleKeyDown}
                onChange={(e) => setText(e.target.value)}
              />
              <FontAwesomeIcon
                onClick={handleSubmitMessage}
                icon={text !== "" ? faPaperPlane : faPaperclip}
                color="#009588"
                className={styles["send"] + " " + styles["pointer"]}
                size="lg"
              />
            </div>
          </>
        )}
      </div>
    </>
  );
}
