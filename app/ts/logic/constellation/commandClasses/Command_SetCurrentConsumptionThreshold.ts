import { CommandBase } from "./base/CommandBase";
import { BluenetPromiseWrapper } from "../../../native/libInterface/BluenetPromise";


export class Command_SetCurrentConsumptionThreshold extends CommandBase implements CommandBaseInterface {


  value: number;
  constructor(value: number) {
    super("setCurrentConsumptionThreshold");
    this.value = value;
  }


  async execute(connectedHandle: string, options: ExecutionOptions) : Promise<void> {
    return BluenetPromiseWrapper.setCurrentConsumptionThreshold(connectedHandle, this.value);
  }

}

