import { BismuthNative, BismuthNativeConstructorParam } from "./BismuthNative";
import { BismuthSdk } from "./BismuthSdk";
import {
  Diffculty,
  BlockNumber,
  Address,
  IWebNodeStatus,
  IWebNodeGetAddressTxn,
  IWebNodeBlockLast,
  IWebNodeGetBalance
} from "./lib/typedefs";

export class BismuthWSSdk extends BismuthNative {
  constructor(cfg: BismuthNativeConstructorParam) {
    super(cfg);
  }
  public async command(command: string, options: any[] = []): Promise<any> {
    const socket = await this.socket;
    return new Promise((res, rej) => {
      socket.once("message", response => {
        if (this.verbose)
          console.log(
            "Command",
            command,
            "Recieved data from host",
            response.toString("utf8")
          );
        const responseString = response.toString("utf8");
        try {
          return res(JSON.parse(responseString));
        } catch (err) {
          rej({ err, responseString });
        }
      });
      socket.once("error", err => rej(err));
      socket.send(JSON.stringify([command, ...options]));
    });
  }
  public async getStatus(): Promise<IWebNodeStatus> {
    return await this.command("statusget");
  }

  public async getBlock(): Promise<IWebNodeBlockLast> {
    return await this.command("blocklast");
  }

  public async getLastDifficulty(): Promise<[BlockNumber, Diffculty]> {
    return await this.command("difflast");
  }

  public async getAddressTxnList(
    address: Address,
    limit = 10
  ): Promise<IWebNodeGetAddressTxn[]> {
    return await this.command("addlistlim", [address, limit]);
  }
  public async getAddressBalance(
    address: Address
  ): Promise<IWebNodeGetBalance> {
    return await this.command("balanceget", [address]);
  }
}
