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

// src/services/admin/UpdateAdminService.ts
var UpdateAdminService_exports = {};
__export(UpdateAdminService_exports, {
  UpdateAdminService: () => UpdateAdminService
});
module.exports = __toCommonJS(UpdateAdminService_exports);

// src/prisma/index.ts
var import_client = require("@prisma/client");
var prismaClient = new import_client.PrismaClient();
var prisma_default = prismaClient;

// src/services/admin/UpdateAdminService.ts
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

// src/services/admin/UpdateAdminService.ts
var UpdateAdminService = class {
  async execute({ id, username, name, password, role }) {
    try {
      let data = {
        username,
        name,
        role
      };
      if (password) {
        const hashedPassword = await (0, import_bcrypt.hash)(password, 10);
        data = {
          ...data,
          password: hashedPassword
        };
      }
      const updatedAdmin = await prisma_default.admin.update({
        where: {
          id
        },
        data
      });
      return updatedAdmin;
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
  UpdateAdminService
});
