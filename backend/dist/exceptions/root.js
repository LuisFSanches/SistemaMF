"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/exceptions/root.ts
var root_exports = {};
__export(root_exports, {
  ErrorCodes: () => ErrorCodes,
  HttpException: () => HttpException
});
module.exports = __toCommonJS(root_exports);
var HttpException = class extends Error {
  constructor(message, errorCode, statusCode, errors) {
    super(message);
    this.message = message;
    this.errorCode = errorCode;
    this.statusCode = statusCode;
    this.errors = errors;
  }
};
var ErrorCodes = /* @__PURE__ */ ((ErrorCodes2) => {
  ErrorCodes2[ErrorCodes2["USER_NOT_FOUND"] = 400] = "USER_NOT_FOUND";
  ErrorCodes2[ErrorCodes2["USER_ALREADY_EXISTS"] = 400] = "USER_ALREADY_EXISTS";
  ErrorCodes2[ErrorCodes2["INCORRECT_PASSWORD"] = 400] = "INCORRECT_PASSWORD";
  ErrorCodes2[ErrorCodes2["UNAUTHORIZED"] = 401] = "UNAUTHORIZED";
  ErrorCodes2[ErrorCodes2["BAD_REQUEST"] = 404] = "BAD_REQUEST";
  ErrorCodes2[ErrorCodes2["SYSTEM_ERROR"] = 500] = "SYSTEM_ERROR";
  ErrorCodes2[ErrorCodes2["AUTHORIZED"] = 200] = "AUTHORIZED";
  ErrorCodes2[ErrorCodes2["VALIDATION_ERROR"] = 400] = "VALIDATION_ERROR";
  return ErrorCodes2;
})(ErrorCodes || {});
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ErrorCodes,
  HttpException
});
