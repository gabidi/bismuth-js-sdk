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
const async_1 = require("async");
class BismuthWSSdk extends BismuthNative_1.BismuthNative {
    constructor(cfg) {
        super(cfg);
        this.queue = async_1.queue(({ command, options, action }, cb) => __awaiter(this, void 0, void 0, function* () {
            const timeoutId = setTimeout(() => cb(new Error("Response Timeout")), 15000);
            const socket = yield this.socket;
            socket.once("message", (response) => {
                if (this.verbose)
                    console.log("Command", command, "Recieved data from host", response.toString("utf8"));
                const responseString = response.toString("utf8");
                try {
                    action(JSON.parse(responseString));
                    cb();
                }
                catch (err) {
                    cb(err);
                }
                finally {
                    clearTimeout(timeoutId);
                }
            });
            socket.send(JSON.stringify([command, ...options]));
        }), 1);
    }
    command(command, options = []) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((res, rej) => {
                this.queue.push({ command, options, action: res }, err => {
                    if (err)
                        rej(err);
                });
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
    getMempoolTxns() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.command("mpget");
        });
    }
    insertMemPoolTxn(b64SignedTxn) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.command("mpinsert", [b64SignedTxn]);
        });
    }
    /// FIXME DO MEM POOL CALLS BEFORE YOU MOVE ON!
    getTransactions(txnId, addresses = undefined) {
        return __awaiter(this, void 0, void 0, function* () {
            if (addresses && !Array.isArray(addresses))
                addresses = [addresses];
            const payload = [txnId];
            if (addresses)
                payload.push(addresses);
            return yield this.command("txget", payload);
        });
    }
    getAddressTxnList(address, limit = 10, offset = undefined) {
        return __awaiter(this, void 0, void 0, function* () {
            const command = offset && offset > 0 ? "addlistlimfrom" : "addlistlim";
            const param = [address, limit];
            if (command === "addlistlimfrom")
                param.push(offset);
            return yield this.command(command, param);
        });
    }
    getAddressFromAlias(alias) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.command("addfromalias", [alias]);
        });
    }
    getAddressAlias(address) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.command("aliasesget", [
                Array.isArray(address) ? address : [address]
            ]);
        });
    }
    getAliasAvalibility(alias) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.command("aliascheck", [alias]);
        });
    }
    getAddressBalance(address) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.command("balanceget", [address]);
        });
    }
}
exports.BismuthWSSdk = BismuthWSSdk;
