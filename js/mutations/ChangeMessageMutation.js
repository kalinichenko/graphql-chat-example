import Relay from 'react-relay';

export default class ChangeMessageMutation extends Relay.Mutation {
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
    return Relay.QL`mutation{changeMessage}`;
  }
  getFatQuery() {
    return Relay.QL`
      fragment on ChangeMessagePayload {
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
  getVariables() {
    return {
      text: this.props.text,
      id: this.props.message.id,
    };
  }
}
