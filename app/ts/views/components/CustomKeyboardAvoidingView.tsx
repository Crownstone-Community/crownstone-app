import { Languages } from "../../Languages"

function lang(key,a?,b?,c?,d?,e?) {
  return Languages.get("CustomKeyboardAvoidingView", key)(a,b,c,d,e);
}

import * as React from 'react'; import { Component } from 'react';
import {
  Animated, BackHandler, Keyboard,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

import {
  screenHeight,
} from "../styles";
import { core } from "../../Core";


const KEYBOARD_HEIGHT = 450;

export const KEYBOARD_STATE = {
  visible: false,
}

export class CustomKeyboardAvoidingView extends Component< any, { offset: any} > {

  subscriptions = [];
  keyboardSubscriptions = [];

  constructor(props) {
    super(props);

    this.state = {
      offset: new Animated.Value(0),
    }
  }

  componentDidMount() {
    if (Platform.OS === 'android') {
      this.subscriptions.push(core.eventBus.on('focus', (data) => {
        let offset = 0;
        let correctedData = data - this.state.offset._value;
        KEYBOARD_STATE.visible = true;
        if (screenHeight - correctedData < KEYBOARD_HEIGHT) {
          offset = KEYBOARD_HEIGHT - (screenHeight - correctedData);
        }

        // if (this.props.enabled) {
          this.state.offset.stopAnimation();
          Animated.timing(this.state.offset, { toValue: -offset, useNativeDriver: false, duration: 150 }).start()
        // }
      }));
      this.subscriptions.push(core.eventBus.on('blur', (data) => {
        // if (this.props.enabled) {
          KEYBOARD_STATE.visible = false;
          this.state.offset.stopAnimation();
          Animated.timing(this.state.offset, { toValue: 0, useNativeDriver: false, duration: 150 }).start()
        // }
        // else {
        //   if (this.state.offset._value !== 0) {
        //     Animated.timing(this.state.offset, { toValue: 0, useNativeDriver: false, duration: 150 }).start()
        //   }
        // }
      }));
    }

  }

  componentWillUnmount() {
    KEYBOARD_STATE.visible = false;
    this.state.offset.stopAnimation();
    for (let unsubscriber of this.subscriptions) { unsubscriber(); }
    for (let subscription of this.keyboardSubscriptions) { subscription.remove(); }
  }

  render() {
    let style;
    if (this.props.style.position !== undefined) {
      style = {...this.props.style, top: this.state.offset};
    }
    else {
      style = {...this.props.style, position:'relative', top: this.state.offset};
    }

    if (Platform.OS === 'android') {
      return <Animated.View {...this.props} style={style} />;
    }
    else {
      return <KeyboardAvoidingView {...this.props} />
    }
  }
}
