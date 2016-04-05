import Relay from 'react-relay';

export default class ChangeMessageMutation extends Relay.Mutation {
  static fragments = {
    message: () => Relay.QL`
      fragment on Message {
        id,
      }
    `,
  };
  getMutation() {
    return Relay.QL`mutation{changeMessage}`;
  }
  getFatQuery() {
    return Relay.QL`
      fragment on ChangeMessagePayload {
        message {
          text,
        }
      }
    `;
  }
  getConfigs() {
    return [{
      type: 'FIELDS_CHANGE',
      fieldIDs: { message: this.props.message.id },
    }];
  }
  getVariables() {
    return {
      text: this.props.text,
      id: this.props.message.id,
    };
  }
}
