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

// src/controllers/orderDelivery/DeleteOrderDeliveryController.ts
var DeleteOrderDeliveryController_exports = {};
__export(DeleteOrderDeliveryController_exports, {
  DeleteOrderDeliveryController: () => DeleteOrderDeliveryController
});
module.exports = __toCommonJS(DeleteOrderDeliveryController_exports);

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

// src/services/orderDelivery/DeleteOrderDeliveryService.ts
var DeleteOrderDeliveryService = class {
  async execute({ id }) {
    const existingOrderDelivery = await prisma_default.orderDelivery.findFirst({
      where: { id }
    });
    if (!existingOrderDelivery) {
      throw new BadRequestException(
        "Order delivery not found",
        400 /* USER_NOT_FOUND */
      );
    }
    try {
      await prisma_default.orderDelivery.delete({
        where: { id }
      });
      return { message: "Order delivery deleted successfully" };
    } catch (error) {
      console.error("[DeleteOrderDeliveryService] Failed:", error);
      throw new BadRequestException(
        error.message,
        500 /* SYSTEM_ERROR */
      );
    }
  }
};

// src/controllers/orderDelivery/DeleteOrderDeliveryController.ts
var DeleteOrderDeliveryController = class {
  async handle(req, res, next) {
    const { id } = req.params;
    const deleteOrderDeliveryService = new DeleteOrderDeliveryService();
    const result = await deleteOrderDeliveryService.execute({ id });
    return res.json(result);
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  DeleteOrderDeliveryController
});
