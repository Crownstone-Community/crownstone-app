import { core } from "../Core";

export const Get = {

  activeSphere() : SphereData | null {
    let state = core.store.getState();
    let activeSphereId = Get.activeSphereId();
    if (activeSphereId) {
      return state.spheres[activeSphereId] || null;
    }
    return null;
  },

  activeSphereId() : sphereId {
    let state = core.store.getState();
    let activeSphereId = state?.app?.activeSphere || null;
    if (activeSphereId) { return activeSphereId || null; }
    else {
      let sphereIds = Object.keys(state.spheres);
      if (sphereIds.length > 0) {
        return sphereIds[0];
      }
    }
    return null;
  },

  sphere(sphereId: string) : SphereData | null {
    let state = core.store.getState();
    return state?.spheres?.[sphereId] || null;
  },

  sphereId(stoneId: string) : string | null {
    let state = core.store.getState();
    let sphereIds = Object.keys(state.spheres);
    for (let sphereId of sphereIds) {
      if (state.spheres[sphereId].stones[stoneId] !== undefined) {
        return sphereId;
      }
    }
    return null;
  },

  sphereUser(sphereId: string, userId: string) : SphereUserData | null {
    let sphere = Get.sphere(sphereId);
    return sphere?.users?.[userId] || null;
  },

  hub(sphereId: string, hubId: string) : HubData | null {
    let sphere = Get.sphere(sphereId);
    return sphere?.hubs?.[hubId] || null;
  },

  stone(sphereId: string, stoneId: string) : StoneData | null {
    let sphere = Get.sphere(sphereId);
    return sphere?.stones?.[stoneId] || null;
  },

  behaviour(sphereId: string, stoneId: string, behaviourId: string) : BehaviourData | null {
    let stone = Get.stone(sphereId, stoneId);
    return stone?.behaviours?.[behaviourId] || null;
  },

  ability(sphereId: string, stoneId: string, abilityId: string) : AbilityData | null {
    let stone = Get.stone(sphereId, stoneId);
    return stone?.abilities?.[abilityId] || null;
  },

  abilityProperty(sphereId: string, stoneId: string, abilityId: string, propertyId: string) : AbilityPropertyData | null {
    let ability = Get.ability(sphereId, stoneId, abilityId);
    return ability?.properties?.[propertyId] || null;
  },

  location(sphereId: string, locationId: string) : LocationData | null {
    let sphere = Get.sphere(sphereId);
    return sphere?.locations?.[locationId] || null;
  },

  scene(sphereId: string, sceneId: string) : SceneData | null {
    let sphere = Get.sphere(sphereId);
    return sphere?.scenes?.[sceneId] || null;
  },

  fingerprint(sphereId: string, locationId: string, fingerprintId) : FingerprintData | null {
    let location = Get.location(sphereId,locationId);
    if (!location) { return null; }

    return location.fingerprints?.raw[fingerprintId] || null;
  },

  processedFingerprint(sphereId: string, locationId: string, fingerprintId) : FingerprintProcessedData | null {
    let location = Get.location(sphereId,locationId);
    if (!location) { return null; }

    return location.fingerprints?.processed[fingerprintId] || null;
  },

  processedFingerprintFromRawId(sphereId: string, locationId: string, fingerprintId) : FingerprintProcessedData | null {
    let location = Get.location(sphereId,locationId);
    if (!location) { return null; }

    for (let processedFingerprint of Object.values(location.fingerprints.processed)) {
      if (processedFingerprint.fingerprintId === fingerprintId) {
        return processedFingerprint;
      }
    }

    return null;
  },

  user() : UserData {
    return core.store.getState().user;
  },

  userId() : string {
    return Get.user().userId;
  },

  message(sphereId, messageId) : MessageData | null {
    let sphere = Get.sphere(sphereId);
    if (!sphere) { return null; }
    return sphere.messages[messageId] || null;
  },


  energyCollectionPermission(sphereId: sphereId) : boolean {
    let sphere = Get.sphere(sphereId);
    if (!sphere) { return false; }
    return sphere?.features?.ENERGY_COLLECTION_PERMISSION?.enabled ?? false;
  }
}
