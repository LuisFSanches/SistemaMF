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

// src/controllers/orderToReceive/GetAllOrderToReceiveController.ts
var GetAllOrderToReceiveController_exports = {};
__export(GetAllOrderToReceiveController_exports, {
  GetAllOrderToReceiveController: () => GetAllOrderToReceiveController
});
module.exports = __toCommonJS(GetAllOrderToReceiveController_exports);

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

// src/services/orderToReceive/GetAllOrderToReceiveService.ts
var GetAllOrderToReceiveService = class {
  async execute(page = 1, pageSize = 10, query) {
    try {
      const skip = (page - 1) * pageSize;
      let whereClause = {};
      if (query) {
        const isNumericQuery = !isNaN(Number(query));
        const orConditions = [
          {
            order: {
              client: {
                OR: [
                  { first_name: { contains: query, mode: "insensitive" } },
                  { last_name: { contains: query, mode: "insensitive" } },
                  { phone_number: { contains: query, mode: "insensitive" } }
                ]
              }
            }
          }
        ];
        if (isNumericQuery) {
          orConditions.push({
            order: {
              code: { equals: Number(query) }
            }
          });
        }
        whereClause = { OR: orConditions };
      }
      const [ordersToReceive, total] = await Promise.all([
        prisma_default.orderToReceive.findMany({
          where: whereClause,
          include: {
            order: {
              select: {
                code: true,
                total: true,
                payment_received: true,
                created_at: true,
                client: {
                  select: {
                    id: true,
                    first_name: true,
                    last_name: true,
                    phone_number: true
                  }
                }
              }
            }
          },
          orderBy: {
            payment_due_date: "asc"
          },
          skip,
          take: pageSize
        }),
        prisma_default.orderToReceive.count({
          where: whereClause
        })
      ]);
      return {
        ordersToReceive,
        total,
        currentPage: page,
        totalPages: Math.ceil(total / pageSize)
      };
    } catch (error) {
      console.error("[GetAllOrderToReceiveService] Failed:", error);
      throw new BadRequestException(
        error.message,
        500 /* SYSTEM_ERROR */
      );
    }
  }
};

// src/controllers/orderToReceive/GetAllOrderToReceiveController.ts
var GetAllOrderToReceiveController = class {
  async handle(req, res, next) {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const query = req.query.query;
    const getAllOrderToReceiveService = new GetAllOrderToReceiveService();
    const result = await getAllOrderToReceiveService.execute(page, pageSize, query);
    return res.json(result);
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  GetAllOrderToReceiveController
});
