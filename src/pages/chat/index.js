import React, { useEffect, useMemo } from "react";
import AppStatus from "./components/appStatus";
import ListItem from "./components/listItem";
import List from "./components/list";
import ChatDetail from "./components/chatDetail";
import styles from "./index.module.scss";
// import { useAppState } from "../../context/appStateContext";
// import { useDispatch } from "../../context/dispatcherContext";
import {
  submitTextMessage,
  // loadContacts,
  // loadRecentChats,
  // getChatMessages,
} from "../../services/main";
import io from "socket.io-client";
import { baseUrl } from "./../../utility/request";
import moment from "moment";
import {
  initChatbox,
  loadChatMessages,
} from "./../../stateManager/actionCreator";
import Spinner from "../../sharedComponents/spinner";
import { useSelector, useDispatch } from "react-redux";

export default function Index() {
  console.log(useSelector((state) => state));
  const {
    selectedChatId,
    list,
    searchedlist,
    messages,
    name,
    userId,
    contacts,
    loading,
    waitingForMessages,
  } = useSelector((state) => state);
  const dispatch = useDispatch();
  const selectedChatMessages = messages.filter(
    (x) => x.chatId === selectedChatId
  );

  const sortedChatList = useMemo(() => {
    return list.slice().sort((a, b) => {
      const lastMessageA = messages.filter((x) => x.chatId === a.id);
      const lastMessageB = messages.filter((x) => x.chatId === b.id);
      if (!lastMessageA && !lastMessageB) {
        return 0;
      } else if (!lastMessageA && lastMessageB) {
        return -1;
      } else if (!lastMessageB && lastMessageA) {
        return +1;
      } else {
        return moment(lastMessageB.time).isBefore(lastMessageA.time) ? 1 : -1;
      }
    });
  }, [list, messages]);

  useEffect(() => {
    dispatch(initChatbox(userId));
  }, [userId, dispatch]);

  useEffect(() => {
    const socket = io(baseUrl);
    socket.emit("online", userId);

    socket.on("new-user", (user) => {
      dispatch({ type: "NEW_USER_REGISTERED", payload: user });
    });

    socket.on("new-message", (data) => {
      dispatch({ type: "NEW_MESSAGE_RECEIVED", payload: data });
    });
  }, [userId, dispatch]);

  const selectedChat = list.find((x) => x.id === selectedChatId);

  function handleSubmitMessage(text) {
    submitTextMessage(userId, selectedChatId, text);
    // .then(() =>
    //   dispatch({ type: "MESSAGE_SUBMITED", payload: text })
    // );
  }

  function handleClose() {
    dispatch({ type: "CHAT_CLOSED", payload: null });
  }

  function handleSearch(e) {
    const searchedChat = e;
    dispatch({ type: "SEARCHED_LIST", payload: searchedChat });
  }

  function handleStatusMode(mode) {
    dispatch({ type: "STATUS_ENABLED", payload: mode });
  }

  function handleChatSelect(id) {
    if (id === selectedChatId) {
      return;
    }
    dispatch(loadChatMessages(id, userId));
  }
  return (
    <div className={styles["layout"]}>
      <Spinner loading={loading && !selectedChatId} />

      <div className={styles[`${!selectedChatId ? "side-small" : "side"}`]}>
        <AppStatus
          onSearch={handleSearch}
          selfStatusMode={handleStatusMode}
          userName={name}
          list={contacts}
        />

        <List>
          {sortedChatList
            .filter((item) =>
              item.name.toLowerCase().includes(searchedlist.toLowerCase())
            )
            .map((item) => {
              const lastMessage = messages.filter((x) => x.chatId === item.id);
              return (
                <ListItem
                  key={item.id}
                  name={item.name}
                  avatar={item.avatar}
                  time={
                    lastMessage.length === 0
                      ? ""
                      : lastMessage[lastMessage.length - 1].time
                  }
                  unreadMessageCount={item.unreadMessageCount}
                  text={
                    lastMessage.length === 0
                      ? ""
                      : lastMessage[lastMessage.length - 1].text
                  }
                  selected={item.id === selectedChatId}
                  onSelect={() => handleChatSelect(item.id)}
                />
              );
            })}
        </List>
      </div>
      <div className={styles[`${selectedChatId ? "main-small" : "main"}`]}>
        <Spinner loading={waitingForMessages} />
        {selectedChatId && (
          <ChatDetail
            loading={waitingForMessages}
            key={selectedChat.id}
            selectedChatId={selectedChatId}
            onClose={handleClose}
            onSubmit={handleSubmitMessage}
            avatar={selectedChat.avatar}
            name={selectedChat.name}
            messages={selectedChatMessages.map((message) => {
              return {
                id: message.id,
                text: message.text,
                me: message.userId === userId,
                time: message.time,
              };
            })}
          />
        )}
      </div>
    </div>
  );
}
