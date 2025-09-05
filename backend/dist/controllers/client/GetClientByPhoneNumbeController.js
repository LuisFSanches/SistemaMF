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

// src/controllers/client/GetClientByPhoneNumbeController.ts
var GetClientByPhoneNumbeController_exports = {};
__export(GetClientByPhoneNumbeController_exports, {
  GetClientByPhoneNumbeController: () => GetClientByPhoneNumbeController
});
module.exports = __toCommonJS(GetClientByPhoneNumbeController_exports);

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

// src/services/client/GetClientByPhoneNumberService.ts
var GetClientByPhoneNumberService = class {
  async execute(phone_number) {
    try {
      if (!phone_number) return null;
      const client = await prisma_default.client.findFirst({
        where: {
          phone_number
        }
      });
      return client;
    } catch (error) {
      throw new BadRequestException(
        error.message,
        500 /* SYSTEM_ERROR */
      );
    }
  }
};

// src/controllers/client/GetClientByPhoneNumbeController.ts
var GetClientByPhoneNumbeController = class {
  async handle(req, res) {
    const { phone_number } = req.query;
    const getClientService = new GetClientByPhoneNumberService();
    const client = await getClientService.execute(phone_number);
    return res.json(client);
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  GetClientByPhoneNumbeController
});
