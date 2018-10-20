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
const BismuthNative_1 = require("./BismuthNative");
class BismuthWSSdk extends BismuthNative_1.BismuthNative {
    constructor(cfg) {
        super(cfg);
    }
    command(command, options = []) {
        return __awaiter(this, void 0, void 0, function* () {
            const socket = yield this.socket;
            return new Promise((res, rej) => {
                socket.once("message", response => {
                    if (this.verbose)
                        console.log("Command", command, "Recieved data from host", response.toString("utf8"));
                    const responseString = response.toString("utf8");
                    try {
                        return res(JSON.parse(responseString));
                    }
                    catch (err) {
                        rej({ err, responseString });
                    }
                });
                socket.once("error", err => rej(err));
                socket.send(JSON.stringify([command, ...options]));
            });
        });
    }
    getStatus() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.command("statusget");
        });
    }
    getBlock() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.command("blocklast");
        });
    }
    getLastDifficulty() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.command("difflast");
        });
    }
    getAddressTxnList(address, limit = 10) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.command("addlistlim", [address, limit]);
        });
    }
    getAddressBalance(address) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.command("balanceget", [address]);
        });
    }
}
exports.BismuthWSSdk = BismuthWSSdk;
