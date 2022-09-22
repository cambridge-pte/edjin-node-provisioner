"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var node_xlsx_1 = require("node-xlsx");
var edjin_node_sdk_1 = require("edjin-node-sdk");
var fs_1 = require("fs");
var path = require("path");
var userModel = new edjin_node_sdk_1.User();
var FILENAME = 'C5_provisioning-735-QA.xlsx';
var UID = 0;
var EMAIL = 1;
var FIRST_NAME = 3;
var LAST_NAME = 4;
var COUNTRY_CODE = 7;
var USER_ROLE = 8;
var CLASS_KEY = 9;
function parseExcel() {
    var file = (0, fs_1.readFileSync)(path.resolve(__dirname, 'docs', FILENAME));
    var workSheetsFromBuffer = node_xlsx_1["default"].parse(file);
    var userObj = [];
    var count = 0;
    workSheetsFromBuffer.forEach(function (element) {
        var elementData = element.data;
        elementData.forEach(function (el, i) {
            var _a, _b, _c, _d, _e, _f, _g;
            if (i === 0)
                return;
            if (el.length == 0)
                return;
            var userData;
            var classKey = [];
            if (el[CLASS_KEY]) {
                var CKIndex = CLASS_KEY;
                do {
                    classKey.push(el[CKIndex]);
                    CKIndex = CKIndex + 1;
                } while (!!el[CKIndex]);
            }
            userData = {
                data: {
                    userUuid: (_a = el[UID]) === null || _a === void 0 ? void 0 : _a.trim(),
                    email: (_b = el[EMAIL]) === null || _b === void 0 ? void 0 : _b.trim(),
                    username: (_c = el[EMAIL]) === null || _c === void 0 ? void 0 : _c.trim(),
                    firstName: (_d = el[FIRST_NAME]) === null || _d === void 0 ? void 0 : _d.trim(),
                    lastName: (_e = el[LAST_NAME]) === null || _e === void 0 ? void 0 : _e.trim(),
                    countryCode: (_f = el[COUNTRY_CODE]) === null || _f === void 0 ? void 0 : _f.trim().toUpperCase(),
                    subscriberType: (_g = el[USER_ROLE]) === null || _g === void 0 ? void 0 : _g.trim().toUpperCase(),
                    brandCode: 'IGCSE',
                    classCodes: classKey
                }
            };
            userObj.push(userData);
            count++;
        });
    });
    userObj.forEach(function (user) {
        //to do: successfully create an account in edjin, last known error: INVALID BRAND CODE
        createEdjinAccount(user.data);
        //to do: modify xlsx file to have uuid for each row and test adding to class
        //addUserToClasses(user.data.classKey, user.data.uuid);
    });
    //edjin create user test
    // const testData = {
    //   email: 'test@cambridge.org',
    //   username: 'username1',
    //   firstName: 'John',
    //   lastName: 'Doe',
    //   countryCode: 'AU',
    //   subscriberType: 'STUDENT',
    //   brandCode: 'HOTMATHS',
    //   userUuid: 'erfgt3e434r2',
    // };
    // createEdjinAccounts(testData);
}
function createEdjinAccount(user) {
    return __awaiter(this, void 0, void 0, function () {
        var response, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, userModel.createUser(user)];
                case 1:
                    response = _a.sent();
                    console.log('response >> ', response);
                    return [2 /*return*/, response];
                case 2:
                    error_1 = _a.sent();
                    console.log('error >> ', error_1);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function addUserToClasses(classIds, userId) {
    return __awaiter(this, void 0, void 0, function () {
        var response, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, userModel.addUserToClasses(classIds, userId)];
                case 1:
                    response = _a.sent();
                    return [2 /*return*/, response];
                case 2:
                    error_2 = _a.sent();
                    console.log(error_2);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
parseExcel();
// return if user is already existing
// {
//   "success": false,
//   "async": false,
//   "updateCount": 0,
//   "message": "Username is already used",
//   "code": "DUPLICATE_USERNAME",
//   "errors": [
//       {
//           "userUuid": "a2e4b96c66654fbda9d02fea4c5ec74b",
//           "username": "capteacher_loc_shane01@pte-mailbox.cambridgedev.org",
//           "subscriberType": "TEACHER",
//           "errorCode": "DUPLICATE_USERNAME",
//           "message": "Username is already used"
//       }
//   ]
// }
