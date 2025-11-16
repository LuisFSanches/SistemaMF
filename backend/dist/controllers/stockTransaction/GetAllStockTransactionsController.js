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

// src/controllers/stockTransaction/GetAllStockTransactionsController.ts
var GetAllStockTransactionsController_exports = {};
__export(GetAllStockTransactionsController_exports, {
  GetAllStockTransactionsController: () => GetAllStockTransactionsController
});
module.exports = __toCommonJS(GetAllStockTransactionsController_exports);

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

// src/services/stockTransaction/GetAllStockTransactionsService.ts
var GetAllStockTransactionsService = class {
  async execute(page = 1, pageSize = 10, query) {
    try {
      const skip = (page - 1) * pageSize;
      const filters = query ? {
        OR: [
          {
            product: {
              name: {
                contains: query,
                mode: "insensitive"
              }
            }
          },
          {
            supplier: {
              contains: query,
              mode: "insensitive"
            }
          }
        ]
      } : {};
      const [stockTransaction, total] = await Promise.all([
        prisma_default.stockTransaction.findMany({
          where: filters,
          include: {
            product: true,
            supplierRelation: true
          },
          orderBy: {
            purchased_date: "desc"
          },
          skip,
          take: pageSize
        }),
        prisma_default.stockTransaction.count({
          where: filters
        })
      ]);
      return {
        stockTransactions: stockTransaction,
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

// src/controllers/stockTransaction/GetAllStockTransactionsController.ts
var GetAllStockTransactionsController = class {
  async handle(req, res, next) {
    const { page = "1", pageSize = "10", query = "" } = req.query;
    const getAllService = new GetAllStockTransactionsService();
    const transactions = await getAllService.execute(
      Number(page),
      Number(pageSize),
      String(query)
    );
    return res.json(transactions);
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  GetAllStockTransactionsController
});
