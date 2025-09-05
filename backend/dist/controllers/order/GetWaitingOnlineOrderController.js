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

// src/controllers/order/GetWaitingOnlineOrderController.ts
var GetWaitingOnlineOrderController_exports = {};
__export(GetWaitingOnlineOrderController_exports, {
  GetWaitingOnlineOrderController: () => GetWaitingOnlineOrderController
});
module.exports = __toCommonJS(GetWaitingOnlineOrderController_exports);

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

// src/services/order/GetWaitingOnlineOrderService.ts
var GetWaitingOnlineOrderService = class {
  async execute() {
    try {
      const orders = await prisma_default.order.findMany({
        where: {
          status: "WAITING_FOR_CLIENT"
        },
        include: {
          client: true,
          clientAddress: true,
          createdBy: true
        },
        orderBy: {
          code: "desc"
        }
      });
      return { orders };
    } catch (error) {
      throw new BadRequestException(
        "Client already created",
        400 /* USER_ALREADY_EXISTS */
      );
    }
  }
};

// src/controllers/order/GetWaitingOnlineOrderController.ts
var GetWaitingOnlineOrderController = class {
  async handle(req, res) {
    const getWaitingOnlineOrderService = new GetWaitingOnlineOrderService();
    const orders = await getWaitingOnlineOrderService.execute();
    return res.json(orders);
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  GetWaitingOnlineOrderController
});
