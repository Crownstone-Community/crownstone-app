import {xUtil} from "../../util/StandAloneUtil";
import {core} from "../../Core";
import {BleCommandManager} from "./BleCommandManager";
import {
  Command_AddBehaviour,
  Command_AllowDimming,
  Command_ClearErrors,
  Command_CommandFactoryReset,
  Command_FactoryResetHub,
  Command_FactoryResetHubOnly,
  Command_GetAdcChannelSwaps,
  Command_GetAdcRestarts,
  Command_GetBehaviour,
  Command_GetBehaviourDebugInformation,
  Command_GetBootloaderVersion,
  Command_GetCrownstoneUptime, Command_GetCurrentConsumptionThreshold,
  Command_GetCurrentMultiplier,
  Command_GetCurrentZero,
  Command_GetDimmerCurrentThreshold,
  Command_GetDimmerTempDownThreshold,
  Command_GetDimmerTempUpThreshold,
  Command_GetFirmwareVersion,
  Command_GetGPREGRET,
  Command_GetHardwareVersion,
  Command_GetLastResetReason,
  Command_GetMACAddress,
  Command_GetMaxChipTemp,
  Command_GetMinSchedulerFreeSpace,
  Command_GetPowerSamples,
  Command_GetPowerZero,
  Command_GetResetCounter,
  Command_GetSoftOnSpeed,
  Command_GetSwitchcraftThreshold,
  Command_GetSwitchHistory,
  Command_GetSwitchState,
  Command_GetTapToToggleThresholdOffset,
  Command_GetTime,
  Command_GetVoltageMultiplier,
  Command_GetVoltageZero,
  Command_LockSwitch,
  Command_MultiSwitch,
  Command_PerformDFU,
  Command_PutInDFU,
  Command_RegisterTrackedDevice,
  Command_RemoveBehaviour,
  Command_RequestCloudId,
  Command_RestartCrownstone,
  Command_SendMeshNoOp,
  Command_SendNoOp, Command_SetCurrentConsumptionThreshold,
  Command_SetCurrentMultiplier,
  Command_SetCurrentZero,
  Command_SetDimmerCurrentThreshold,
  Command_SetDimmerTempDownThreshold,
  Command_SetDimmerTempUpThreshold,
  Command_SetMaxChipTemp,
  Command_SetPowerZero,
  Command_SetSoftOnSpeed,
  Command_SetSunTimesViaConnection,
  Command_SetSwitchCraft,
  Command_SetSwitchcraftThreshold,
  Command_SetSwitchState,
  Command_SetTapToToggle,
  Command_SetTapToToggleThresholdOffset,
  Command_SetTime,
  Command_SetUartKey,
  Command_SetUartState,
  Command_SetupCrownstone,
  Command_SetupPulse,
  Command_SetupPutInDFU,
  Command_SetVoltageMultiplier,
  Command_SetVoltageZero,
  Command_SwitchDimmer,
  Command_SwitchRelay,
  Command_SyncBehaviours,
  Command_Toggle,
  Command_TrackedDeviceHeartbeat,
  Command_TransferHubTokenAndCloudId,
  Command_TurnOn,
  Command_UpdateBehaviour
} from "./commandClasses";
import {SessionBroker} from "./SessionBroker";
import {LOGd, LOGe, LOGi} from "../../logging/Log";
import {Command_SetTimeViaBroadcast} from "./commandClasses/Command_SetTimeViaBroadcast";
import {Command_GetUICR} from "./commandClasses/Command_GetUICR";
import {BluenetPromiseWrapper} from "../../native/libInterface/BluenetPromise";
import {Command_setDoubleTapSwitchcraft} from "./commandClasses/Command_setDoubleTapSwitchcraft";
import {Command_setDefaultDimValue} from "./commandClasses/Command_setDefaultDimValue";

/**
 * The CommandAPI basically wraps all commands that you can send to a Crownstone. It contains a Collector (see below)
 * to provide connections. This is the class that you'll interact with most of all. You can perform multiple
 * commands on the CommandAPI, which are all asynchronous. The command API can choose to send commands via broadcast
 * if possible using the BroadcastCommandManager.
 *
 * The id identifies this command API. It is used to notify open slots belonging to this command API that a new command is available.
 * The privateId is used to ensure that a slot that is requested for this commandAPI will only process commands coming from this api.
 * This is used for setup and other processed which require to have full command over the connection.
 *
 * If the privateId is missing, the connection can be used for state updates like localization, which do not really care which Crownstones
 * get the command.
 */
class CommandAPI_base {
  id : string | null;
  options : commandOptions;

  broker : SessionBroker;

  _ended = false;

  constructor(commandOptions: commandOptions) {
    this.options = commandOptions;
    this.options.commanderId ??= xUtil.getUUID();
    this.id = this.options.commanderId;

    LOGi.constellation("Commander: Created for target", this.options.commandTargets, "options:", JSON.stringify(this.options));
    this.broker = new SessionBroker(this.options);
  }

  isConnected() : boolean {
    if (this.options.commandTargets.length !== 1) {
      LOGe.constellation("Commander: Cannot use isConnected when there are multiple targets.");
      return false;
    }
    let targetHandle = this.options.commandTargets[0];

    return this.broker.isConnectedTo(targetHandle)
  }

  /**
   * If via mesh is enabled, we will trigger a mesh connection request additionally to the direct one.
   * @param command
   * @param viaMesh
   */
  async _load(command : CommandInterface, allowMeshRelays: boolean = false) : Promise<any> {
    try {
      if (this._ended) {
        throw new Error("COMMANDER_HAS_ENDED");
      }

      LOGi.constellation("Commander: Loading command", command.type, allowMeshRelays,"id:", this.id);
      // this check is here so that we pass any errors down the promise chain, not immediately at the teller (which is not caught in a .catch)
      let validHandleToPerformAction = false;
      for (let target of this.options.commandTargets) {
        if (target) {
          validHandleToPerformAction = true;
        }
      }

      if (!validHandleToPerformAction) {
        throw new Error("INVALID_HANDLE");
      }

      let promiseContainer = xUtil.getPromiseContainer<any>()
      LOGd.constellation("Commander: Generating command for", command.type, allowMeshRelays,"id:", this.id);
      let commands = BleCommandManager.generateAndLoad(this.options, command, allowMeshRelays, promiseContainer);
      // in case this command is broadcast instead of done via
      if (commands) {
        this.broker.loadPendingCommands(commands);
        core.eventBus.emit(`CommandLoaded_${this.id}`)
      }
      return promiseContainer.promise;
    }
    catch (err : any) {
      LOGe.constellation("Commander: Failed to load command", err?.message || 'unknown_error', "id:", this.id);
      throw err;
    }
  }
}

export class CommandBroadcastAPI extends CommandAPI_base {

  async setTimeViaBroadcast(
    time: number,
    sunriseTime: number,
    sunsetTime: number,
    enableTimeBasedNonce: boolean
  ) : Promise< void > {
    // timestamp in seconds since epoch
    return this._load(new Command_SetTimeViaBroadcast(time, sunriseTime, sunsetTime, enableTimeBasedNonce));
  }

}




class CommandMeshAPI extends CommandBroadcastAPI {

  async setSunTimesViaConnection(
    sunriseSecondsSinceMidnight : number,
    sunsetSecondsSinceMidnight : number) : Promise< void > {
    return this._load(new Command_SetSunTimesViaConnection(sunriseSecondsSinceMidnight, sunsetSecondsSinceMidnight));
  }


  async registerTrackedDevice(
    trackingNumber:number,
    locationUID:() => number | number,
    profileId:number,
    rssiOffset:number,
    ignoreForPresence:boolean,
    tapToToggleEnabled:boolean,
    deviceToken:number,
    ttlMinutes:number
  ) : Promise< void > {
    return this._load(new Command_RegisterTrackedDevice(trackingNumber, locationUID, profileId, rssiOffset, ignoreForPresence, tapToToggleEnabled, deviceToken, ttlMinutes));
  }


  /**
   * This command can recover from certain errors by registering instead. This is why it requires the same arguments as the register command.
   * @param trackingNumber
   * @param locationUID
   * @param deviceToken
   * @param ttlMinutes
   * @param registerPayload
   */
  async trackedDeviceHeartbeat(
    trackingNumber:number,
    locationUID:() => number | number,
    deviceToken:number,
    ttlMinutes:number,
    registerPayload: RegisterPayload
    ) : Promise< void > {
    return this._load(new Command_TrackedDeviceHeartbeat(trackingNumber, locationUID, deviceToken, ttlMinutes, registerPayload));
  }


  async setTime(time?: number) : Promise< void > {
    // timestamp in seconds since epoch
    return this._load(new Command_SetTime(time));
  }
}

/**
 * this commander is used for the direct commands.
 * You can also send meshcommands to the Crownstone directly, thats why it inherits the meshAPI
 */
export class CommandAPI extends CommandMeshAPI {

  async toggle(stateForOn : number) : Promise<void> {
    return this._load(new Command_Toggle());
  }

  async multiSwitch(state : number, allowMeshRelay = true) : Promise<void>  {
    return this._load(new Command_MultiSwitch(state), allowMeshRelay);
  }

  async turnOn(allowMeshRelay = true) : Promise<void>  {
    return this._load(new Command_TurnOn(), allowMeshRelay);
  }

  async turnOff(allowMeshRelay = true) : Promise<void>  {
    return this.multiSwitch(0, allowMeshRelay);
  }

  async getBootloaderVersion() : Promise<string> {
    return this._load(new Command_GetBootloaderVersion());
  }

  async getFirmwareVersion() : Promise<string> {
    return this._load(new Command_GetFirmwareVersion());
  }

  async getHardwareVersion() : Promise<string> {
    return this._load(new Command_GetHardwareVersion());
  }

  async getUICR() : Promise<UICRData> {
    return this._load(new Command_GetUICR());
  }

  async addBehaviour(behaviour: behaviourTransfer) : Promise<behaviourReply> {
    return this._load(new Command_AddBehaviour(behaviour));
  }

  async updateBehaviour(behaviour: behaviourTransfer) : Promise<behaviourReply> {
    return this._load(new Command_UpdateBehaviour(behaviour));
  }

  async removeBehaviour(index: number) : Promise<behaviourReply> {
    return this._load(new Command_RemoveBehaviour(index));
  }

  async getBehaviour(index: number) : Promise<behaviourTransfer> {
    return this._load(new Command_GetBehaviour(index));
  }

  async syncBehaviours(behaviours: behaviourTransfer[]) : Promise<behaviourTransfer[]> {
    return this._load(new Command_SyncBehaviours(behaviours));
  }

  async commandFactoryReset() : Promise<void> {
    return this._load(new Command_CommandFactoryReset());
  }

  async sendNoOp() : Promise<void> {
    return this._load(new Command_SendNoOp());
  }

  async sendMeshNoOp() : Promise<void> {
    return this._load(new Command_SendMeshNoOp());
  }

  // async connect() : Promise< CrownstoneMode > {
  //   // TODO: implement
  // }

  // async cancelConnectionRequest() : Promise< void > {
  //   // TODO: implement
  // }
  //
  // async disconnectCommand() : Promise< void > {
  //   // TODO: implement
  // }

  async getMACAddress() : Promise< string > {
    return this._load(new Command_GetMACAddress());
  }

  // async phoneDisconnect() : Promise< void > {
  //   // TODO: implement
  // }

  async setupCrownstone(dataObject: setupData) : Promise< void > {
    return this._load(new Command_SetupCrownstone(dataObject));
  }
  async recover() : Promise< void > {
    // Since recover does it's own connect, we do not need to use sessions for this.
    return BluenetPromiseWrapper.recover(this.options.commandTargets[0]);
  }
  async putInDFU() : Promise< void > {
    return this._load(new Command_PutInDFU());
  }
  async setupPutInDFU() : Promise< void > {
    return this._load(new Command_SetupPutInDFU());
  }
  async performDFU(uri: string) : Promise< void > {
    return this._load(new Command_PerformDFU(uri));
  }
  async bootloaderToNormalMode() : Promise< void > {
    // Since bootloaderToNormalMode does it's own connect, we do not need to use sessions for this.
    return BluenetPromiseWrapper.bootloaderToNormalMode(this.options.commandTargets[0]);
  }
  async clearErrors(clearErrorJSON : clearErrorData) : Promise< void > {
    return this._load(new Command_ClearErrors(clearErrorJSON));
  }
  async restartCrownstone() : Promise< void > {
    return this._load(new Command_RestartCrownstone());
  }
  async getTime() : Promise< number > {
    return this._load(new Command_GetTime());
  }
  async getSwitchState() : Promise< number > {
    return this._load(new Command_GetSwitchState());
  }
  async lockSwitch(lock : boolean) : Promise< void > {
    return this._load(new Command_LockSwitch(lock));
  }
  async allowDimming(allow: boolean) : Promise< void > {
    return this._load(new Command_AllowDimming(allow));
  }
  async setSwitchCraft(state: boolean) : Promise< void > {
    return this._load(new Command_SetSwitchCraft(state));
  }
  async setupPulse() : Promise< void > {
    return this._load(new Command_SetupPulse());
  }
  async setTapToToggle(enabled: boolean) : Promise<void> {
    return this._load(new Command_SetTapToToggle(enabled));
  }
  async setTapToToggleThresholdOffset(rssiThresholdOffset: number) : Promise<void> {
    return this._load(new Command_SetTapToToggleThresholdOffset(rssiThresholdOffset));
  }
  async getTapToToggleThresholdOffset() : Promise< number > {
    return this._load(new Command_GetTapToToggleThresholdOffset());
  }
  async setSoftOnSpeed(speed: number) : Promise< void > {
    return this._load(new Command_SetSoftOnSpeed(speed));
  }
  async getSoftOnSpeed() : Promise< number > {
    return this._load(new Command_GetSoftOnSpeed());
  }
  async setSwitchState(state: number) : Promise< void > {
    return this._load(new Command_SetSwitchState(state));
  }
  async switchRelay(state: number) : Promise< void > {
    return this._load(new Command_SwitchRelay(state));
  }
  async switchDimmer(state: number) : Promise< void > {
    return this._load(new Command_SwitchDimmer(state));
  }
  async getResetCounter() : Promise< number > {
    return this._load(new Command_GetResetCounter());
  }
  async getSwitchcraftThreshold() : Promise< number > {
    return this._load(new Command_GetSwitchcraftThreshold());
  }
  async setSwitchcraftThreshold(value: number) : Promise< void > {
    return this._load(new Command_SetSwitchcraftThreshold(value));
  }
  async getMaxChipTemp() : Promise< number > {
    return this._load(new Command_GetMaxChipTemp());
  }
  async setMaxChipTemp(value: number) : Promise< void > {
    return this._load(new Command_SetMaxChipTemp(value));
  }
  async getDimmerCurrentThreshold() : Promise< number > {
    return this._load(new Command_GetDimmerCurrentThreshold());
  }
  async setDimmerCurrentThreshold(value: number) : Promise< void > {
    return this._load(new Command_SetDimmerCurrentThreshold(value));
  }
  async getDimmerTempUpThreshold() : Promise< number > {
    return this._load(new Command_GetDimmerTempUpThreshold());
  }
  async setDimmerTempUpThreshold(value: number) : Promise< void > {
    return this._load(new Command_SetDimmerTempUpThreshold(value));
  }
  async getDimmerTempDownThreshold() : Promise< number > {
    return this._load(new Command_GetDimmerTempDownThreshold());
  }
  async setDimmerTempDownThreshold(value: number) : Promise< void > {
    return this._load(new Command_SetDimmerTempDownThreshold(value));
  }
  async getVoltageZero() : Promise< number > {
    return this._load(new Command_GetVoltageZero());
  }
  async setVoltageZero(value: number) : Promise< void > {
    return this._load(new Command_SetVoltageZero(value));
  }
  async getCurrentZero() : Promise< number > {
    return this._load(new Command_GetCurrentZero());
  }
  async setCurrentZero(value: number) : Promise< void > {
    return this._load(new Command_SetCurrentZero(value));
  }
  async getCurrentConsumptionThreshold() : Promise< number > {
    return this._load(new Command_GetCurrentConsumptionThreshold());
  }
  async setCurrentConsumptionThreshold(value: number) : Promise< void > {
    return this._load(new Command_SetCurrentConsumptionThreshold(value));
  }
  async getPowerZero() : Promise< number > {
    return this._load(new Command_GetPowerZero());
  }
  async setPowerZero(value: number) : Promise< void > {
    return this._load(new Command_SetPowerZero(value));
  }
  async getVoltageMultiplier() : Promise< number > {
    return this._load(new Command_GetVoltageMultiplier());
  }
  async setVoltageMultiplier(value: number) : Promise< void > {
    return this._load(new Command_SetVoltageMultiplier(value));
  }
  async getCurrentMultiplier() : Promise< number > {
    return this._load(new Command_GetCurrentMultiplier());
  }
  async setCurrentMultiplier(value: number) : Promise< void > {
    return this._load(new Command_SetCurrentMultiplier(value));
  }
  async setUartState(value: 0 | 1 | 3) : Promise< number > {
    return this._load(new Command_SetUartState(value));
  }
  async getBehaviourDebugInformation() : Promise< behaviourDebug > {
    return this._load(new Command_GetBehaviourDebugInformation());
  }

  async getCrownstoneUptime() : Promise<number> {
    return this._load(new Command_GetCrownstoneUptime());
  }
  async getMinSchedulerFreeSpace() : Promise<number> {
    return this._load(new Command_GetMinSchedulerFreeSpace());
  }
  async getLastResetReason() : Promise<ResetReason> {
    return this._load(new Command_GetLastResetReason());
  }
  async getGPREGRET() : Promise<GPREGRET[]> {
    return this._load(new Command_GetGPREGRET());
  }
  async getAdcChannelSwaps() : Promise<AdcSwapCount> {
    return this._load(new Command_GetAdcChannelSwaps());
  }
  async getAdcRestarts() : Promise<AdcRestart> {
    return this._load(new Command_GetAdcRestarts());
  }
  async getSwitchHistory() : Promise<SwitchHistory[]> {
    return this._load(new Command_GetSwitchHistory());
  }
  async getPowerSamples(type : PowersampleDataType) : Promise<PowerSamples[]> {
    return this._load(new Command_GetPowerSamples(type));
  }
  async setUartKey(uartKey: string) : Promise<void> {
    return this._load(new Command_SetUartKey(uartKey));
  }

  // all methods that use the hubData pathway, can be rejected with error "HUB_REPLY_TIMEOUT" if the response in not quick enough.
  async transferHubTokenAndCloudId(hubToken: string, cloudId: string) : Promise<HubDataReply> {
    return this._load(new Command_TransferHubTokenAndCloudId(hubToken, cloudId));
  }
  async requestCloudId() : Promise<HubDataReply> {
    return this._load(new Command_RequestCloudId());
  }
  async factoryResetHub() : Promise<HubDataReply> {
    return this._load(new Command_FactoryResetHub());
  }
  async factoryResetHubOnly() : Promise<HubDataReply> {
    return this._load(new Command_FactoryResetHubOnly());
  }
  async setDoubleTapSwitchCraft(enabled: boolean) : Promise<void> {
    return this._load(new Command_setDoubleTapSwitchcraft(enabled));
  }
  async setDefaultDimValue(dimValue: number) : Promise<void> {
    return this._load(new Command_setDefaultDimValue(dimValue));
  }

  async disconnect() {
    await this.broker.disconnectSession();
  }

  async end() {
    this._ended = true;
    BleCommandManager.cancelCommanderCommands(this.id);
    await this.broker.killConnectedSessions();
  }
}
