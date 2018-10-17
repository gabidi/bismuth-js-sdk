import { expect } from "chai";
import { BismuthNative } from "../BismuthNative";
import { BismuthSdk } from "../BismuthSdk";
import { BismuthWSSdk } from "../BismuthWSSdk";
import WebSocket = require("ws");
const cfg = {
  server: "127.0.0.1",
  port: 5658,
  verbose: false
};

let bis: BismuthNative;

xdescribe("BismuthNative Class Test", () => {
  before(() => {
    bis = new BismuthNative(cfg);
  });

  it("Establish a connection with local node", async () => {
    let socket = await bis.getConnection();
    expect(socket).to.be.an("Object");
    // Should be connected at this point
    expect(socket.connecting).to.be.false;
    return socket;
  });

  it("Can issue a command on socket and wallet version is ok", async () => {
    let result = await bis.command("statusjson");
    expect(result).to.be.haveOwnProperty("blocks");
    expect(
      parseInt(result.walletversion.split(".").join(""))
    ).to.be.greaterThan(4237);
    return result;
  });
});

let sdk: BismuthSdk;

xdescribe("Bismuth SDK test : ", () => {
  before(() => {
    sdk = new BismuthSdk(cfg);
  });

  /**
   * Intentionally pause 200ms between each test so not to
   * flood node
   */
  beforeEach(done => {
    setTimeout(done, 100);
  });

  it("Can Get node status", async () => {
    let result = await sdk.getStatus();
    expect(result).to.be.haveOwnProperty("blocks");
    return result;
  });

  it("Can Get a block's  details", async () => {
    let result = await sdk.getBlock([558742]);
    expect(result).to.be.an("Array");
    result.forEach(result => expect(result).to.have.length(12));
    return result;
  });

  it("Can Get last difficulty", async () => {
    let result = await sdk.getLastDifficulty();
    expect(result).to.be.an("Array");
    let [blockNumber, difficulty] = result;
    expect(blockNumber).to.be.a("Number");
    expect(difficulty).to.be.a("String");
    return result;
  });

  it("Can Get a Transaction JSON details", async () => {
    let result = await sdk.getTxnDetails([
      "K1iuKwkOac4HSuzEBDxmqb5dOmfXEK98BaWQFHltdrbDd0C5iIEbh/Fj",
      true
    ]);
    expect(result).to.be.an("Object");
    expect(result).to.haveOwnProperty("txid");
    return result;
  }).timeout(5000);

  it("Can Get an list of addreses balances", async () => {
    let addressList = [
      "d2f59465568c120a9203f9bd6ba2169b21478f4e7cb713f61eaa1ea0",
      "340c195f768be515488a6efedb958e135150b2ef3e53573a7017ac7d"
    ];
    let result = await sdk.getAddressListBalance([addressList, 0, true]);
    expect(result).to.be.an("Object");
    expect(result).to.have.all.keys(...addressList);
    return result;

    // this is slow
  }).timeout(5000);

  it("Can generate new keys", async () => {
    let result = await sdk.getNewKeys();
    expect(result).to.be.an("Array");

    let [privateKey, publicKey, address] = result;
    expect(privateKey).to.include("PRIVATE");
    expect(publicKey).to.include("PUBLIC");
    expect(address).to.have.length(56);

    return result;
  }).timeout(5000);
});

let wsSdk: BismuthWSSdk;

describe("Bismuth WS SDK test", () => {
  before(() => {
    wsSdk = new BismuthWSSdk({
      socket: new Promise((res, rej) => {
        const socket = new WebSocket("http://127.0.0.1:8155/web-socket/");
        socket.on("open", () => {
          console.log("WSocket is ready!");
          res(socket);
        });
        socket.on("error", err => rej(err));
      })
    });
  });

  xit("Can Get node status using a websocket connection", async () => {
    let result = await (await wsSdk).getStatus();
    expect(result).to.be.haveOwnProperty("blocks");
    return result;
  }).timeout(10000);
  xit("Can Get a block's  details", async () => {
    let result = await (await wsSdk).getBlock([558742]);
    expect(result).to.be.an("Array");
    result.forEach(result => expect(result).to.have.length(12));
    return result;
  });
  it("Can Get an list of addreses balances", async () => {
    let addressList = [
      "d2f59465568c120a9203f9bd6ba2169b21478f4e7cb713f61eaa1ea0",
      "340c195f768be515488a6efedb958e135150b2ef3e53573a7017ac7d"
    ];
    let result = await (await wsSdk).getAddressListBalance([
      addressList,
      0,
      true
    ]);
    expect(result).to.be.an("Object");
    expect(result).to.have.all.keys(...addressList);
    return result;

    // this is slow
  }).timeout(5000);
});
