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

// src/controllers/address/DeleteAddressController.ts
var DeleteAddressController_exports = {};
__export(DeleteAddressController_exports, {
  DeleteAddressController: () => DeleteAddressController
});
module.exports = __toCommonJS(DeleteAddressController_exports);

// src/prisma/index.ts
var import_client = require("@prisma/client");
var prismaClient = new import_client.PrismaClient();
var prisma_default = prismaClient;

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

// src/schemas/address/deleteAddress.ts
var import_zod = require("zod");
var deleteAddressSchema = import_zod.z.string().uuid("Invalid id format");

// src/exceptions/bad-request.ts
var BadRequestException = class extends HttpException {
  constructor(message, errorCode) {
    super(message, errorCode, 400, null);
  }
};

// src/services/address/DeleteAddressService.ts
var DeleteAddressService = class {
  async execute(id) {
    try {
      const parsed = deleteAddressSchema.safeParse(id);
      if (!parsed.success) {
        return {
          error: true,
          message: parsed.error.errors[0].message,
          code: 400 /* VALIDATION_ERROR */
        };
      }
      await prisma_default.address.delete({
        where: { id }
      });
      return { Status: "Address successfully deleted" };
    } catch (error) {
      throw new BadRequestException(
        error.message,
        500 /* SYSTEM_ERROR */
      );
    }
  }
};

// src/controllers/address/DeleteAddressController.ts
var DeleteAddressController = class {
  async handle(req, res) {
    const { id } = req.params;
    const deleteAddressService = new DeleteAddressService();
    const address = await deleteAddressService.execute(id);
    return res.json(address);
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  DeleteAddressController
});
