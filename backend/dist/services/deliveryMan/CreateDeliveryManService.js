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

// src/services/deliveryMan/CreateDeliveryManService.ts
var CreateDeliveryManService_exports = {};
__export(CreateDeliveryManService_exports, {
  CreateDeliveryManService: () => CreateDeliveryManService
});
module.exports = __toCommonJS(CreateDeliveryManService_exports);

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

// src/schemas/deliveryMan/createDeliveryMan.ts
var import_zod = require("zod");
var createDeliveryManSchema = import_zod.z.object({
  name: import_zod.z.string().nonempty("name is required"),
  phone_number: import_zod.z.string().nonempty("phone_number is required")
});

// src/exceptions/bad-request.ts
var BadRequestException = class extends HttpException {
  constructor(message, errorCode) {
    super(message, errorCode, 400, null);
  }
};

// src/services/deliveryMan/CreateDeliveryManService.ts
var CreateDeliveryManService = class {
  async execute(data) {
    const parsed = createDeliveryManSchema.safeParse(data);
    if (!parsed.success) {
      throw new BadRequestException(
        parsed.error.errors[0].message,
        400 /* VALIDATION_ERROR */
      );
    }
    const existingDeliveryMan = await prisma_default.deliveryMan.findFirst({
      where: { phone_number: parsed.data.phone_number }
    });
    if (existingDeliveryMan) {
      throw new BadRequestException(
        "Delivery man with this phone number already exists",
        400 /* USER_ALREADY_EXISTS */
      );
    }
    try {
      const deliveryMan = await prisma_default.deliveryMan.create({
        data: {
          name: parsed.data.name,
          phone_number: parsed.data.phone_number
        }
      });
      return deliveryMan;
    } catch (error) {
      console.error("[CreateDeliveryManService] Failed:", error);
      throw new BadRequestException(
        error.message,
        500 /* SYSTEM_ERROR */
      );
    }
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  CreateDeliveryManService
});
