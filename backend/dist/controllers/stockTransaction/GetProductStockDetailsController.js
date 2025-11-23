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

// src/controllers/stockTransaction/GetProductStockDetailsController.ts
var GetProductStockDetailsController_exports = {};
__export(GetProductStockDetailsController_exports, {
  GetProductStockDetailsController: () => GetProductStockDetailsController
});
module.exports = __toCommonJS(GetProductStockDetailsController_exports);

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

// src/services/stockTransaction/GetProductStockDetailsService.ts
var GetProductStockDetailsService = class {
  async execute(product_id) {
    try {
      const product = await prisma_default.product.findUnique({
        where: { id: product_id },
        select: {
          id: true,
          name: true,
          image: true,
          stock: true,
          price: true
        }
      });
      if (!product) {
        throw new BadRequestException(
          "Product not found",
          400 /* USER_NOT_FOUND */
        );
      }
      const transactions = await prisma_default.stockTransaction.findMany({
        where: { product_id },
        include: {
          supplierRelation: true
        },
        orderBy: {
          purchased_date: "desc"
        }
      });
      const formattedTransactions = transactions.map((transaction) => ({
        id: transaction.id,
        purchased_date: transaction.purchased_date,
        supplier: transaction.supplierRelation?.name || transaction.supplier,
        unity: transaction.unity,
        quantity: transaction.quantity,
        unity_price: transaction.unity_price,
        total_price: transaction.total_price
      }));
      const priceHistory = transactions.map((transaction) => ({
        date: transaction.purchased_date,
        unity_price: transaction.unity_price
      })).sort((a, b) => a.date.getTime() - b.date.getTime());
      const totalQuantityPurchased = transactions.reduce(
        (sum, transaction) => sum + transaction.quantity,
        0
      );
      const averagePrice = transactions.length > 0 ? transactions.reduce((sum, transaction) => sum + transaction.unity_price, 0) / transactions.length : 0;
      const lastPurchaseDate = transactions.length > 0 ? transactions[0].purchased_date : null;
      const metrics = {
        total_quantity_purchased: totalQuantityPurchased,
        current_stock: product.stock,
        average_price: averagePrice,
        last_purchase_date: lastPurchaseDate
      };
      return {
        product_info: {
          id: product.id,
          name: product.name,
          image: product.image,
          price: product.price
        },
        transactions: formattedTransactions,
        price_history: priceHistory,
        metrics
      };
    } catch (error) {
      console.error("[GetProductStockDetailsService] Failed:", error);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(
        error.message,
        500 /* SYSTEM_ERROR */
      );
    }
  }
};

// src/controllers/stockTransaction/GetProductStockDetailsController.ts
var GetProductStockDetailsController = class {
  async handle(req, res, next) {
    const { id } = req.params;
    const getProductStockDetailsService = new GetProductStockDetailsService();
    const stockDetails = await getProductStockDetailsService.execute(id);
    return res.json(stockDetails);
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  GetProductStockDetailsController
});
