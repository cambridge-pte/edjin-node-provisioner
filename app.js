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
var classModel = new edjin_node_sdk_1.Class();
var schoolModel = new edjin_node_sdk_1.School();
var FILENAME = 'C5_provisioning-735-QA.xlsx';
var UID = 0;
var EMAIL = 1;
var FIRST_NAME = 3;
var LAST_NAME = 4;
var COUNTRY_CODE = 7;
var USER_ROLE = 8;
var CLASS_KEY = 9;
function parseExcel() {
    return __awaiter(this, void 0, void 0, function () {
        var file, workSheetsFromBuffer, userObj, count, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    file = (0, fs_1.readFileSync)(path.resolve(__dirname, 'docs', FILENAME));
                    workSheetsFromBuffer = node_xlsx_1["default"].parse(file);
                    userObj = [];
                    count = 0;
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
                    return [4 /*yield*/, provisionAccounts(userObj)];
                case 1:
                    result = _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function provisionAccounts(userObj) {
    return __awaiter(this, void 0, void 0, function () {
        var accountExistingOrMade_1, accountSuccessFail_1, classAddSuccess_1, classAddFail_1, test_1, accountCreation, classEnrollment, error_1;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    accountExistingOrMade_1 = 0;
                    accountSuccessFail_1 = 0;
                    classAddSuccess_1 = 0;
                    classAddFail_1 = 0;
                    test_1 = 0;
                    accountCreation = userObj.map(function (user) { return __awaiter(_this, void 0, void 0, function () {
                        var response;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, userModel.createUser(user.data)];
                                case 1:
                                    response = _a.sent();
                                    response.success || response.code === 'DUPLICATE_USERNAME' ? accountExistingOrMade_1++ : accountSuccessFail_1++;
                                    return [2 /*return*/, response];
                            }
                        });
                    }); });
                    return [4 /*yield*/, Promise.all(accountCreation)];
                case 1:
                    _a.sent();
                    classEnrollment = userObj.map(function (user) { return __awaiter(_this, void 0, void 0, function () {
                        var classCodes, allClassCodes, userId, classesResult, classErrors;
                        var _this = this;
                        var _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    classCodes = user.data.classCodes.map(function (code) { return __awaiter(_this, void 0, void 0, function () {
                                        var response;
                                        return __generator(this, function (_a) {
                                            switch (_a.label) {
                                                case 0: return [4 /*yield*/, classModel.getClassByClassKey(code)];
                                                case 1:
                                                    response = _a.sent();
                                                    return [2 /*return*/, response.classId];
                                            }
                                        });
                                    }); });
                                    return [4 /*yield*/, Promise.all(classCodes)];
                                case 1:
                                    allClassCodes = _b.sent();
                                    return [4 /*yield*/, getUserByGlobalGoID(user.data.userUuid)];
                                case 2:
                                    userId = _b.sent();
                                    return [4 /*yield*/, userModel.addUserToClasses(allClassCodes, userId)];
                                case 3:
                                    classesResult = _b.sent();
                                    if (!(((_a = classesResult.data.errors) === null || _a === void 0 ? void 0 : _a.length) !== undefined)) return [3 /*break*/, 5];
                                    classErrors = classesResult.data.errors.map(function (error) { return __awaiter(_this, void 0, void 0, function () {
                                        var response, schoolResponse, classesResult2;
                                        return __generator(this, function (_a) {
                                            switch (_a.label) {
                                                case 0: return [4 /*yield*/, classModel.getClassById(error.classId)];
                                                case 1:
                                                    response = _a.sent();
                                                    return [4 /*yield*/, schoolModel.addUsersToSchool(response.schoolUuid, error.userUuid)];
                                                case 2:
                                                    schoolResponse = _a.sent();
                                                    if (!(schoolResponse.success === true)) return [3 /*break*/, 4];
                                                    console.log(error.username);
                                                    return [4 /*yield*/, userModel.addUserToClasses(error.classId, userId)];
                                                case 3:
                                                    classesResult2 = _a.sent();
                                                    console.log(classesResult2.data);
                                                    _a.label = 4;
                                                case 4:
                                                    console.log(test_1++);
                                                    return [2 /*return*/];
                                            }
                                        });
                                    }); });
                                    return [4 /*yield*/, Promise.all(classErrors)];
                                case 4:
                                    _b.sent();
                                    _b.label = 5;
                                case 5:
                                    classesResult.data.success ? classAddSuccess_1++ : classAddFail_1++;
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    return [4 /*yield*/, Promise.all(classEnrollment)];
                case 2:
                    _a.sent();
                    return [2 /*return*/, {
                            accountExistingOrMade: accountExistingOrMade_1,
                            accountSuccessFail: accountSuccessFail_1,
                            classAddSuccess: classAddSuccess_1,
                            classAddFail: classAddFail_1
                        }];
                case 3:
                    error_1 = _a.sent();
                    console.log('error >> ', error_1);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function getUserByGlobalGoID(userId) {
    return __awaiter(this, void 0, void 0, function () {
        var response, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, userModel.getUserByGlobalGoID(userId)];
                case 1:
                    response = _a.sent();
                    return [2 /*return*/, response.userId];
                case 2:
                    error_2 = _a.sent();
                    console.log('error >> ', error_2);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function checkAccountsAndClasses(userObj) {
    return __awaiter(this, void 0, void 0, function () {
        var AccountAndClassCheck, result;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    AccountAndClassCheck = userObj.map(function (user) { return __awaiter(_this, void 0, void 0, function () {
                        var userAccount, classInfo, classData;
                        var _this = this;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, userModel.getUserByUsername(user.data.username)];
                                case 1:
                                    userAccount = _a.sent();
                                    classInfo = userAccount.classIds.map(function (code) { return __awaiter(_this, void 0, void 0, function () {
                                        var response;
                                        return __generator(this, function (_a) {
                                            switch (_a.label) {
                                                case 0: return [4 /*yield*/, classModel.getClassById(code)];
                                                case 1:
                                                    response = _a.sent();
                                                    return [2 /*return*/, response.classCode];
                                            }
                                        });
                                    }); });
                                    return [4 /*yield*/, Promise.all(classInfo)];
                                case 2:
                                    classData = _a.sent();
                                    return [2 /*return*/, {
                                            fullName: userAccount.fullName,
                                            subscriberType: userAccount.subscriberType,
                                            classData: classData
                                        }];
                            }
                        });
                    }); });
                    return [4 /*yield*/, Promise.all(AccountAndClassCheck)];
                case 1:
                    result = _a.sent();
                    console.log(result);
                    return [2 /*return*/];
            }
        });
    });
}
parseExcel();
function parseExcelToJson() {
    return __awaiter(this, void 0, void 0, function () {
        var file, workSheetsFromBuffer, userObj, count;
        return __generator(this, function (_a) {
            file = (0, fs_1.readFileSync)(path.resolve(__dirname, 'docs', FILENAME));
            workSheetsFromBuffer = node_xlsx_1["default"].parse(file);
            userObj = [];
            count = 0;
            workSheetsFromBuffer.forEach(function (element) {
                var elementData = element.data;
                elementData.forEach(function (el, i) {
                    var _a, _b, _c, _d, _e;
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
                        username: (_a = el[EMAIL]) === null || _a === void 0 ? void 0 : _a.trim(),
                        firstName: (_b = el[FIRST_NAME]) === null || _b === void 0 ? void 0 : _b.trim(),
                        lastName: (_c = el[LAST_NAME]) === null || _c === void 0 ? void 0 : _c.trim(),
                        countryCode: (_d = el[COUNTRY_CODE]) === null || _d === void 0 ? void 0 : _d.trim().toUpperCase(),
                        subscriberType: (_e = el[USER_ROLE]) === null || _e === void 0 ? void 0 : _e.trim().toUpperCase()
                    };
                    userObj.push(userData);
                    count++;
                });
            });
            console.log(userObj);
            return [2 /*return*/];
        });
    });
}
