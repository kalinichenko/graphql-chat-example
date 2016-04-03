import React from 'react';
import Relay from 'react-relay';

import MessageInput from './MessageInput';
import AddMessageMutation from '../mutations/AddMessageMutation';

class Footer extends React.Component { 
  _addMessage = (text) => {
    Relay.Store.commitUpdate(
      new AddMessageMutation({text, chat: this.props.chat})
    );
  };

  render() {
    return (
      <div className="footer">
        <MessageInput
          placeholder="Type your message and hit Enter ..."
          onSave={this._addMessage}
        />
      </div>
    )
  }
}

export default Relay.createContainer(Footer, {
  fragments: {
    chat: () => Relay.QL`
      fragment on Chat {
        ${AddMessageMutation.getFragment('chat')},
        id,
      }
    `,
  },
});

