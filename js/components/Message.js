import React from 'react';
import Relay from 'react-relay';

import ChangeMessageMutation from '../mutations/ChangeMessageMutation';
import RemoveMessageMutation from '../mutations/RemoveMessageMutation';
import MessageInput from './MessageInput';

function _pad2(num) {
  return +num > 9 ? num : '0' + num
}

function _formatDate(s) {
  const d = new Date(s);
  return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()} ${d.getHours()}:${_pad2(d.getMinutes())}`
}
    
const ViewMessage1 = (props) => 
    <div onClick={props.onRemove} />

const ViewMessage = (props) => 
  <div className="viewMessage" onDoubleClick={props.onEdit}>
    <span className="textMessage">{props.text}</span>
    <div className="removeButton" onClick={props.onRemove}>
      <svg viewBox="0 0 500 500" width="20" height="20" fill="#c2c2c2">
        <use xlinkHref="#cross"/>
      </svg>
    </div>
  </div>

export class _Message extends React.Component {
  state = {
    isEditing: false,
  };

  _setEditMode = (shouldEdit) => {
    this.setState({isEditing: shouldEdit});
  };

  _removeMessage = () => {
    Relay.Store.commitUpdate(
      new RemoveMessageMutation({message: this.props.message, chat: this.props.chat})
    );
  };

  _editMessage = () => {
    this.setState({isEditing: true});
  };
  
  _saveMessage = (text) => {
    this.setState({isEditing: false});
    Relay.Store.commitUpdate(
      new ChangeMessageMutation({chat: this.props.chat, text, message: this.props.message})
    );
  };

  _cancel = () => {
    this.setState({isEditing: false});
  };

  _renderEditMode() {
    return (
      <MessageInput
        initialValue={this.props.message.text}
        onCancel={this._cancel}
        onDelete={this._removeMessage}
        onSave={this._saveMessage}
      />
    );
  }

  _renderViewMode() {
    return (
      <ViewMessage 
        text={this.props.message.text}
        onEdit={this._editMessage}
        onRemove={this._removeMessage}
      />
    )
  }

  render() {
    return (
      <li>
        <div className="message">
          <div className="avatar" dangerouslySetInnerHTML={{__html: this.props.message.avatar}} />
          <div className="content">
            {this.state.isEditing ? this._renderEditMode() : this._renderViewMode()}
          </div>
        </div>
        <div className="timestamp">{_formatDate(this.props.message.addedAt)}</div>
      </li>
    );
  }
}

export const Message = Relay.createContainer(_Message, {
  prepareVariables() {
    return {
      limit: 2147483647,  // GraphQLInt
    };
  },

  fragments: {
    message: () => Relay.QL`
      fragment on Message {
        ${RemoveMessageMutation.getFragment('message')},
        text,
        avatar,
        id,
        addedAt,
      }
    `,
    chat: () => Relay.QL`
      fragment on Chat {
        ${ChangeMessageMutation.getFragment('chat')},
        ${RemoveMessageMutation.getFragment('chat')},
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
