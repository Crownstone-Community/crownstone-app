
import { Languages } from "../../../Languages"

function lang(key,a?,b?,c?,d?,e?) {
  return Languages.get("SphereIntegrations", key)(a,b,c,d,e);
}
import * as React from 'react';
import { ListEditableItems } from '../../components/ListEditableItems'

import {ScaledImage} from "../../components/ScaledImage";
import { NavigationUtil } from "../../../util/navigation/NavigationUtil";
import { TopBarUtil } from "../../../util/TopBarUtil";
import { LiveComponent } from "../../LiveComponent";
import {SettingsBackground} from "../../components/SettingsBackground";
import { SettingsScrollView } from "../../components/SettingsScrollView";

export class SphereIntegrations extends LiveComponent<any, any> {
  static options(props) {
    return TopBarUtil.getOptions({title: lang("Integrations"), closeModal: props.isModal ? true : undefined })
  }


  _getItemsAlternative() {
    let items = [];

    items.push({label: lang("Here_you_can_integrate_wi"),  type:'largeExplanation'});

    // items.push({label: lang("Smart_Lighting"),  type:'largeExplanation'});
    // items.push({
    //   label: lang("Philips_Hue"),
    //   type: 'navigation',
    //   largeIcon:
    //     <View style={{width:55, height:55, borderRadius:12, alignItems:"center", justifyContent:"center", overflow:'hidden'}}>
    //       <ScaledImage source={require("../../../../assets/images/thirdParty/logo/philipsHue.png")} targetWidth={55} targetHeight={55} sourceWidth={600} sourceHeight={600} />
    //     </View>,
    //   callback: () => {
    //     NavigationUtil.navigate("HueOverview", { sphereId: this.props.sphereId });
    //   }
    // });

    items.push({label: lang("Smart_assistants"),  type:'largeExplanation'});
    items.push({
      label: lang("Amazon_Alexa"),
      type: 'navigation',
      testID: 'Integration_Alexa',
      largeIcon: <ScaledImage source={require('../../../../assets/images/thirdParty/logo/amazonAlexa.png')} targetWidth={52} targetHeight={52} sourceWidth={264} sourceHeight={265}/>,
      callback: () => {
       NavigationUtil.navigate( "AlexaOverview",{sphereId: this.props.sphereId});
      }
    });
    items.push({
      label: lang("Google_Assistant"),
      type: 'navigation',
      testID: 'Integration_Google_Assistant',
      largeIcon: <ScaledImage source={require('../../../../assets/images/thirdParty/logo/googleAssistant_vertical_crop.png')} targetWidth={60} targetHeight={60} sourceWidth={842} sourceHeight={794}/>,
      callback: () => {
        NavigationUtil.navigate( "GoogleAssistantOverview",{sphereId: this.props.sphereId});
      }
    });



    items.push({type:'spacer'});
    items.push({type:'spacer'});
    items.push({type:'spacer'});

    return items;
  }

  render() {
    return (
      <SettingsBackground testID={"SphereIntegrations"}>
        <SettingsScrollView>
          <ListEditableItems items={this._getItemsAlternative()} />
        </SettingsScrollView>
      </SettingsBackground>
    );
  }
}
