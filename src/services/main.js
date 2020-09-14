import * as request from "../utility/request";

export function signIn(name) {
  return request.post("users", { name });
}

export function loadContacts(userId) {
  return new Promise((resolve) => {
    request.get("users").then((data) => {
      const newData = data.result.map((x) => {
        console.log(x);
        return {
          name: x.name,
          id: x.id,
        };
      });
      resolve(newData);
    });
  });
}

export function loadRecentChats(userId) {
  return new Promise((resolve) => {
    request.get(`chats/recent/user/${userId}`).then((data) => {
      console.log(data.result);
      resolve(data.result);
    });
  });
}

export function startChat(peerId1, peerId2) {
  return request.post(`chats/start/user`, {
    peer1: peerId1,
    peer2: peerId2,
  });
}

export function submitTextMessage(userId, chatId, message) {
  return request.post(`chats/submit/user/${userId}`, {
    chatId,
    message,
  });
}

export function getChatMessages(chatId, userId, messageId) {
  let url = `chats/load/${chatId}/user/${userId}/`;
  if (messageId) {
    url += `?message=${messageId}`;
  }
  return request.get(url);
}
