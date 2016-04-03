import React from 'react';
import Relay from 'react-relay';

class Header extends React.Component { 

  constructor(props) {
    super(props);
    this.state = this._getPluralizedLabel(this.props.chat.total)
  }

  _getPluralizedLabel = (total) => {
    return {'label': total === 1 ? 'item' : 'items'}
  }

  componentWillReceiveProps(nextProps) {
    this.state = this._getPluralizedLabel(nextProps.chat.total)
  }
  
  render() {
    return (
      <div className="header">
        <span>{this.props.chat.total} {this.state.label}</span>
      </div>
    )
  }
}

export default Relay.createContainer(Header, {
  fragments: {
    chat: () => Relay.QL`
      fragment on Chat {
        total,
        id,
      }
    `
  }
});
