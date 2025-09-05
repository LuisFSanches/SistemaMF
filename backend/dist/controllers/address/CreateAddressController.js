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

// src/controllers/address/CreateAddressController.ts
var CreateAddressController_exports = {};
__export(CreateAddressController_exports, {
  CreateAddressController: () => CreateAddressController
});
module.exports = __toCommonJS(CreateAddressController_exports);

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

// src/services/address/CreateAddressService.ts
var CreateAddressService = class {
  async execute(data) {
    try {
      const address = await prisma_default.address.create({
        data
      });
      return address;
    } catch (error) {
      throw new BadRequestException(
        error.message,
        500 /* SYSTEM_ERROR */
      );
    }
  }
};

// src/schemas/address/createAddress.ts
var import_zod = require("zod");
var createAddressSchema = import_zod.z.object({
  client_id: import_zod.z.string().nonempty("client_id is required"),
  street: import_zod.z.string().nonempty("street is required"),
  street_number: import_zod.z.string().nonempty("street_number is required"),
  complement: import_zod.z.string().optional(),
  reference_point: import_zod.z.string().optional(),
  neighborhood: import_zod.z.string().nonempty("neighborhood is required"),
  city: import_zod.z.string().nonempty("city is required"),
  state: import_zod.z.string().nonempty("state is required"),
  postal_code: import_zod.z.string().optional(),
  country: import_zod.z.string().nonempty("country is required")
});

// src/controllers/address/CreateAddressController.ts
var CreateAddressController = class {
  async handle(req, res) {
    const data = req.body;
    const parsed = createAddressSchema.safeParse(data);
    if (!parsed.success) {
      return {
        error: true,
        message: parsed.error.errors[0].message,
        code: 400 /* VALIDATION_ERROR */
      };
    }
    const createAddressService = new CreateAddressService();
    const address = await createAddressService.execute(data);
    return res.json(address);
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  CreateAddressController
});
