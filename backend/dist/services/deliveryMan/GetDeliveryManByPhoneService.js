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

// src/services/deliveryMan/GetDeliveryManByPhoneService.ts
var GetDeliveryManByPhoneService_exports = {};
__export(GetDeliveryManByPhoneService_exports, {
  GetDeliveryManByPhoneService: () => GetDeliveryManByPhoneService
});
module.exports = __toCommonJS(GetDeliveryManByPhoneService_exports);

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
  async execute({ phone_number }) {
    if (!phone_number) {
      throw new BadRequestException(
        "phone_number is required",
        400 /* VALIDATION_ERROR */
      );
    }
    try {
      const deliveryMan = await prisma_default.deliveryMan.findFirst({
        where: { phone_number }
      });
      if (!deliveryMan) {
        throw new BadRequestException(
          "Delivery man not found",
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  GetDeliveryManByPhoneService
});
