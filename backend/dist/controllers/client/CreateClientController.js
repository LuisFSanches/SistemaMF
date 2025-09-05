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

// src/controllers/client/CreateClientController.ts
var CreateClientController_exports = {};
__export(CreateClientController_exports, {
  CreateClientController: () => CreateClientController
});
module.exports = __toCommonJS(CreateClientController_exports);

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

// src/schemas/client/createClient.ts
var import_zod = require("zod");
var createClientSchema = import_zod.z.object({
  first_name: import_zod.z.string().nonempty("first_name is required"),
  last_name: import_zod.z.string().nonempty("last_name is required"),
  phone_number: import_zod.z.string().nonempty("phone_number is required")
});

// src/exceptions/bad-request.ts
var BadRequestException = class extends HttpException {
  constructor(message, errorCode) {
    super(message, errorCode, 400, null);
  }
};

// src/services/client/CreateClientService.ts
var CreateClientService = class {
  async execute(data) {
    const parsed = createClientSchema.safeParse(data);
    if (!parsed.success) {
      throw new BadRequestException(
        parsed.error.errors[0].message,
        400 /* VALIDATION_ERROR */
      );
    }
    const { phone_number } = data;
    const client = await prisma_default.client.findFirst({
      where: { phone_number }
    });
    if (client) {
      throw new BadRequestException(
        "Client already created",
        400 /* USER_ALREADY_EXISTS */
      );
    }
    try {
      const newClient = await prisma_default.client.create({ data });
      return newClient;
    } catch (error) {
      console.error("[CreateClientService] Failed:", error);
      throw new BadRequestException(
        error.message,
        500 /* SYSTEM_ERROR */
      );
    }
  }
};

// src/controllers/client/CreateClientController.ts
var CreateClientController = class {
  async handle(req, res, next) {
    const { first_name, last_name, phone_number } = req.body;
    const createClientService = new CreateClientService();
    const client = await createClientService.execute({
      first_name,
      last_name,
      phone_number
    });
    return res.json(client);
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  CreateClientController
});
