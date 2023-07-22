import * as React from 'react';
import {Platform, ScrollView} from "react-native";
import { viewPaddingTop } from "../styles";



export function SettingsScrollView(props) {
  return (
    <ScrollView
      testID={props.testID}
      keyboardShouldPersistTaps={props.keyboardShouldPersistTaps}
      contentInsetAdjustmentBehavior={'never'}
      contentContainerStyle={{
        flexGrow:1,
        paddingTop: viewPaddingTop,
        ...(props.contentContainerStyle ?? {})
    }}>
      {props.children}
    </ScrollView>
  );
}

