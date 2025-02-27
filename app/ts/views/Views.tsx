
import { Languages } from "../Languages"

function lang(key,a?,b?,c?,d?,e?) {
  return Languages.get("Views", key)(a,b,c,d,e);
}
import * as React from 'react';

import { AddSphereTutorial }                  from "../views/main/addSphereTutorial/AddSphereTutorial";
import { AlexaOverview }                      from "../views/thirdParty/alexa/AlexaOverview";

import { AddItemsToSphere }                   from '../views/main/AddItemsToSphere'
import { DeviceOverview }                     from '../views/deviceViews/DeviceOverview'
import { DeviceEditAppearance }               from './deviceViews/DeviceEditAppearance'
import { DeviceIconSelection }                from '../views/deviceViews/DeviceIconSelection'
import { LoginSplash }                        from '../views/startupViews/LoginSplash'
import { Login }                              from '../views/startupViews/Login'
import { Logout }                             from "../views/startupViews/Logout";
import { MessageInbox }                       from '../views/messaging/MessageInbox'
import { MessageAdd }                         from '../views/messaging/MessageAdd'
import { Register }                           from '../views/startupViews/Register'
import { RoomOverview }                       from '../views/roomViews/RoomOverview'
import { RoomEdit }                           from '../views/roomViews/RoomEdit'
import { RoomAdd }                            from '../views/roomViews/RoomAdd'
import { RoomIconSelection }                  from '../views/roomViews/RoomIconSelection'
import { SphereOverview }                     from '../views/main/SphereOverview'
import { SelectFromList }                     from '../views/selection/SelectFromList'
import { SphereEdit }                         from '../views/main/SphereEdit'
import { SphereUserInvite }                   from "../views/main/editSubviews/SphereUserInvite";
import { SphereUserOverview }                 from "../views/main/editSubviews/SphereUserOverview";
import { SphereInvitedUser }                  from "../views/main/editSubviews/SphereInvitedUser";
import { SphereUser }                         from "../views/main/editSubviews/SphereUser";
import { SphereIntegrations }                 from "../views/main/editSubviews/SphereIntegrations";

import { SettingsApp }                        from '../views/settingsViews/SettingsApp'
import { SettingsBleDebug }                   from '../views/settingsViews/dev/SettingsBleDebug'
import { SettingsDeveloper }                  from '../views/settingsViews/dev/SettingsDeveloper'
import { SettingsDiagnostics }                from '../views/settingsViews/SettingsDiagnostics'
import { SettingsFactoryResetStep1 }          from '../views/settingsViews/SettingsFactoryResetStep1'
import { SettingsFactoryResetStep2 }          from '../views/settingsViews/SettingsFactoryResetStep2'
import { SettingsFAQ }                        from "../views/settingsViews/SettingsFAQ";
import { SettingsLogging }                    from "../views/settingsViews/dev/SettingsLogging";
import { SettingsOverview }                   from '../views/settingsViews/SettingsOverview'
import { SettingsProfile }                    from '../views/settingsViews/SettingsProfile'
import { SettingsPrivacy }                    from '../views/settingsViews/SettingsPrivacy'
import { SettingsRedownloadFromCloud }        from '../views/settingsViews/SettingsRedownloadFromCloud'
import { SettingsStoneBleDebug }              from '../views/settingsViews/dev/SettingsStoneBleDebug'
import { SettingsBleTroubleshooting }         from '../views/settingsViews/SettingsBleTroubleshooting'
import { IconDebug }                          from "../views/development/IconDebug";
import { DeviceSmartBehaviour }               from "../views/deviceViews/smartBehaviour/DeviceSmartBehaviour";
import { DeviceSmartBehaviour_TypeSelector }  from "../views/deviceViews/smartBehaviour/DeviceSmartBehaviour_TypeSelector";
import { DeviceSmartBehaviour_Editor }        from "../views/deviceViews/smartBehaviour/DeviceSmartBehaviour_Editor";
import { DeviceSmartBehaviour_Wrapup }        from "../views/deviceViews/smartBehaviour/DeviceSmartBehaviour_Wrapup";
import { AddCrownstone }                      from "../views/addingCrownstones/AddCrownstone";
import { ScanningForSetupCrownstones }        from "../views/addingCrownstones/ScanningForSetupCrownstones";
import { SetupCrownstone }                    from "../views/addingCrownstones/SetupCrownstone";
import { DfuIntroduction }                    from "../views/dfu/DfuIntroduction";
import { DfuScanning }                        from "../views/dfu/DfuScanning";
import { DfuBatch }                           from "../views/dfu/DfuBatch";
import { DfuFinished }                        from "../views/dfu/DfuFinished";
import { Processing }                         from "../views/overlays/Processing";
import { AicoreTimeCustomizationOverlay }     from "../views/overlays/AicoreTimeCustomizationOverlay";
import { BleStateOverlay }                    from "../views/overlays/BleStateOverlay";
import { LibMessages }                        from "../views/overlays/LibMessages";
import { ListOverlay }                        from "../views/overlays/ListOverlay";
import { LocationPermissionOverlay }          from "../views/overlays/LocationPermissionOverlay";
import { SimpleOverlay }                      from "../views/overlays/SimpleOverlay";
import { OptionPopup }                        from "../views/overlays/OptionPopup";
import { DeviceAbilities }                    from "../views/deviceViews/DeviceAbilities";
import { Ability_DimmerSettings }             from "../views/deviceViews/abilities/settings/Ability_DimmerSettings";
import { Ability_SwitchcraftInformation }     from "../views/deviceViews/abilities/information/Ability_SwitchcraftInformation";
import { Ability_TapToToggleSettings }        from "../views/deviceViews/abilities/settings/Ability_TapToToggleSettings";
import { Ability_SwitchcraftSettings }        from "../views/deviceViews/abilities/settings/Ability_SwitchcraftSettings";
import { Ability_TapToToggleInformation }     from "../views/deviceViews/abilities/information/Ability_TapToToggleInformation";
import { DevicePowerUsage }                   from "../views/deviceViews/DevicePowerUsage";
import { DeviceSmartBehaviour_CopyStoneSelection } from "../views/deviceViews/smartBehaviour/DeviceSmartBehaviour_CopyStoneSelection";
import { DeviceSmartBehaviour_BehaviourSelector }  from "../views/deviceViews/smartBehaviour/DeviceSmartBehaviour_BehaviourSelector";
import { NumericOverlay }                     from "../views/overlays/NumericOverlay";
import { DEV_UserData }                       from "../views/dev/user/DEV_UserDataSpheres";
import { DEV_PresenceMocking }                from "../views/dev/PresenceMocking/DEV_PresenceMocking";
import { DEV_FirmwareTest }                   from "../views/dev/firmwareTesting/DEV_FirmwareTest";
import { DEV_AdvancedConfig }                 from "../views/dev/firmwareTesting/DEV_AdvancedConfig";
import { DEV_DFU }                            from "../views/dev/firmwareTesting/DEV_DFU";
import { DEV_StoneSelector }                  from "../views/dev/stoneSelecting/DEV_StoneSelector";
import { DEV_RawAdvertisements }              from "../views/dev/firmwareTesting/DEV_RawAdvertisements";
import { SphereEditMap }                      from "../views/main/editSubviews/SphereEditMap";
import { SettingsDatabaseExplorer }           from "../views/settingsViews/dev/SettingsDatabaseExplorer";
import { DEV_Batching }                       from "../views/dev/batching/DEV_Batching";
import { SettingsUptime }                     from "../views/settingsViews/dev/SettingsUptime";
import { ScenesOverview }                     from "../views/scenesViews/ScenesOverview";
import { SceneAdd }                           from "../views/scenesViews/SceneAdd";
import { ScenePictureGallery }                from "../views/scenesViews/ScenePictureGallery";
import { SceneEdit }                          from "../views/scenesViews/SceneEdit";
import { SceneSelectCrownstones }             from "../views/scenesViews/SceneSelectCrownstones";
import { SettingsLocalizationMonitor }        from "../views/settingsViews/dev/SettingsLocalizationMonitor";
import { DimLevelOverlay }                    from "../views/overlays/DimLevelOverlay";
import { GoogleAssistantOverview }            from "../views/thirdParty/google/GoogleAssistantOverview";
import { PermissionIntroduction }             from "../views/startupViews/PermissionIntroduction";
import { HueOverview }                        from "../views/thirdParty/hue/HueOverview";
import { HueAdd }                             from "../views/thirdParty/hue/HueAdd";
import { SetupHub }                           from "../views/addingCrownstones/SetupHub";
import { HubOverview }                        from "../views/hubViews/HubOverview";
import { Initializer }                        from "./startupViews/Initializer";
import { TextInputOverlay }                   from "./overlays/TextInputOverlay";
import { SettingsDevHub }                     from "./settingsViews/dev/SettingsDevHub";
import { SettingsLogLevelConfig }             from "./settingsViews/dev/SettingsLogLevelConfig";
import { SettingsLogOverview }                from "./settingsViews/dev/SettingsLogOverview";
import { LocalizationMenu }                   from "./main/localization/LocalizationMenu";
import { SetupLocalization }                  from "./main/localization/SetupLocalization";
import { SphereOverviewSideBar }              from "./sidebars/SphereOverviewSideBar";
import { RoomPictureSelection }               from "./roomViews/RoomPictureSelection";
import { DeviceError }                        from "./deviceViews/DeviceError";
import { EnergyUsage }                        from "./energyUsage/EnergyUsage";
import { BehaviourMenu }                      from "./main/behaviour/BehaviourMenu";
import { RoomTraining }                       from "./main/localization/RoomTraining";
import { RoomTraining_inHand_intro }          from "./main/localization/RoomTraining_inHand_intro";
import { RoomTraining_training }              from "./main/localization/RoomTraining_training";
import { RoomTraining_inPocket_intro }        from "./main/localization/RoomTraining_inPocket_intro";
import { RoomTraining_conclusion }            from "./main/localization/RoomTraining_conclusion";
import { LocalizationQuickFix }               from "./main/localization/LocalizationQuickFix";
import { LocalizationCrownstoneMoved }        from "./main/localization/LocalizationCrownstoneMoved";
import { SelectCrownstone }                   from "./selection/SelectCrownstone";
import { SelectCrownstoneOverlay }            from "./overlays/SelectCrownstoneOverlay";
import { LocalizationDetail }                 from "./main/localization/LocalizationDetail";
import { LocalizationFindAndFix }             from "./main/localization/LocalizationFindAndFix";
import { LocalizationFingerprintManager }     from "./main/localization/LocalizationFingerprintManager";
import { Ability_DoubleTapSwitchcraft }       from "./deviceViews/abilities/settings/Ability_DoubleTapSwitchcraft";
import { CloudChoice }                        from "./startupViews/CloudChoice";
import { LocalizationAdvancedSettings } from "./main/localization/LocalizationAdvancedSettings";
import { LocalizationRoomQuality } from "./main/localization/LocalizationRoomQuality";
import { LocalizationFindAndFix_noLocation } from "./main/localization/LocalizationFindAndFix_noLocation";
import {LocalizationTransform} from "./main/localization/LocalizationTransform";
import {LocalizationTransform_intro} from "./main/localization/LocalizationTransform_intro";
import {LocalizationTransform_userSelect} from "./main/localization/LocalizationTransform_userSelect";


export const Views = {
  Initializer:                       Initializer,

  AddCrownstone:                     AddCrownstone,

  LocalizationMenu:                  LocalizationMenu,
  LocalizationTransform:             LocalizationTransform,
  LocalizationTransform_intro:       LocalizationTransform_intro,
  LocalizationTransform_userSelect:  LocalizationTransform_userSelect,
  SetupLocalization:                 SetupLocalization,
  BehaviourMenu:                     BehaviourMenu,

  CloudChoice:                       CloudChoice,
  SetupCrownstone:                   SetupCrownstone,
  SetupHub:                          SetupHub,
  ScanningForSetupCrownstones:       ScanningForSetupCrownstones,

  DfuIntroduction:                   DfuIntroduction,
  DfuScanning:                       DfuScanning,
  DfuBatch:                          DfuBatch,
  DfuFinished:                       DfuFinished,

  PermissionIntroduction:            PermissionIntroduction,

  AddItemsToSphere:                  AddItemsToSphere,
  AddSphereTutorial:                 AddSphereTutorial,
  AlexaOverview:                     AlexaOverview,
  GoogleAssistantOverview:           GoogleAssistantOverview,
  HubOverview:                       HubOverview,
  DeviceError:                       DeviceError,
  DeviceEditAppearance:              DeviceEditAppearance,
  DeviceIconSelection:               DeviceIconSelection,
  DeviceAbilities:                   DeviceAbilities,
  DeviceOverview:                    DeviceOverview,
  DevicePowerUsage:                  DevicePowerUsage,
  DeviceSmartBehaviour:              DeviceSmartBehaviour,
  DeviceSmartBehaviour_CopyStoneSelection: DeviceSmartBehaviour_CopyStoneSelection,
  DeviceSmartBehaviour_BehaviourSelector: DeviceSmartBehaviour_BehaviourSelector,
  DeviceSmartBehaviour_Editor:       DeviceSmartBehaviour_Editor,
  DeviceSmartBehaviour_TypeSelector: DeviceSmartBehaviour_TypeSelector,
  DeviceSmartBehaviour_Wrapup:       DeviceSmartBehaviour_Wrapup,
  Ability_SwitchcraftInformation:    Ability_SwitchcraftInformation,
  Ability_DimmerSettings:            Ability_DimmerSettings,
  Ability_SwitchcraftSettings:       Ability_SwitchcraftSettings,
  Ability_DoubleTapSwitchcraft:      Ability_DoubleTapSwitchcraft,
  Ability_TapToToggleInformation:    Ability_TapToToggleInformation,
  Ability_TapToToggleSettings:       Ability_TapToToggleSettings,
  IconDebug:                         IconDebug,
  Login:                             Login,
  LoginSplash:                       LoginSplash,
  Logout:                            Logout,
  MessageAdd:                        MessageAdd,
  MessageInbox:                      MessageInbox,
  Register:                          Register,
  RoomAdd:                           RoomAdd,
  RoomEdit:                          RoomEdit,
  RoomIconSelection:                 RoomIconSelection,
  RoomPictureSelection:              RoomPictureSelection,
  RoomOverview:                      RoomOverview,
  SelectFromList:                    SelectFromList,
  SettingsApp:                       SettingsApp,
  SettingsDatabaseExplorer:          SettingsDatabaseExplorer,
  SettingsBleDebug:                  SettingsBleDebug,
  SettingsBleTroubleshooting:        SettingsBleTroubleshooting,
  SettingsDeveloper:                 SettingsDeveloper,
  SettingsDevHub:                    SettingsDevHub,
  SettingsDiagnostics:               SettingsDiagnostics,
  SettingsFAQ:                       SettingsFAQ,
  SettingsFactoryResetStep1:         SettingsFactoryResetStep1,
  SettingsFactoryResetStep2:         SettingsFactoryResetStep2,
  SettingsLogging:                   SettingsLogging,
  SettingsLogLevelConfig:            SettingsLogLevelConfig,
  SettingsLogOverview:               SettingsLogOverview,
  SettingsOverview:                  SettingsOverview,
  SettingsPrivacy:                   SettingsPrivacy,
  SettingsProfile:                   SettingsProfile,
  SettingsRedownloadFromCloud:       SettingsRedownloadFromCloud,
  SettingsStoneBleDebug:             SettingsStoneBleDebug,
  SettingsUptime:                    SettingsUptime,
  SettingsLocalizationMonitor:       SettingsLocalizationMonitor,
  SphereEdit:                        SphereEdit,
  SphereEditMap:                     SphereEditMap,
  SphereIntegrations:                SphereIntegrations,
  SphereInvitedUser:                 SphereInvitedUser,
  SphereOverview:                    SphereOverview,
  SphereUser:                        SphereUser,
  SphereUserInvite:                  SphereUserInvite,
  SphereUserOverview:                SphereUserOverview,
  HueOverview:                       HueOverview,
  HueAdd:                            HueAdd,

  ScenesOverview:                    ScenesOverview,
  SceneAdd:                          SceneAdd,
  SceneEdit:                         SceneEdit,
  ScenePictureGallery:               ScenePictureGallery,
  SceneSelectCrownstones:            SceneSelectCrownstones,
  SelectCrownstone:                  SelectCrownstone,

  EnergyUsage:                       EnergyUsage,

  // localization
  RoomTraining:                      RoomTraining,
  RoomTraining_inHand_intro:         RoomTraining_inHand_intro,
  RoomTraining_training:             RoomTraining_training,
  RoomTraining_conclusion:           RoomTraining_conclusion,
  RoomTraining_inPocket_intro:       RoomTraining_inPocket_intro,
  LocalizationQuickFix:              LocalizationQuickFix,
  LocalizationDetail:                LocalizationDetail,
  LocalizationCrownstoneMoved:       LocalizationCrownstoneMoved,
  LocalizationFindAndFix_noLocation: LocalizationFindAndFix_noLocation,
  LocalizationFindAndFix:            LocalizationFindAndFix,
  LocalizationFingerprintManager:    LocalizationFingerprintManager,
  LocalizationAdvancedSettings:      LocalizationAdvancedSettings,
  LocalizationRoomQuality:           LocalizationRoomQuality,


  // Overlays:
  AicoreTimeCustomizationOverlay:    AicoreTimeCustomizationOverlay,
  BleStateOverlay:                   BleStateOverlay,
  DimLevelOverlay:                   DimLevelOverlay,
  LibMessages:                       LibMessages,
  ListOverlay:                       ListOverlay,
  LocationPermissionOverlay:         LocationPermissionOverlay,
  NumericOverlay:                    NumericOverlay,
  OptionPopup:                       OptionPopup,
  Processing:                        Processing,
  SelectCrownstoneOverlay:           SelectCrownstoneOverlay,
  SimpleOverlay:                     SimpleOverlay,
  TextInputOverlay:                  TextInputOverlay,


  // DEV
  DEV_FirmwareTest:                  DEV_FirmwareTest,
  DEV_AdvancedConfig:                DEV_AdvancedConfig,
  DEV_DFU:                           DEV_DFU,
  DEV_Batching:                      DEV_Batching,
  DEV_StoneSelector:                 DEV_StoneSelector,
  DEV_RawAdvertisements:             DEV_RawAdvertisements,
  DEV_PresenceMocking:               DEV_PresenceMocking,
  DEV_UserData:                      DEV_UserData,


  // Sidebars
  SphereOverviewSideBar:            SphereOverviewSideBar,
};



