import Relay from 'react-relay';

export default class AddMessageMutation extends Relay.Mutation {
  static fragments = {
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
    return Relay.QL`mutation{addMessage}`;
  }

  // prepare the variables that will be used as input to the mutation
  getVariables() {
    return {
      text: this.props.text,
    };
  }

  // represents every field in your data model that could change as a result of this mutation
  getFatQuery() {
    return Relay.QL`
      fragment on AddMessagePayload {
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

