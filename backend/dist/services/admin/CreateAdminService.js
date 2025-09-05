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

// src/services/admin/CreateAdminService.ts
var CreateAdminService_exports = {};
__export(CreateAdminService_exports, {
  CreateAdminService: () => CreateAdminService
});
module.exports = __toCommonJS(CreateAdminService_exports);

// src/prisma/index.ts
var import_client = require("@prisma/client");
var prismaClient = new import_client.PrismaClient();
var prisma_default = prismaClient;

// src/services/admin/CreateAdminService.ts
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

// src/services/admin/CreateAdminService.ts
var CreateAdminService = class {
  async execute({ username, name, password, role }) {
    const hashedPassword = await (0, import_bcrypt.hash)(password, 10);
    const admin = await prisma_default.admin.findFirst({
      where: {
        username
      }
    });
    if (admin) {
      throw new BadRequestException(
        "Admin already created",
        400 /* USER_ALREADY_EXISTS */
      );
    }
    try {
      const newAdmin = await prisma_default.admin.create({
        data: {
          username,
          name,
          password: hashedPassword,
          role
        }
      });
      return newAdmin;
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
  CreateAdminService
});
