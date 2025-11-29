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

// src/controllers/deliveryMan/UpdateDeliveryManController.ts
var UpdateDeliveryManController_exports = {};
__export(UpdateDeliveryManController_exports, {
  UpdateDeliveryManController: () => UpdateDeliveryManController
});
module.exports = __toCommonJS(UpdateDeliveryManController_exports);

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

// src/schemas/deliveryMan/updateDeliveryMan.ts
var import_zod = require("zod");
var updateDeliveryManSchema = import_zod.z.object({
  name: import_zod.z.string().optional(),
  phone_number: import_zod.z.string().optional()
});

// src/exceptions/bad-request.ts
var BadRequestException = class extends HttpException {
  constructor(message, errorCode) {
    super(message, errorCode, 400, null);
  }
};

// src/services/deliveryMan/UpdateDeliveryManService.ts
var UpdateDeliveryManService = class {
  async execute({ id, ...data }) {
    const parsed = updateDeliveryManSchema.safeParse(data);
    if (!parsed.success) {
      throw new BadRequestException(
        parsed.error.errors[0].message,
        400 /* VALIDATION_ERROR */
      );
    }
    const existingDeliveryMan = await prisma_default.deliveryMan.findFirst({
      where: { id }
    });
    if (!existingDeliveryMan) {
      throw new BadRequestException(
        "Delivery man not found",
        400 /* USER_NOT_FOUND */
      );
    }
    if (parsed.data.phone_number && parsed.data.phone_number !== existingDeliveryMan.phone_number) {
      const phoneInUse = await prisma_default.deliveryMan.findFirst({
        where: {
          phone_number: parsed.data.phone_number,
          id: { not: id }
        }
      });
      if (phoneInUse) {
        throw new BadRequestException(
          "Phone number already in use by another delivery man",
          400 /* USER_ALREADY_EXISTS */
        );
      }
    }
    try {
      const deliveryMan = await prisma_default.deliveryMan.update({
        where: { id },
        data: parsed.data
      });
      return deliveryMan;
    } catch (error) {
      console.error("[UpdateDeliveryManService] Failed:", error);
      throw new BadRequestException(
        error.message,
        500 /* SYSTEM_ERROR */
      );
    }
  }
};

// src/controllers/deliveryMan/UpdateDeliveryManController.ts
var UpdateDeliveryManController = class {
  async handle(req, res, next) {
    const { id } = req.params;
    const { name, phone_number } = req.body;
    const updateDeliveryManService = new UpdateDeliveryManService();
    const deliveryMan = await updateDeliveryManService.execute({
      id,
      name,
      phone_number
    });
    return res.json(deliveryMan);
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  UpdateDeliveryManController
});
