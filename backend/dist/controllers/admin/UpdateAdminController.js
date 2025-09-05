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

// src/controllers/admin/UpdateAdminController.ts
var UpdateAdminController_exports = {};
__export(UpdateAdminController_exports, {
  UpdateAdminController: () => UpdateAdminController
});
module.exports = __toCommonJS(UpdateAdminController_exports);

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

// src/prisma/index.ts
var import_client = require("@prisma/client");
var prismaClient = new import_client.PrismaClient();
var prisma_default = prismaClient;

// src/services/admin/UpdateAdminService.ts
var import_bcrypt = require("bcrypt");
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

// src/services/admin/ValidateSuperAdminService.ts
var import_bcrypt2 = require("bcrypt");
var ValidateSuperAdminService = class {
  async execute({ currently_admin_password, confirmation_password }) {
    try {
      const comparePassword = await (0, import_bcrypt2.compare)(confirmation_password, currently_admin_password);
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

// src/controllers/admin/UpdateAdminController.ts
var UpdateAdminController = class {
  async handle(req, res, next) {
    const { id, username, name, password, role, super_admin_password } = req.body;
    const validateSuperAdminService = new ValidateSuperAdminService();
    const superAdmin = req.admin;
    const validateSuperAdmin = await validateSuperAdminService.execute({
      currently_admin_password: superAdmin?.password,
      confirmation_password: super_admin_password
    });
    if (validateSuperAdmin.error) {
      next(new BadRequestException(
        validateSuperAdmin.message,
        validateSuperAdmin.code
      ));
      return;
    }
    const updateAdminService = new UpdateAdminService();
    const admin = await updateAdminService.execute({
      id,
      username,
      name,
      password,
      role
    });
    return res.json(admin);
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  UpdateAdminController
});
