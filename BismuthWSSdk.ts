import { BismuthNative, BismuthNativeConstructorParam } from "./BismuthNative";
import { BismuthSdk } from "./BismuthSdk";
export class BismuthWSSdk extends BismuthSdk {
  constructor(cfg: BismuthNativeConstructorParam) {
    super(cfg);
  }
  public async command(command: string, options: any[] = []): Promise<any> {
    const socket = await this.socket;
    return new Promise((res, rej) => {
      socket.once("message", response => {
        if (this.verbose)
          console.log("Recieved data from host", response.toString("utf8"));
        try {
          return res(JSON.parse(response.toString("utf8").substr(10)));
        } catch (err) {
          rej(err);
        }
      });
      socket.once("error", err => rej(err));
      socket.send(JSON.stringify([command, ...options]));
    });
  }
}
