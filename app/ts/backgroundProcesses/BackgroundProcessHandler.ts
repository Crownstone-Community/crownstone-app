import {Alert, AppState, Platform} from 'react-native';

import {Bluenet} from "../native/libInterface/Bluenet";
import {BluenetPromise, BluenetPromiseWrapper} from "../native/libInterface/BluenetPromise";
import {LocationHandler} from "../native/localization/LocationHandler";
import {CLOUD} from "../cloud/cloudAPI";
import {AppUtil} from "../util/AppUtil";
import {Util} from "../util/Util";

import {DataUtil, prepareStoreForUser} from "../util/DataUtil";

import {StoreManager} from "../database/storeManager";
import {FirmwareWatcher} from "./FirmwareWatcher";
import {Scheduler} from "../logic/Scheduler";
import {SetupStateHandler} from "../native/setup/SetupStateHandler";
import {CLOUD_POLLING_INTERVAL, LOG_EXTENDED_TO_FILE, LOG_TO_FILE, SYNC_INTERVAL} from "../ExternalConfig";
import {BatterySavingUtil} from "../util/BatterySavingUtil";
import {MapProvider} from "./MapProvider";
import {DfuStateHandler} from "../native/firmware/DfuStateHandler";
import {NotificationHandler} from "./NotificationHandler";
import {MessageCenter} from "./MessageCenter";
import {CloudEventHandler} from "./CloudEventHandler";
import {Permissions} from "./PermissionManager";
import {LOG, LOGe, LOGw} from "../logging/Log";
import {LogProcessor} from "../logging/LogProcessor";
import {BleLogger} from "../native/advertisements/BleLogger";
import {StoneManager} from "../native/advertisements/StoneManager";
import {EncryptionManager} from "../native/libInterface/Encryption";
import {BroadcastStateManager} from "./BroadcastStateManager";
import {WatchStateManager} from "./WatchStateManager";
import {core} from "../Core";
import {cleanLogs} from "../logging/LogUtil";
import {migrate} from "./migration/StoreMigration";
import {CloudPoller} from "../logic/CloudPoller";
import {UpdateCenter} from "./UpdateCenter";
import {StoneAvailabilityTracker} from "../native/advertisements/StoneAvailabilityTracker";
import {StoneDataSyncer} from "./StoneDataSyncer";
import {BackButtonHandler} from "./BackButtonHandler";
import {base_core} from "../Base_core";
import {PowerUsageCacher} from "./PowerUsageCacher";
import {TimeKeeper} from "./TimeKeeper";
import {SphereStateManager} from "./SphereStateManager";
import {UptimeMonitor} from "./UptimeMonitor";
import {TrackingNumberManager} from "./TrackingNumberManager";
import {ActiveSphereManager} from "./ActiveSphereManager";
import {Languages} from "../Languages";
import {OverlayManager} from "./OverlayManager";
import {TestingFramework} from "./testing/TestingFramework";
import DeviceInfo from "react-native-device-info";
import {StatusBarWatcher} from "./StatusBarWatcher";
import {LocalizationCore} from "../localization/LocalizationCore";
import {LocalizationMonitor} from "../localization/LocalizationMonitor";
import { LocalizationDevDataLogger } from "../localization/LocalizationDevDataLogger";
import { SseHandler } from "./SseHandler";
import { SpherePresenceManager } from "./SpherePresenceManager";
import { EnergyUsageCacher } from "./EnergyUsageCacher";

const PushNotification = require('react-native-push-notification');

const BACKGROUND_SYNC_TRIGGER = 'backgroundSync';
const BACKGROUND_USER_SYNC_TRIGGER = 'activeSphereUserSync';

export const TIME_LAST_REBOOT = Date.now();

class BackgroundProcessHandlerClass {
  started               : boolean = false;
  userLoggedIn          : boolean = false;
  userLoggedInReady     : boolean = false;
  storePrepared         : boolean = false;

  cancelPauseTrackingCallback = null;
  trackingPaused = false;

  async parseLaunchArguments() {
    let launchArguments = await BluenetPromiseWrapper.getLaunchArguments();
    let localizationOverride = launchArguments?.['localization'];
    if (localizationOverride) {
      Languages.setLocale(localizationOverride);
    }

    // initialize test overrides if required.
    await TestingFramework.initialize(launchArguments);
  }

  async start() {
    if (!this.started) {

      // get the launch arguments
      await this.parseLaunchArguments();

      LOG.info("BackgroundProcessHandler: Starting the background processes.");
      // start the BLE things.
      // route the events to React Native
      Bluenet.rerouteEvents();
      BluenetPromiseWrapper.isDevelopmentEnvironment().then((result) => {
        base_core.sessionMemory.developmentEnvironment = result || DeviceInfo.isEmulatorSync();
        console.log("isDevelopmentEnvironment", base_core.sessionMemory.developmentEnvironment)
      });

      // hook into the back button handler for android.
      BackButtonHandler.init();

      // if there is a badge number, remove it on opening the app.
      this._clearBadge();

      // init the statekeeper of the color of the statusbar
      StatusBarWatcher.init();


      // we first setup the event listeners since these events can be fired by the this.startStore().
      core.eventBus.on('userActivated', () => {
        // clear the temporary data like state and disability of stones so no old data will be shown
        prepareStoreForUser();
      });

      // when the user is logged in we track spheres and scan for Crownstones
      // This event is triggered on boot by the start store or by the login process.
      core.eventBus.on('userLoggedIn', () => {
        let state = core.store.getState();
        if (state.app.indoorLocalizationEnabled === false) {
          LOG.info("BackgroundProcessHandler: Set background processes to OFF");
          Bluenet.setBackgroundScanning(false);
        }

        LOG.info("BackgroundProcessHandler: received userLoggedIn event.");

        // disable battery saving (meaning, no BLE scans reach the app)
        Bluenet.batterySaving(false);

        // initialize logging to file if this is required.
        this.setupLogging();
      });

      // when the user is logged in we track spheres and scan for Crownstones
      // This event is triggered on boot by the start store or by the login process.
      core.eventBus.on('userLoggedInFinished', () => {
        OverlayManager.initStateOverlays();

        ActiveSphereManager.userIsLoggedIn = true;

        this.userLoggedInReady = true;

        // pass the store to the singletons
        LOG.info("BackgroundProcessHandler: Starting singletons.");
        Languages.updateLocale();

        this.startSingletons();

        this.startDeveloperSingletons();

        this.startCloudService();

        this.startEventTriggers();

        this.startBluetoothListener();

        this.updateDeviceDetails();

        LocationHandler.applySphereStateFromStore();

        UpdateCenter.checkForFirmwareUpdates();

        this.setupLogging();

        // init behaviour based on if we are in the foreground or the background.
        this._applyAppStateOnScanning(AppState.currentState);
        this._applyAppStateOnCaching(AppState.currentState);

        BroadcastStateManager.init();

        let state = core.store.getState();
        // this should have been covered by the naming of the AI. This is a fallback and it's for users who are not admins.
        if (state.user.accessToken !== null && state.user.isNew !== false) {
          core.store.dispatch({type:'USER_UPDATE', data: {isNew: false}});
        }

        if (Platform.OS === 'android') {
          if (DataUtil.isDeveloper()) {
            Bluenet.useHighFrequencyScanningInBackground(state.development.useHighFrequencyScanningInBackground);
          }
        }

        LOG.info("Sync: Initialize tracking during Login.");
        LocationHandler.initializeTracking()

        LOG.info("Sync: Requesting notification permissions during Login.");
        NotificationHandler.request();

        LOG.info("BackgroundProcessHandler: received userLoggedInFinished event.");
      });

      // wait for store to be prepared in order to continue.
      core.eventBus.on("storePrepared", () => {
        LOG.info("BackgroundProcessHandler: Store is prepared.");
        this.storePrepared = true;
        MapProvider.init();
      });

      // Create the store from local storage. If there is no local store yet (first open), this is synchronous
      this.startStore();

    }
    this.started = true;
  }

  setupLogging() {
    let state = core.store.getState();
    Bluenet.enableLoggingToFile((DataUtil.isDeveloper() && state.development.logging_enabled === true) || LOG_TO_FILE === true);
    if ((DataUtil.isDeveloper() && state.development.logging_enabled === true && state.development.nativeExtendedLogging === true) || LOG_EXTENDED_TO_FILE === true) {
      Bluenet.enableExtendedLogging(true);
    }


    // use periodic events to clean the logs.
    let triggerId = "LOG_CLEANING_TRIGGER";
    Scheduler.setRepeatingTrigger(triggerId, {repeatEveryNSeconds: 5*3600});
    Scheduler.loadCallback(triggerId,() => { cleanLogs() }, true);

  }


  /**
   * Triggers background sync, sets the networkError handler which is used when there is no internet connection
   */
  startCloudService() {
    // sync every 10 minutes
    Scheduler.setRepeatingTrigger(BACKGROUND_SYNC_TRIGGER,      {repeatEveryNSeconds: SYNC_INTERVAL});
    Scheduler.setRepeatingTrigger(BACKGROUND_USER_SYNC_TRIGGER, {repeatEveryNSeconds: CLOUD_POLLING_INTERVAL});

    // if the app is open, update the user locations every 10 seconds
    Scheduler.loadCallback(BACKGROUND_USER_SYNC_TRIGGER, () => {
      if (SetupStateHandler.isSetupInProgress() === false) {
        CloudPoller.poll()
      }
    });

    // sync the full db with the cloud every 10 minutes
    Scheduler.loadCallback(BACKGROUND_SYNC_TRIGGER, () => {
      let state = core.store.getState();
      // if a crownstone is in setup mode, we do not sync at that time
      if (SetupStateHandler.isSetupInProgress() === false) {
        if (state.user.userId) {
          LOG.info("BackgroundProcessHandler: STARTING ROUTINE SYNCING IN BACKGROUND");
          CLOUD.sync(core.store, true)
            .then(() => { UpdateCenter.checkForFirmwareUpdates(); })
            .catch((err) => { LOGe.cloud("Error during background sync: ", err?.message)});
        }
      }
      else {
        LOG.info("BackgroundProcessHandler: Skipping routine sync due to active setup phase.");
      }
    });
  }



  /**
   * Update device specs: Since name is user editable, it can change over time. We use this to update the model.
   */
  updateDeviceDetails() {
    let state = core.store.getState();
    let currentDeviceSpecs = Util.data.getDeviceSpecs(state);
    let deviceInDatabaseId = Util.data.getDeviceIdFromState(state, currentDeviceSpecs.address);
    if (currentDeviceSpecs.address && deviceInDatabaseId) {
      let deviceInDatabase = state.devices[deviceInDatabaseId];
      // if the address matches but the name does not, update the device name in the cloud.
      if (deviceInDatabase.address === currentDeviceSpecs.address &&
        (currentDeviceSpecs.name != deviceInDatabase.name) ||
        (currentDeviceSpecs.os != deviceInDatabase.os) ||
        (currentDeviceSpecs.userAgent != deviceInDatabase.userAgent) ||
        (currentDeviceSpecs.deviceType != deviceInDatabase.deviceType) ||
        (currentDeviceSpecs.model != deviceInDatabase.model) ||
        (currentDeviceSpecs.locale != deviceInDatabase.locale) ||
        (currentDeviceSpecs.description != deviceInDatabase.description))
        {
        core.store.dispatch({type: 'UPDATE_DEVICE_CONFIG', deviceId: deviceInDatabaseId, data: {
          name: currentDeviceSpecs.name,
          os: currentDeviceSpecs.os,
          userAgent: currentDeviceSpecs.userAgent,
          deviceType: currentDeviceSpecs.deviceType,
          model: currentDeviceSpecs.model,
          locale: currentDeviceSpecs.locale,
          description: currentDeviceSpecs.description
        }})
      }
    }
  }

  /**
   * - When the user is logged in, we start listening for BLE and tracking spheres.
   *
   */
  startEventTriggers() {
    // listen to the state of the app: if it is in the foreground or background
    AppState.addEventListener('change', (appState) => {
      LOG.info("App State Change", appState);

      core.eventBus.emit("AppStateChange", appState);
      this._applyAppStateOnScanning(appState);
      this._applyAppStateOnCaching(appState);
      this._applyAppStateOnActiveSphere(appState);
    });
  }


  _applyAppStateOnCaching(appState) {
    if (appState === "active" && this.userLoggedInReady) {
      PowerUsageCacher.start();
    }
    else if (appState === 'background') {
      PowerUsageCacher.stop();
    }
  }


  _applyAppStateOnScanning(appState) {
    // in the foreground: start scanning!

    if (appState === "active" && this.userLoggedInReady) {
      BatterySavingUtil.startNormalUsage();

      // remove any badges from the app icon on the phone.
      this._clearBadge();

      // restore tracking state if required. An independent check for the indoorlocalization state is not required.
      if (this.cancelPauseTrackingCallback !== null) {
        this.cancelPauseTrackingCallback();
        this.cancelPauseTrackingCallback = null;
      }
      if (this.trackingPaused) {
        Bluenet.resumeTracking();
        BluenetPromiseWrapper.isReady().then(() => {
          LOG.info("BackgroundProcessHandler: Start Scanning after inactive.");
          return Bluenet.startScanningForCrownstonesUniqueOnly();
        });
        this.trackingPaused = false;
      }

      // if the app is open, update the user locations every 10 seconds
      Scheduler.resumeTrigger(BACKGROUND_USER_SYNC_TRIGGER);
    }
    else if (appState === 'background') {
      // in the background: stop scanning to save battery!
      BatterySavingUtil.startBatterySaving();

      // check if we require indoor localization, pause tracking if we dont.
      let state = core.store.getState();
      if (state.app.indoorLocalizationEnabled === false) {
        this.cancelPauseTrackingCallback = Scheduler.scheduleCallback(() => {
          // stop all scanning and tracking to save battery. This will only happen if the app lives in the background for 5 minutes when it shouldnt.
          Bluenet.pauseTracking();
          Bluenet.stopScanning();
          this.cancelPauseTrackingCallback = null;
          this.trackingPaused = true;
        }, 5*60*1000, 'pauseTracking');
      }

      // remove the user sync so it won't use battery in the background
      Scheduler.pauseTrigger(BACKGROUND_USER_SYNC_TRIGGER);
    }
  }

  _applyAppStateOnActiveSphere(appState) {
    if (appState === "active" && this.userLoggedInReady) {
      ActiveSphereManager.onScreen();
    }
    else if (appState === 'background') {
      ActiveSphereManager.toBackground()
    }
  }

  _clearBadge() {
    // if there is a badge number, remove it on opening the app.
    PushNotification.setApplicationIconBadgeNumber(0);

    PushNotification.cancelAllLocalNotifications();
  }

  startBluetoothListener() {
    // Ensure we start scanning when the bluetooth module is powered on.
    core.nativeBus.on(core.nativeBus.topics.bleStatus, (status) => {
      if (this.userLoggedInReady && status === 'poweredOn') {
        BatterySavingUtil.startNormalUsage();
      }
    });

    Bluenet.requestBleState();
  }

  startStore() {
    // there can be a race condition where the event has already been fired before this module has initialized
    // This check is to ensure that it doesn't matter what comes first.
    if (StoreManager.isInitialized() === true) {
      this._verifyStore();
    }
    else {
      core.eventBus.on('storeManagerInitialized', () => { this._verifyStore(); });
    }
  }

  _verifyStore() {
    core.store = StoreManager.getStore();
    base_core.store = StoreManager.getStore();
    let state = core.store.getState();
    console.log("Bootstate", state.user)
    // if we have an accessToken, we proceed with logging in automatically
    if (state.user.accessToken !== null) {
      // in the background we check if we're authenticated, if not we log out.
      CLOUD.setAccessToken(state.user.accessToken);
      CLOUD.forUser(state.user.userId).getUserData()
        .catch((err) => {
          if (err?.status === 401) {
            console.log("BackgroundProcessHandler: Could not verify user, attempting to login again.");
            LOGw.info("BackgroundProcessHandler: Could not verify user, attempting to login again.");
            return CLOUD.login({
              email: state.user.email,
              password: state.user.passwordHash,
              background: true
            })
            .then((response) => {
              CLOUD.setAccessToken(response.id);
              CLOUD.setUserId(response.userId);
              core.store.dispatch({type:'USER_APPEND', data:{accessToken: response.id}});
            })
          }
          else {
            throw err;
          }
        })
        .then(() => {
          console.log("BackgroundProcessHandler: Verified User.");
          CLOUD.sync(core.store, true).catch(() => {})
        })
        .catch((err) => {
          console.log("BackgroundProcessHandler: COULD NOT VERIFY USER -- ERROR", err?.message);
          if (err?.status === 401) {
            AppUtil.logOut(core.store, {title: "Access token expired.", body:"I could not renew this automatically. The app will clean up and exit now. Please log in again."});
          }
        });
      this.userLoggedInReady = true;

      migrate();

      let healthyDatabase = DataUtil.verifyDatabase(true);
      if (!healthyDatabase) {
        Alert.alert("Something went wrong...","I have identified a problem with the Sphere on your phone... I'll have to redownload it from the Cloud to fix this.", [{text:'OK', onPress: () => {
            AppUtil.resetDatabase();
          }}], {cancelable:false});
        return;
      }

      DataUtil.verifyPicturesInDatabase(state);

      core.eventBus.emit("userActivated");
      core.eventBus.emit("userLoggedIn");
      core.eventBus.emit("storePrepared");
      if (state.user.isNew === false) {
        core.eventBus.emit("userLoggedInFinished");
      }
    }
    else {
      core.eventBus.emit("storePrepared");
    }
  }

  startSingletons() {
    LogProcessor.init();
    BleLogger.init();
    CloudEventHandler.init();
    DfuStateHandler.init();
    EncryptionManager.init();
    EnergyUsageCacher.init();
    FirmwareWatcher.init();
    LocalizationCore.init();
    LocationHandler.init();
    LocalizationMonitor.init();
    MessageCenter.init();
    NotificationHandler.init();
    Permissions.init();
    PowerUsageCacher.init();
    Scheduler.init();
    SseHandler.init();
    StoneAvailabilityTracker.init();
    SpherePresenceManager.init();
    StoneManager.init();
    StoneDataSyncer.init();
    SetupStateHandler.init();
    SphereStateManager.init();
    TrackingNumberManager.init();
    TimeKeeper.init();
    UpdateCenter.init();
    UptimeMonitor.init();
    WatchStateManager.init();
  }

  startDeveloperSingletons() {
    if (DataUtil.isDeveloper()) {
      LocalizationDevDataLogger.init();
    }
  }
}



export const BackgroundProcessHandler = new BackgroundProcessHandlerClass();
