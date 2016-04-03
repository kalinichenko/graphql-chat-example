import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import expect from 'expect';

import {_Message as Message} from '../../js/components/Message';

describe('Message', function () {
  let component
  const props = {
    message: {
      avatar: '<div class="avatarContent"></div>',
      addedAt: '2016-04-02T19:28:43.586Z',
      text: 'message',
    },
  }

  beforeEach(function() {
    component = TestUtils.renderIntoDocument(
      <Message {...props}/>
    );
  })

  it("renders a view mode", function () {

    const textMessage = TestUtils.findRenderedDOMComponentWithClass(
      component, 'textMessage'
    );

    expect(textMessage.textContent).toEqual(props.message.text);

    const avatar = TestUtils.findRenderedDOMComponentWithClass(
      component, 'avatar'
    );

    expect(avatar.children.length).toEqual(1);
    expect(avatar.children[0].tagName).toEqual('DIV');
    expect(avatar.children[0].className).toEqual('avatarContent');
  })

  it("renders an edit mode", function () {
    const viewMessage = TestUtils.findRenderedDOMComponentWithClass(
      component, 'viewMessage'
    );
    TestUtils.Simulate.doubleClick(viewMessage)

    const messageInput = TestUtils.findRenderedDOMComponentWithClass(
      component, 'messageInput'
    );

    expect(messageInput).toExist()
  })
})


