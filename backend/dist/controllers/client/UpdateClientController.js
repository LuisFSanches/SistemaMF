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

// src/controllers/client/UpdateClientController.ts
var UpdateClientController_exports = {};
__export(UpdateClientController_exports, {
  UpdateClientController: () => UpdateClientController
});
module.exports = __toCommonJS(UpdateClientController_exports);

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

// src/exceptions/bad-request.ts
var BadRequestException = class extends HttpException {
  constructor(message, errorCode) {
    super(message, errorCode, 400, null);
  }
};

// src/services/client/UpdateClientService.ts
var UpdateClientService = class {
  async execute({ id, first_name, last_name, phone_number }) {
    try {
      const updateUser = await prisma_default.client.update({
        where: {
          id
        },
        data: {
          first_name,
          last_name,
          phone_number
        }
      });
      return updateUser;
    } catch (error) {
      throw new BadRequestException(
        error.message,
        500 /* SYSTEM_ERROR */
      );
    }
  }
};

// src/controllers/client/UpdateClientController.ts
var UpdateClientController = class {
  async handle(req, res, next) {
    const { id, first_name, last_name, phone_number } = req.body;
    const updateClientService = new UpdateClientService();
    const client = await updateClientService.execute({
      id,
      first_name,
      last_name,
      phone_number
    });
    return res.json(client);
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  UpdateClientController
});
