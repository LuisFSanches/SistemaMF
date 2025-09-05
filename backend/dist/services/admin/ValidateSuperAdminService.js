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

// src/services/admin/ValidateSuperAdminService.ts
var ValidateSuperAdminService_exports = {};
__export(ValidateSuperAdminService_exports, {
  ValidateSuperAdminService: () => ValidateSuperAdminService
});
module.exports = __toCommonJS(ValidateSuperAdminService_exports);
var import_bcrypt = require("bcrypt");

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

// src/services/admin/ValidateSuperAdminService.ts
var ValidateSuperAdminService = class {
  async execute({ currently_admin_password, confirmation_password }) {
    try {
      const comparePassword = await (0, import_bcrypt.compare)(confirmation_password, currently_admin_password);
      if (!comparePassword) {
        throw new BadRequestException(
          "Invalid super admin password",
          401 /* UNAUTHORIZED */
        );
      }
      return { error: false, message: "Invalid super admin password", code: 200 /* AUTHORIZED */ };
    } catch (error) {
      throw new BadRequestException(
        error.message,
        500 /* SYSTEM_ERROR */
      );
    }
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ValidateSuperAdminService
});
