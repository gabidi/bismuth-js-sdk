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
const util_1 = require("util");
class BismuthNative {
    constructor(opts) {
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
    getConnection() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.verbose)
                console.log("Get connection is waiting on socket..");
            return yield this.socket;
        });
    }
    _prepareRpcPayload(data) {
        // Only json encode stuff that is not a number or boolean to have correct headers
        let dataToSend = !isNaN(data) || util_1.isBoolean(data) ? data.toString() : JSON.stringify(data);
        return `${dataToSend.length.toString().padStart(10, "0")}${dataToSend}`;
    }
    command(command, options) {
        return __awaiter(this, void 0, void 0, function* () {
            let socket = yield this.getConnection();
            return new Promise((resolve, reject) => {
                let payload = this._prepareRpcPayload(command);
                if (this.verbose)
                    console.log("Sending Payload", payload);
                socket.write(payload);
                if (options && options.length)
                    options.forEach(option => {
                        let optionPayload = this._prepareRpcPayload(option);
                        if (this.verbose)
                            console.log("Sending Option", optionPayload);
                        socket.write(optionPayload);
                    });
                socket.on("data", (response) => {
                    if (this.verbose)
                        console.log("Recieved data from host", response.toString("utf8"));
                    try {
                        return resolve(JSON.parse(response.toString("utf8").substr(10)));
                    }
                    catch (err) {
                        reject({ err, response });
                    }
                });
            });
        });
    }
}
exports.BismuthNative = BismuthNative;
