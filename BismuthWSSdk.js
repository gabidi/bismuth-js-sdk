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
const BismuthSdk_1 = require("./BismuthSdk");
class BismuthWSSdk extends BismuthSdk_1.BismuthSdk {
    constructor(cfg) {
        super(cfg);
    }
    command(command, options = []) {
        return __awaiter(this, void 0, void 0, function* () {
            const socket = yield this.socket;
            return new Promise((res, rej) => {
                socket.once("message", response => {
                    if (this.verbose)
                        console.log("Recieved data from host", response.toString("utf8"));
                    try {
                        return res(JSON.parse(response.toString("utf8").substr(10)));
                    }
                    catch (err) {
                        rej(err);
                    }
                });
                socket.once("error", err => rej(err));
                socket.send(JSON.stringify([command, ...options]));
            });
        });
    }
}
exports.BismuthWSSdk = BismuthWSSdk;
