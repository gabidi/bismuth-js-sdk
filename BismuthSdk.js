"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const net = __importStar(require("net"));
const BismuthNative_1 = require("./BismuthNative");
exports.MIN_NODE_VERSION = "4.2.3.7";
class BismuthSdk extends BismuthNative_1.BismuthNative {
    constructor({ server = "127.0.0.1", port = 5658, verbose = false, socket = new Promise((resolve, reject) => {
        let socket = net.createConnection({ host: server, port, writable: true, readable: true }, () => {
            if (verbose)
                console.log("Connected to node !");
            return resolve(socket);
        });
    }) } = {}) {
        super({ socket, verbose });
        this.getStatus().then(({ walletversion }) => {
            if (parseInt(walletversion.split(".").join("")) <
                parseInt(exports.MIN_NODE_VERSION.split(".").join("")))
                console.warn(`Your Bismuth wallet node is too old. Some API functions might not work !! \n Minimum version required is ${exports.MIN_NODE_VERSION}`);
        });
    }
    getStatus() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.command("statusjson");
        });
    }
    getBlock(blockNumbers) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.command("blockget", blockNumbers);
        });
    }
    getLastDifficulty() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.command("difflast");
        });
    }
    getTxnDetails(txn) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.command("api_gettransaction", txn);
        });
    }
    getAddressListBalance(addressList) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.command("api_listbalance", addressList);
        });
    }
    getNewKeys() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.command("keygen");
        });
    }
}
exports.BismuthSdk = BismuthSdk;
