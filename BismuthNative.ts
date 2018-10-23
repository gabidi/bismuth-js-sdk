import { isBoolean } from "util";
interface Socket {
  on: Function;
  write: Function;
  send: Function;
  once: Function;
}
export interface BismuthNativeConstructorParam {
  server?: string; //'127.0.0.1'
  port?: number; // 5658,
  verbose?: boolean; // false
  socket?: Promise<Socket>;
}

export class BismuthNative {
  protected verbose: boolean;
  protected socket: Promise<Socket>;

  public constructor(opts: BismuthNativeConstructorParam) {
    const { verbose, server, port, socket } = opts;
    this.verbose = verbose;

    if (verbose)
      console.log(Date.now(), "BismuthNativeInit", {
        server,
        port,
        verbose
      });

    // Generate promise that resolves when connection est.
    this.socket = socket;
  }

  public async getConnection(): Promise<Socket> {
    if (this.verbose) console.log("Get connection is waiting on socket..");
    return await this.socket;
  }

  private _prepareRpcPayload(data) {
    // Only json encode stuff that is not a number or boolean to have correct headers
    let dataToSend =
      !isNaN(data) || isBoolean(data) ? data.toString() : JSON.stringify(data);
    return `${dataToSend.length.toString().padStart(10, "0")}${dataToSend}`;
  }

  public async command(command: string, options?: any[]): Promise<any> {
    let socket = await this.getConnection();
    return new Promise((resolve, reject) => {
      let payload = this._prepareRpcPayload(command);
      if (this.verbose) console.log("Sending Payload", payload);

      socket.write(payload);

      if (options && options.length)
        options.forEach(option => {
          let optionPayload = this._prepareRpcPayload(option);
          if (this.verbose) console.log("Sending Option", optionPayload);
          socket.write(optionPayload);
        });

      socket.on("data", (response: Buffer) => {
        if (this.verbose)
          console.log("Recieved data from host", response.toString("utf8"));
        try {
          return resolve(JSON.parse(response.toString("utf8").substr(10)));
        } catch (err) {
          reject({ err, response });
        }
      });
    });
  }
}
