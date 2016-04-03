/**
 *  Copyright (c) 2015, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

// Models
export function Chat(id, name) {
  this.id = id;
  this.name = name;
}

export function Avatar(id, content) {
  this.id = id;
  this.content = content;
}

export function User(id, name, avatarId) {
  this.id = id;
  this.name = name;
  this.avatarId = avatarId;
}

export function Message(id, text, userId, chatId) {
  this.id = id;
  this.text = text;
  this.chatId = chatId;
  this.addedBy = userId;
  this.addedAt = new Date();
}

// Mock data
const defaultAvatar = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="30px" height="30px" viewBox="0 0 80 80" fill="#e0e0e0"><path class="svga-icon-boy" d="M73.22,72.6c-1.05-6.99-8.49-9.28-14.35-10.97c-3.07-0.89-6.98-1.58-9.48-3.72C47.3,56.13,47.5,50.9,49,49.8c3.27-2.39,5.26-7.51,6.14-11.25c0.25-1.07-0.36-0.46,0.81-0.64c0.71-0.11,2.13-2.3,2.64-3.21c1.02-1.83,2.41-4.85,2.42-8.02c0.01-2.23-1.09-2.51-2.41-2.29c-0.43,0.07-0.93,0.21-0.93,0.21c1.42-1.84,1.71-8.22-0.67-13.4C53.56,3.71,44.38,2,40,2c-2.35,0-7.61,1.63-7.81,3.31c-3.37,0.19-7.7,2.55-9.2,5.89c-2.41,5.38-1.48,11.4-0.68,13.4c0,0-0.5-0.14-0.93-0.21c-1.32-0.21-2.42,0.07-2.41,2.29c0.01,3.16,1.41,6.19,2.43,8.02c0.51,0.91,1.93,3.1,2.64,3.21c1.17,0.18,0.56-0.42,0.81,0.64c0.89,3.74,3.09,9.03,6.14,11.25c1.69,2.04,1.7,6.33-0.39,8.11c-2.84,2.43-7.37,3.07-10.84,4.12c-5.86,1.77-13.29,4.9-13.27,12.25C6.51,76.73,7.7,78,10.13,78h59.74c2.43,0,3.68-1.27,3.63-3.72C73.5,74.28,73.4,73.81,73.22,72.6C72.63,68.73,73.4,73.81,73.22,72.6z"></path></svg>';

const admin = new User(0, 'admin', 0);
const avatars = [new Avatar(0, defaultAvatar)];
const users = [(admin)];
const chat = new Chat(0, 'graphql');

const user2avatars = {
  '0': 0
};

const messages = [];


let nextMessageId = 0;

export function getMessages(chatId = 0) {
  return messages.filter(msg => msg.chatId === chatId)
}

function findBy(id, arr) {
  return arr.find(item => item.id === id)
}

export function getMessage(id) {
  return findBy(id, messages)
}

export function getUser(id) {
  return findBy(id, users)
}

export function getAvatar(id) {
  return findBy(id, avatars)
}

export function addMessage(text, chatId = chat.id, userId = admin.id) {
  const message = new Message(`${nextMessageId++}`, text, chatId, userId);
  messages.push(message);
  return message;
}

export function removeMessage(id) {
  const idx = messages.indexOf(getMessage(id));
  idx !== -1 && messages.splice(idx, 1);
}

export function changeMessage(id, text) {
  const message = getMessage(id);
  message.text = text;
}


export function getChat() {
  return chat;
}

addMessage('Double click on message to edit it ...');

