import { expect } from "chai";
import { BismuthNative } from "../BismuthNative";
import { BismuthSdk } from "../BismuthSdk";
import { BismuthWSSdk } from "../BismuthWSSdk";
import WebSocket = require("ws");
const cfg = {
  server: "194.19.235.82",
  port: 5658,
  verbose: false
};

let wsSdk: BismuthWSSdk;
const txnId = "b6mU08uxV2Zx3zlO6eSfxa+HmNB/W3bb+cSUXUybWFDFPSo3siGLZlTM";
const txnIdAddress = [
  "d2f59465568c120a9203f9bd6ba2169b21478f4e7cb713f61eaa1ea0"
];
describe("Bismuth WS SDK test", () => {
  before(() => {
    wsSdk = new BismuthWSSdk({
      verbose: false,
      socket: new Promise((res, rej) => {
        const socket = new WebSocket("http://127.0.0.2:8155/web-socket/");
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
    expect(result).to.be.an("Array");
    return result;
  }).timeout(10000);

  xit("Can Get a block's  details", async () => {
    let result = await (await wsSdk).getBlock();
    expect(result).to.be.an("Array");
    return result;
  });
  xit("Can Get an list of addreses balances", async () => {
    let addressList =
      "d2f59465568c120a9203f9bd6ba2169b21478f4e7cb713f61eaa1ea0";
    let result = await (await wsSdk).getAddressBalance(addressList);
    expect(result).to.be.an("Array");
    return result;

    // this is slow
  }).timeout(15000);
  xit("Can Get an list of addreses tnxs with a limit & offset", async () => {
    let addressList =
      "d2f59465568c120a9203f9bd6ba2169b21478f4e7cb713f61eaa1ea0";
    let result = await (await wsSdk).getAddressTxnList(addressList, 5);
    expect(result).to.be.an("Array");
    expect(result.length === 5);

    let resultOffset = await (await wsSdk).getAddressTxnList(addressList, 5, 5);
    expect(result).to.be.an("Array");
    expect(result.length === 5);
    console.log(result, "rr", resultOffset);
    expect(
      resultOffset.every(x => !result.find(y => x.join("-") === y.join("-")))
    ).to.be.true;
    // this is slow
  }).timeout(15000);
  xit("Can check an aliases avalblity", async () => {
    let alias = "poop";
    let result = await (await wsSdk).getAliasAvalibility(alias);
    expect(result).to.be.oneOf(["Alias free", "Alias registered"]);
    return result;

    // this is slow
  }).timeout(15000);
  xit("Get address from alias", async () => {
    let alias = "god";
    let result = await (await wsSdk).getAddressFromAlias(alias);
    expect(result).to.be.a("String");
    return result;

    // this is slow
  }).timeout(15000);
  it("Can get a txnlist with and without an address", async () => {
    let resultTxnIdLookup = await (await wsSdk).getTransactions(txnId);
    expect(resultTxnIdLookup).to.be.a("Array");
    expect(resultTxnIdLookup.length === 1);
  }).timeout(15000);

  it("Can get a txnlist with and without an address", async () => {
    let resultTxnIdGoodAddressLockup = await (await wsSdk).getTransactions(
      txnId,
      txnIdAddress
    );
    expect(resultTxnIdGoodAddressLockup).to.be.a("Array");
    expect(resultTxnIdGoodAddressLockup.length === 1);
  }).timeout(15000);
  it("Can get a txnlist with and without an address", async () => {
    let resultTxnIDBadAddressLookup = await (await wsSdk).getTransactions(
      txnId,
      ["badaddress"]
    );
    expect(resultTxnIDBadAddressLookup.length === 0);
  }).timeout(15000);
  it("We can get the mempool", async () => {
    let result = await (await wsSdk).getMempoolTxns();
    expect(result.length);
  }).timeout(15000);
});
