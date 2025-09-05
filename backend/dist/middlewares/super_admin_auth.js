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

// src/middlewares/super_admin_auth.ts
var super_admin_auth_exports = {};
__export(super_admin_auth_exports, {
  default: () => super_admin_auth_default
});
module.exports = __toCommonJS(super_admin_auth_exports);
var jwt = __toESM(require("jsonwebtoken"));

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

// src/exceptions/unauthorized.ts
var UnauthorizedRequestException = class extends HttpException {
  constructor(message, errorCode) {
    super(message, errorCode, 401, null);
  }
};

// src/prisma/index.ts
var import_client = require("@prisma/client");
var prismaClient = new import_client.PrismaClient();
var prisma_default = prismaClient;

// src/middlewares/super_admin_auth.ts
var superAdminAuthMiddleware = async (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    next(new UnauthorizedRequestException("Unauthorized", 401 /* UNAUTHORIZED */));
  }
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await prisma_default.admin.findFirst({
      where: {
        id: payload.id
      }
    });
    if (!admin) {
      next(new UnauthorizedRequestException("Unauthorized", 401 /* UNAUTHORIZED */));
    }
    if (admin?.role !== "SUPER_ADMIN") {
      next(new UnauthorizedRequestException("Unauthorized", 401 /* UNAUTHORIZED */));
    }
    req.admin = admin;
    next();
  } catch (error) {
    next(new UnauthorizedRequestException("Unauthorized", 401 /* UNAUTHORIZED */));
  }
};
var super_admin_auth_default = superAdminAuthMiddleware;
