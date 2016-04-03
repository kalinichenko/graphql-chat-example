import React from 'react';
import Relay from 'react-relay';

import {Message} from './Message';

class MessageList extends React.Component { 
  render() {
    return (
        <div className="inner">
          <ul className="messages">
            {this.props.chat.messages.edges.map(edge =>
              <Message
                key={edge.node.id}
                message={edge.node}
                chat={this.props.chat}
              />
            )}
          </ul>
        </div>
    );
  }
}

export default Relay.createContainer(MessageList, {
  prepareVariables() {
    return {
      limit: 2147483647,  // GraphQLInt
    };
  },
  fragments: {
    chat: () => Relay.QL`
      fragment on Chat {
        ${Message.getFragment('chat')},
        total,
        id,
        messages(first: $limit) {
          edges {
            node {
              id,
              text,
              avatar,
              addedAt,
              ${Message.getFragment('message')},
            },
          },
        },
      }
    `
  }
});

