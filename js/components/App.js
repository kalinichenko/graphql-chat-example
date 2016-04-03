import React from 'react';
import Relay from 'react-relay';

import Footer from './Footer';
import Header from './Header';
import MessageList from './MessageList';

class App extends React.Component {
  render() {
    return (
      <div className="root">
        <Header chat={this.props.chat} />
        <MessageList chat={this.props.chat} />
        <Footer chat={this.props.chat} />
      </div>
    );
  }
}

export default Relay.createContainer(App, {
  prepareVariables() {
    return {
      limit: 2147483647,  // GraphQLInt
    };
  },

  fragments: {
    chat: () => Relay.QL`
      fragment on Chat {
        ${Footer.getFragment('chat')},
        ${Header.getFragment('chat')},
        ${MessageList.getFragment('chat')},
        id,
        total,
        messages(first: $limit) {
          edges {
            node {
              id,
              text,
              avatar,
              addedAt,
            },
          },
        },
      }
    `,
  },
});
