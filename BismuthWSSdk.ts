import { BismuthNative, BismuthNativeConstructorParam } from "./BismuthNative";
import { BismuthSdk } from "./BismuthSdk";
import {
  IDiffculty,
  IBlockNumber,
  IAddress,
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
      socket.once("message", (response: Buffer) => {
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
      socket.once("error", (err: Error) => rej(err));
      socket.send(JSON.stringify([command, ...options]));
    });
  }
  public async getStatus(): Promise<IWebNodeStatus> {
    return await this.command("statusget");
  }

  public async getBlock(): Promise<IWebNodeBlockLast> {
    return await this.command("blocklast");
  }

  public async getLastDifficulty(): Promise<[IBlockNumber, IDiffculty]> {
    return await this.command("difflast");
  }

  public async getAddressTxnList(
    address: IAddress,
    limit = 10
  ): Promise<IWebNodeGetAddressTxn[]> {
    return await this.command("addlistlim", [address, limit]);
  }
  public async getAddressBalance(
    address: IAddress
  ): Promise<IWebNodeGetBalance> {
    return await this.command("balanceget", [address]);
  }
}
