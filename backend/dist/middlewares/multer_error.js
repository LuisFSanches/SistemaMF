"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/middlewares/multer_error.ts
var multer_error_exports = {};
__export(multer_error_exports, {
  handleMulterError: () => handleMulterError
});
module.exports = __toCommonJS(multer_error_exports);
var import_multer = __toESM(require("multer"));

// src/exceptions/root.ts
var HttpException = class extends Error {
  constructor(message, errorCode, statusCode, errors) {
    super(message);
    this.message = message;
    this.errorCode = errorCode;
    this.statusCode = statusCode;
    this.errors = errors;
  }
};

// src/exceptions/bad-request.ts
var BadRequestException = class extends HttpException {
  constructor(message, errorCode) {
    super(message, errorCode, 400, null);
  }
};

// src/middlewares/multer_error.ts
var handleMulterError = (err, req, res, next) => {
  if (err instanceof import_multer.default.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return next(
        new BadRequestException(
          "File is too large. Maximum size is 100KB",
          400 /* VALIDATION_ERROR */
        )
      );
    }
    if (err.code === "LIMIT_UNEXPECTED_FILE") {
      return next(
        new BadRequestException(
          "Unexpected field in form data",
          400 /* VALIDATION_ERROR */
        )
      );
    }
    return next(
      new BadRequestException(
        err.message,
        400 /* VALIDATION_ERROR */
      )
    );
  }
  next(err);
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  handleMulterError
});
