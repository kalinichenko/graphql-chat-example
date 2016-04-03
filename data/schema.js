/**
 *  Copyright (c) 2015, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

import {
  GraphQLBoolean,
  GraphQLFloat,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
} from 'graphql';

import {
  connectionArgs,
  connectionDefinitions,
  connectionFromArray,
  fromGlobalId,
  globalIdField,
  mutationWithClientMutationId,
  nodeDefinitions,
} from 'graphql-relay';

import {
  Chat,
  Message,
  getChat,
  getUser,
  getAvatar,
  getMessages,
  getMessage,
  addMessage,
  removeMessage,
  changeMessage,
} from './database';

/**
 * We get the node interface and field from the Relay library.
 *
 * The first method defines the way we resolve an ID to its object.
 * The second defines the way we resolve an object to its GraphQL type.
 */
var {nodeInterface, nodeField} = nodeDefinitions(
  (globalId) => {
    var {type, id} = fromGlobalId(globalId);
    if (type === 'Message') {
      return getMessage(id);
    } else if (type === 'Chat') {
      return getChat();
    } else {
      return null;
    }
  },
  (obj) => {
    if (obj instanceof Message) {
      return messageType;
    } else if (obj instanceof Chat) {
      return chatType;
    } else {
      return null;
    }
  }
);

/**
 * Define your own types here
 */

var messageType = new GraphQLObjectType({
  name: 'Message',
  description: 'A message that users add',
  fields: () => ({
    id: globalIdField('Message'),
    text: {
      type: GraphQLString,
      description: 'Text message',
    },
    avatar: {
      type: GraphQLString,
      resolve: (obj) => getAvatar(getUser(obj.addedBy).avatarId).content
    },
    addedAt: {
      type: GraphQLString,
      resolve: (obj) => obj.addedAt.toJSON()
    }
  }),
  interfaces: [nodeInterface],
});

var {connectionType: messageConnection} =
  connectionDefinitions({name: 'Message', nodeType: messageType});

var chatType = new GraphQLObjectType({
  name: 'Chat',
  fields: {
    id: globalIdField('Chat'),
    messages: {
      type: messageConnection,
      args: connectionArgs,
      resolve: (obj, args) =>
        connectionFromArray(getMessages(), args),
    },
    total: {
      type: GraphQLInt,
      resolve: () => getMessages().length,
    },
  },
  interfaces: [nodeInterface],
});


/**
 * This is the type that will be the root of our query,
 * and the entry point into our schema.
 */
var queryType = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    node: nodeField,
    chat: {
      type: chatType,
      resolve: () => getChat(),
    },
  }),
});

/**
 * This is the type that will be the root of our mutations,
 * and the entry point into performing writes in our schema.
 */
const addMessageMutation = mutationWithClientMutationId({
  name: 'AddMessage',
  inputFields: {
    text: { type: new GraphQLNonNull(GraphQLString) },
  },
  mutateAndGetPayload: ({text, chat}) => {
    const msg = addMessage(text);
    return {msg};
  },
  outputFields: {
    chat: {
      type: chatType,
      resolve: () => getChat(),
    },
  },
});

const changeMessageMutation = mutationWithClientMutationId({
  name: 'ChangeMessage',
  inputFields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    text: { type: new GraphQLNonNull(GraphQLString) },
  },
  mutateAndGetPayload: ({id, text}) => {
    const localId = fromGlobalId(id).id;
    const msg = changeMessage(localId, text);
    return {msg};
  },
  outputFields: {
    chat: {
      type: chatType,
      resolve: () => getChat(),
    },
  },
});

const removeMessageMutation = mutationWithClientMutationId({
  name: 'RemoveMessage',
  inputFields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
  },
  outputFields: {
    chat: {
      type: chatType,
      resolve: () => getChat(),
    },
  },
  mutateAndGetPayload: ({id}) => {
    const localId = fromGlobalId(id).id;
    const msg = removeMessage(localId);
    return {msg};
  },
});

const mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addMessage: addMessageMutation,
    changeMessage: changeMessageMutation,
    removeMessage: removeMessageMutation,
  }
});

/**
 * Finally, we construct our schema (whose starting query type is the query
 * type we defined above) and export it.
 */
export var Schema = new GraphQLSchema({
  query: queryType,
  mutation
});
