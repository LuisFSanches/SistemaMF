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

// src/controllers/order/UpdateOrderStatusController.ts
var UpdateOrderStatusController_exports = {};
__export(UpdateOrderStatusController_exports, {
  UpdateOrderStatusController: () => UpdateOrderStatusController
});
module.exports = __toCommonJS(UpdateOrderStatusController_exports);

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

// src/services/order/UpdateOrderStatusService.ts
var UpdateOrderStatusService = class {
  async execute({ id, status }) {
    try {
      const updateOrder = await prisma_default.order.update({
        where: {
          id
        },
        data: {
          status
        },
        include: {
          client: true,
          clientAddress: true
        }
      });
      return updateOrder;
    } catch (error) {
      throw new BadRequestException(
        error.message,
        500 /* SYSTEM_ERROR */
      );
    }
  }
};

// src/controllers/order/UpdateOrderStatusController.ts
var UpdateOrderStatusController = class {
  async handle(req, res, next) {
    const { id, status } = req.body;
    const updateOrderStatusService = new UpdateOrderStatusService();
    const order = await updateOrderStatusService.execute({
      id,
      status
    });
    return res.json(order);
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  UpdateOrderStatusController
});
