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

// src/services/admin/LoginAdminService.ts
var LoginAdminService_exports = {};
__export(LoginAdminService_exports, {
  LoginAdminService: () => LoginAdminService
});
module.exports = __toCommonJS(LoginAdminService_exports);

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

// src/prisma/index.ts
var import_client = require("@prisma/client");
var prismaClient = new import_client.PrismaClient();
var prisma_default = prismaClient;

// src/services/admin/LoginAdminService.ts
var import_bcrypt = require("bcrypt");
var jwt = __toESM(require("jsonwebtoken"));

// src/exceptions/bad-request.ts
var BadRequestException = class extends HttpException {
  constructor(message, errorCode) {
    super(message, errorCode, 400, null);
  }
};

// src/services/admin/LoginAdminService.ts
var LoginAdminService = class {
  async execute({ username, password }) {
    try {
      const admin = await prisma_default.admin.findFirst({
        where: {
          username
        }
      });
      if (!admin) {
        throw new BadRequestException(
          "Admin not found",
          400 /* USER_NOT_FOUND */
        );
      }
      if (!(0, import_bcrypt.compareSync)(password, admin.password)) {
        throw new BadRequestException(
          "Wrong password",
          400 /* INCORRECT_PASSWORD */
        );
      }
      const token = jwt.sign({
        id: admin.id,
        role: admin.role
      }, process.env.JWT_SECRET, {
        expiresIn: "1y"
      });
      delete admin.password;
      return { admin, token };
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
  LoginAdminService
});
