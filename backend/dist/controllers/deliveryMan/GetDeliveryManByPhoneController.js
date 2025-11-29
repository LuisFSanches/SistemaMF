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

// src/controllers/deliveryMan/GetDeliveryManByPhoneController.ts
var GetDeliveryManByPhoneController_exports = {};
__export(GetDeliveryManByPhoneController_exports, {
  GetDeliveryManByPhoneController: () => GetDeliveryManByPhoneController
});
module.exports = __toCommonJS(GetDeliveryManByPhoneController_exports);

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

// src/services/deliveryMan/GetDeliveryManByPhoneService.ts
var GetDeliveryManByPhoneService = class {
  async execute({ phone_code }) {
    if (!phone_code) {
      throw new BadRequestException(
        "phone_code is required",
        400 /* VALIDATION_ERROR */
      );
    }
    if (phone_code.length !== 4) {
      throw new BadRequestException(
        "phone_code must have exactly 4 digits",
        400 /* VALIDATION_ERROR */
      );
    }
    try {
      const deliveryMan = await prisma_default.deliveryMan.findFirst({
        where: {
          phone_number: {
            endsWith: phone_code
          }
        }
      });
      if (!deliveryMan) {
        throw new BadRequestException(
          "Delivery man not found with these last 4 digits",
          400 /* USER_NOT_FOUND */
        );
      }
      return deliveryMan;
    } catch (error) {
      console.error("[GetDeliveryManByPhoneService] Failed:", error);
      throw new BadRequestException(
        error.message,
        500 /* SYSTEM_ERROR */
      );
    }
  }
};

// src/controllers/deliveryMan/GetDeliveryManByPhoneController.ts
var GetDeliveryManByPhoneController = class {
  async handle(req, res, next) {
    const { phone_code } = req.query;
    const getDeliveryManByPhoneService = new GetDeliveryManByPhoneService();
    const deliveryMan = await getDeliveryManByPhoneService.execute({
      phone_code
    });
    return res.json(deliveryMan);
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  GetDeliveryManByPhoneController
});
