import {
  loadContacts,
  loadRecentChats,
  getChatMessages,
} from "../services/main";

export const initChatbox = (userId) => {
  return (dispatch, getState) => {
    dispatch({ type: "LOADING" });

    loadContacts(userId).then((data) =>
      dispatch({
        type: "CONTACTS_LOADED",
        payload: data,
      })
    );
    loadRecentChats(userId).then((chats) => {
      dispatch({
        type: "CHATS_LOADED",
        payload: chats,
      });
    });
  };
};

export const loadChatMessages = (id, userId) => {
  return async (dispatch) => {
    dispatch({ type: "WAITING_FOR_MESSAGE" });
    const data = await getChatMessages(id, userId);
    const dataResult = data.result;
    dispatch({ type: "LOAD_CHAT_MESSAGES", payload: { id, dataResult } });
  };
};
