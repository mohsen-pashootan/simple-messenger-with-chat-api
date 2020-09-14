const INIT_STATE = {
  name: "",
  userId: null,
  list: [],
  messages: [],
  searchedlist: "",
  status: "",
  selectedChatId: null,
  contacts: [],
  loading: false,
  waitingForMessages: false,
};

export function reducer(state = INIT_STATE, action) {
  switch (action.type) {
    case "LIST_RECIEVED":
      return {
        ...state,
        list: action.payload,
      };

    case "SEARCHED_LIST":
      return {
        ...state,
        searchedlist: action.payload,
      };

    case "CHAT_SELECTED":
      return {
        ...state,
        selectedChatId: action.payload,
      };

    case "CHAT_CLOSED":
      return {
        ...state,
        selectedChatId: action.payload,
      };

    case "STATUS_ENABLED":
      return {
        ...state,
        status: action.payload,
      };

    case "LOADING":
      return {
        ...state,
        loading: true,
      };

    case "WAITING_FOR_MESSAGE":
      return {
        ...state,
        waitingForMessages: true,
      };

    case "USER_SIGNED_IN":
      return {
        ...state,
        name: action.payload.name,
        userId: action.payload.id,
      };

    case "CONTACTS_LOADED":
      return {
        ...state,
        contacts: action.payload.filter((item) => item.id !== state.userId),
        loading: false,
      };

    case "CHATS_LOADED":
      const messages = [...state.messages];
      action.payload.forEach((chat) => {
        if (chat.lastMessage) {
          messages.push({
            chatId: chat.id,
            id: chat.lastMessage.id,
            text: chat.lastMessage.content,
            userId: chat.lastMessage.userId,
            time: chat.lastMessage.date,
          });
        }
      });
      return {
        ...state,
        list: action.payload.map((item) => ({
          ...item,
          avatar: "./avatar.png",
          time: item.lastMessage ? item.lastMessage.date : null,
        })),
        messages,
        loading: false,
      };

    case "CHAT_CREATED":
      let newChatList = state.list;
      if (!state.list.some((x) => x.id === action.payload.resultId)) {
        const newChat = {
          time: "",
          unreadMessageCount: 0,
          avatar: "./avatar.png",
          name: action.payload.name,
          id: action.payload.resultId,
        };
        newChatList = [newChat, ...state.list];
      }
      console.log(action.payload.resultId);
      return {
        ...state,
        selectedChatId: action.payload.resultId,
        list: newChatList,
        messages: [],
      };

    case "MESSAGE_SUBMITED":
      return {
        ...state,
        messages: [
          ...state.messages,
          {
            chatId: state.selectedChatId,
            id: Math.random().toString(),
            text: action.payload,
            userId: state.userId,
          },
        ],
      };

    case "LOAD_CHAT_MESSAGES":
      const newChatListLoad = [...state.list];
      const index = state.list.findIndex((x) => x.id === action.payload.id);
      newChatListLoad.splice(index, 1, {
        ...state.list[index],
        unreadMessageCount: 0,
      });
      return {
        ...state,
        messages: [
          ...state.messages.filter((x) => x.chatId !== action.payload.id),
          ...action.payload.dataResult.messages.map((msg) => ({
            chatId: action.payload.id,
            id: msg.id,
            text: msg.content,
            userId: msg.userId,
            time: msg.date,
          })),
        ],
        selectedChatId: action.payload.id,
        list: newChatListLoad,
        waitingForMessages: false,
      };

    case "PREPEND_CHAT_MESSAGES":
      return {
        ...state,
        messages: [
          ...action.payload.dataResult.messages.map((msg) => ({
            chatId: action.payload.selectedChatId,
            id: msg.id,
            text: msg.content,
            userId: msg.userId,
          })),
          ...state.messages,
        ],
        selectedChatId: action.payload.selectedChatId,
      };

    case "NEW_USER_REGISTERED":
      if (state.contacts.some((x) => x.id === action.payload.id)) {
        return state;
      }
      return {
        ...state,
        contacts: [...state.contacts, action.payload],
      };

    case "NEW_MESSAGE_RECEIVED":
      const _ChatID = action.payload.chatId;
      const _Messages = action.payload.message;
      const newList = [...state.list];
      if (!state.list.some((x) => x.id === _ChatID)) {
        const newChat = {
          time: _Messages.date,
          unreadMessageCount: 1,
          avatar: "/avatar.png",
          id: _ChatID,
          name: state.contacts.find((x) => x.id === _Messages.userId).name,
        };
        newList.push(newChat);
      } else if (state.selectedChatId !== _ChatID) {
        const index = state.list.findIndex((x) => x.id === _ChatID);
        newList.splice(index, 1, {
          ...state.list[index],
          unreadMessageCount: state.list[index].unreadMessageCount + 1,
          time: _Messages.date,
        });
      }
      const newMessages = [
        ...state.messages,
        {
          chatId: _ChatID,
          id: _Messages.id,
          text: _Messages.content,
          userId: _Messages.userId,
          time: _Messages.date,
        },
      ];
      return {
        ...state,
        messages: newMessages,
        list: newList,
      };

    default:
      return state;
  }
}
