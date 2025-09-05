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

// src/controllers/order/GetAllOrderController.ts
var GetAllOrderController_exports = {};
__export(GetAllOrderController_exports, {
  GetAllOrderController: () => GetAllOrderController
});
module.exports = __toCommonJS(GetAllOrderController_exports);

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

// src/services/order/GetAllOrderService.ts
var GetAllOrderService = class {
  async execute(page = 1, pageSize = 10, query) {
    try {
      const skip = (page - 1) * pageSize;
      const filters = query ? {
        OR: [
          {
            client: {
              OR: [
                { first_name: { contains: query, mode: "insensitive" } },
                { last_name: { contains: query, mode: "insensitive" } },
                { phone_number: { contains: query, mode: "insensitive" } }
              ]
            }
          },
          {
            code: {
              equals: isNaN(Number(query)) ? void 0 : Number(query)
            }
          }
        ]
      } : {};
      const [orders, total] = await Promise.all([
        prisma_default.order.findMany({
          where: filters,
          include: {
            client: true,
            clientAddress: true,
            createdBy: true,
            orderItems: {
              include: {
                product: true
              }
            }
          },
          orderBy: {
            code: "desc"
          },
          skip,
          take: pageSize
        }),
        prisma_default.order.count({
          where: filters
        })
      ]);
      return {
        orders,
        total,
        currentPage: page,
        totalPages: Math.ceil(total / pageSize)
      };
    } catch (error) {
      throw new BadRequestException(
        error.message,
        500 /* SYSTEM_ERROR */
      );
    }
  }
};

// src/controllers/order/GetAllOrderController.ts
var GetAllOrderController = class {
  async handle(req, res) {
    const { page = "1", pageSize = "10", query = "" } = req.query;
    const getAllOrderService = new GetAllOrderService();
    const orders = await getAllOrderService.execute(
      Number(page),
      Number(pageSize),
      String(query)
    );
    return res.json(orders);
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  GetAllOrderController
});
