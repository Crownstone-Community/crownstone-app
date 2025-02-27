
type transferToCloudData = {
  localId?: string,
  localData?: any,
  localSphereId: string,
  cloudSphereId: string,
  cloudId: string,
  extraFields? : any,
}

type transferNewToCloudData = {
  localId?: string,
  localData?: any,
  localSphereId: string,
  cloudSphereId: string,
  extraFields? : any,
}


type transferToLocalData = {
  localId: string,
  localSphereId: string,
  cloudId?: string,
  cloudData: any,
  extraFields? : any,
}


type transferToLocalStoneData = {
  localId: string,
  localSphereId: string,
  localStoneId: string,
  cloudData: any,
}


type transferToLocalPreferenceData = {
  localId: string,
  cloudData: any,
}


type transferNewToCloudStoneData = {
  localId: string,
  localData: any,
  localSphereId: string,
  localStoneId: string,
  cloudStoneId: string,
  cloudSphereId: string,
}


type transferToCloudStoneData = {
  localId: string,
  localData: any,
  cloudStoneId: string,
  cloudSphereId: string,
  cloudId: string
}


type transferNewToCloudPreferenceData = {
  localId: string,
  localData: any,
  cloudDeviceId: string,
}


type fieldMap = {
  local: string,
  cloud: string,
  cloudToLocalOnly? : boolean,
  localToCloudOnly? : boolean,
  onlyIfValue?: boolean
}[]


interface keyMap {
  [key: string]: string
}


interface syncIdMap {
  users:             keyMap,
  locations:         keyMap,
  abilities:         keyMap,
  abilityProperties: keyMap,
  behaviours:        keyMap,
  stones:            keyMap,
  fingerprints:      keyMap,
  scenes:            keyMap,
  messages:          keyMap,
  spheres:           keyMap,
  schedules:         keyMap,
  devices:           keyMap,
  hubs:              keyMap,
  preferences:       keyMap,
}


interface sphereIdMap {
  [key: string]: syncIdMap
}
