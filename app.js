"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_xlsx_1 = __importDefault(require("node-xlsx"));
const edjin_node_sdk_1 = require("edjin-node-sdk");
const fs_1 = require("fs");
const path = __importStar(require("path"));
const userModel = new edjin_node_sdk_1.User();
const FILENAME = 'C5_provisioning-735-QA.xlsx';
const EMAIL = 0;
const PASSWORD = 1;
const FIRST_NAME = 2;
const LAST_NAME = 3;
const SCHOOL = 4;
const STATE = 5;
const POST_CODE = 6;
const USER_ROLE = 7;
const CLASS_KEY = 8;
function parseExcel() {
    const file = (0, fs_1.readFileSync)(path.resolve(__dirname, 'docs', FILENAME));
    const workSheetsFromBuffer = node_xlsx_1.default.parse(file);
    let userObj = [];
    let count = 0;
    workSheetsFromBuffer.forEach(element => {
        const elementData = element.data;
        elementData.forEach((el, i) => {
            var _a, _b, _c, _d, _e, _f, _g, _h;
            if (i === 0)
                return;
            if (el.length == 0)
                return;
            let userData;
            let classKey = [];
            if (el[CLASS_KEY]) {
                let CKIndex = CLASS_KEY;
                do {
                    classKey.push(el[CKIndex]);
                    CKIndex = CKIndex + 1;
                } while (!!el[CKIndex]);
            }
            userData = {
                data: {
                    email: (_a = el[EMAIL]) === null || _a === void 0 ? void 0 : _a.trim(),
                    password: (_b = el[PASSWORD]) === null || _b === void 0 ? void 0 : _b.toString().trim(),
                    firstName: (_c = el[FIRST_NAME]) === null || _c === void 0 ? void 0 : _c.trim(),
                    lastName: (_d = el[LAST_NAME]) === null || _d === void 0 ? void 0 : _d.trim(),
                    school: (_e = el[SCHOOL]) === null || _e === void 0 ? void 0 : _e.trim(),
                    state: (_f = el[STATE]) === null || _f === void 0 ? void 0 : _f.trim(),
                    postCode: (_g = el[POST_CODE]) === null || _g === void 0 ? void 0 : _g.trim(),
                    userRole: (_h = el[USER_ROLE]) === null || _h === void 0 ? void 0 : _h.trim(),
                    classKey: classKey
                }
            };
            userObj.push(userData);
            count++;
        });
    });
    userObj.forEach(user => {
        //to do: successfully create an account in edjin, last known error: INVALID BRAND CODE
        //createEdjinAccounts(user.data);
        //to do: modify xlsx file to have uuid for each row and test adding to class
        //addUserToClasses(user.data.classKey, user.data.uuid);
        console.log(user.data);
    });
    //edjin create user test
    const testData = {
        email: 'test@cambridge.org',
        username: 'username1',
        firstName: 'John',
        lastName: 'Doe',
        countryCode: 'AU',
        subscriberType: 'STUDENT',
        brandCode: 'HOTMATHS',
        userUuid: 'erfgt3e434r2',
    };
    createEdjinAccounts(testData);
}
function createEdjinAccounts(user) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log('making user');
            const response = yield userModel.createUser(user);
            console.log(response);
            return response;
        }
        catch (error) {
            console.log(error);
        }
    });
}
function addUserToClasses(classIds, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield userModel.addUserToClasses(classIds, userId);
            return response;
        }
        catch (error) {
            console.log(error);
        }
    });
}
parseExcel();
