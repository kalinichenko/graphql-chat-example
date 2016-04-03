import Relay from 'react-relay';

export default class RemoveMessageMutation extends Relay.Mutation {
  static fragments = {
    message: () => Relay.QL`
      fragment on Message {
        text,
        avatar,
        id,
        addedAt,
      }
    `,
    chat: () => Relay.QL`
      fragment on Chat {
        id,
        total,
        messages(first: 2147483647) { 
          edges {
            node {
              id,
              text,
              avatar,
              addedAt,
            },
          },
        },
        total,
      }
    `,
  };

  getMutation() {
    return Relay.QL`mutation{removeMessage}`;
  }

  // prepare the variables that will be used as input to the mutation
  getVariables() {
    return {
      id: this.props.message.id,
    };
  }

  // represents every field in your data model that could change as a result of this mutation
  getFatQuery() {
    return Relay.QL`
      fragment on RemoveMessagePayload {
        chat { messages },
      }
    `;
  }
  getConfigs() {
    return [{
      type: 'FIELDS_CHANGE',
      fieldIDs: { chat: this.props.chat.id },
    }];
  }
}
