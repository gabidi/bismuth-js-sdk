import { BismuthNative, BismuthNativeConstructorParam } from "./BismuthNative";
import { BismuthSdk } from "./BismuthSdk";
import {
  ITxn,
  IDiffculty,
  IBlockNumber,
  IAddress,
  IWebNodeStatus,
  IWebNodeAddressTxn,
  IWebNodeBlockLast,
  IWebNodeGetBalance,
  IWebNodeDifficultyPayload,
  IMempoolTxnPayload
} from "./lib/typedefs";
import { queue } from "async";

export class BismuthWSSdk extends BismuthNative {
  private queue = queue(async ({ command, options, action }, cb) => {
    const timeoutId = setTimeout(
      () => cb(new Error("Response Timeout")),
      15000
    );
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
      } finally {
        clearTimeout(timeoutId);
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
  public async getMempoolTxns(): Promise<IWebNodeAddressTxn> {
    return await this.command("mpget");
  }
  public async insertMemPoolTxn(
    mempoolTxnPayload: IMempoolTxnPayload[]
  ): Promise<String> {
    return await this.command("mpinsert", [mempoolTxnPayload]);
  }
  public async getTransactions(
    txnId: ITxn,
    addresses: IAddress[] | undefined = undefined
  ): Promise<IWebNodeAddressTxn> {
    if (addresses && !Array.isArray(addresses)) addresses = [addresses];
    const payload = [txnId];
    if (addresses) payload.push(addresses);

    return await this.command("txget", payload);
  }

  public async getAddressTxnList(
    address: IAddress,
    limit = 10,
    offset = undefined
  ): Promise<IWebNodeAddressTxn[]> {
    const command = offset && offset > 0 ? "addlistlimfrom" : "addlistlim";
    const param = [address, limit];
    if (command === "addlistlimfrom") param.push(offset);
    return await this.command(command, param);
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
