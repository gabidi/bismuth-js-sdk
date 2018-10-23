import { BismuthNative, BismuthNativeConstructorParam } from "./BismuthNative";
import { BismuthSdk } from "./BismuthSdk";
import {
  IDiffculty,
  IBlockNumber,
  IAddress,
  IWebNodeStatus,
  IWebNodeGetAddressTxn,
  IWebNodeBlockLast,
  IWebNodeGetBalance,
  IWebNodeDifficultyPayload
} from "./lib/typedefs";
import { queue } from "async";

export class BismuthWSSdk extends BismuthNative {
  private queue = queue(async ({ command, options, action }, cb) => {
    const socket = await this.socket;
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
        action(JSON.parse(responseString));
	      cb();
      } catch (err) {
        cb(err);
      }
    });
    socket.send(JSON.stringify([command, ...options]));
  }, 1);

  constructor(cfg: BismuthNativeConstructorParam) {
    super(cfg);
  }
  public async command(command: string, options: any[] = []): Promise<any> {
    return new Promise((res, rej) => {
      this.queue.push({ command, options, action: res }, err => {
        if (err) rej(err);
      });
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
    limit = 10,
    offset = 0
  ): Promise<IWebNodeGetAddressTxn[]> {
    return await this.command("addlistlim", [address, limit, offset]);
  }
  public async getAddressFromAlias(alias: string): Promise<IAddress> {
    return await this.command("addfromalias", [alias]);
  }
  public async getAddressAlias(address: IAddress[]): Promise<IAddress> {
    return await this.command("aliasesget", [
      Array.isArray(address) ? address : [address]
    ]);
  }
  public async getAliasAvalibility(
    alias: string
  ): Promise<"Alais free" | "Alias registered"> {
    return await this.command("aliascheck", [alias]);
  }
  public async getAddressBalance(
    address: IAddress
  ): Promise<IWebNodeGetBalance> {
    return await this.command("balanceget", [address]);
  }
}
