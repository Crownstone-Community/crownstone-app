// GENERATED FILE (REMOVE IF FILE IS CHANGED)

import { CommandBase } from "./base/CommandBase";
import { BluenetPromiseWrapper } from "../../../native/libInterface/BluenetPromise";


export class Command_GetCurrentConsumptionThreshold extends CommandBase implements CommandBaseInterface {

  constructor() {
    super("getCurrentConsumptionThreshold");
  }


  async execute(connectedHandle: string, options: ExecutionOptions) : Promise<number> {
    return BluenetPromiseWrapper.getCurrentConsumptionThreshold(connectedHandle);
  }

}

