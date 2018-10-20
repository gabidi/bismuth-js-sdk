"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const BismuthWSSdk_1 = require("../BismuthWSSdk");
const WebSocket = require("ws");
const cfg = {
    server: "127.0.0.1",
    port: 5658,
    verbose: false
};
let wsSdk;
describe("Bismuth WS SDK test", () => {
    before(() => {
        wsSdk = new BismuthWSSdk_1.BismuthWSSdk({
            verbose: true,
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
    it("Can Get node status using a websocket connection", () => __awaiter(this, void 0, void 0, function* () {
        let result = yield (yield wsSdk).getStatus();
        chai_1.expect(result).to.be.an("Array");
        return result;
    })).timeout(10000);
    it("Can Get a block's  details", () => __awaiter(this, void 0, void 0, function* () {
        let result = yield (yield wsSdk).getBlock();
        chai_1.expect(result).to.be.an("Array");
        return result;
    }));
    it("Can Get an list of addreses balances", () => __awaiter(this, void 0, void 0, function* () {
        let addressList = "d2f59465568c120a9203f9bd6ba2169b21478f4e7cb713f61eaa1ea0";
        let result = yield (yield wsSdk).getAddressBalance(addressList);
        chai_1.expect(result).to.be.an("Array");
        return result;
        // this is slow
    })).timeout(15000);
    it("Can Get an list of addreses tnxs with a limit", () => __awaiter(this, void 0, void 0, function* () {
        let addressList = "d2f59465568c120a9203f9bd6ba2169b21478f4e7cb713f61eaa1ea0";
        let result = yield (yield wsSdk).getAddressTxnList(addressList, 5);
        chai_1.expect(result).to.be.an("Array");
        chai_1.expect(result.length === 5);
        return result;
        // this is slow
    })).timeout(15000);
});
